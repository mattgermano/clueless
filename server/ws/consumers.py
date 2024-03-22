"""WebSocket server that accepts game connections from clients and processes events"""

import json
import secrets

from channels.generic.websocket import AsyncWebsocketConsumer

from . import clueless

JOIN_GAMES = {}
WATCH_GAMES = {}


class CluelessConsumer(AsyncWebsocketConsumer):
    async def connect(self) -> None:
        """Accepts client connections"""
        await self.accept()

    async def disconnect(self, close_code) -> None:
        """Disconnects clients from the channel"""
        for game_id in JOIN_GAMES.keys():
            await self.channel_layer.group_discard(game_id, self.channel_name)

    async def error(self, error: str) -> None:
        """Sends an error message to the client

        Parameters
        ----------
        error : str
            The error message to send
        """
        event = {"type": "error", "message": error}
        await self.send(json.dumps(event))

    async def broadcast_positions(self, game_id: str) -> None:
        """Sends the current position of characters in a game to all connected clients

        Parameters
        ----------
        game_id : str
            The game to broadcast positions for
        """
        try:
            game: clueless.Clueless = JOIN_GAMES[game_id]
        except KeyError:
            await self.error(f"Game with ID {game_id} not found!")
            return

        positions = game.get_character_positions()
        event = {
            "type": "move",
            "positions": {},
        }

        for character, position in positions.items():
            if character in game.get_characters():
                event["positions"][character] = {"x": position[0], "y": position[1]}

        await self.channel_layer.group_send(
            game_id, {"type": "game_event", "message": json.dumps(event)}
        )

    async def start(self, event) -> None:
        """
        Handles a connection from the first player and starts a new game

        Parameters
        ----------
        event: str
            The start game event
        """

        # Create a game instance
        game: clueless.Clueless = clueless.Clueless()
        game.add_character(event["character"])

        join_key = secrets.token_urlsafe(12)
        JOIN_GAMES[join_key] = game

        watch_key = secrets.token_urlsafe(12)
        WATCH_GAMES[watch_key] = game

        # Add the player to a new channel group
        await self.channel_layer.group_add(join_key, self.channel_name)

        # Send the access token to the browser of the first player
        event = {
            "type": "init",
            "join": join_key,
            "watch": watch_key,
        }
        await self.send(text_data=json.dumps(event))

    async def join(self, event) -> None:
        """Handles a connection for subsequent players that join an existing game

        Parameters
        ----------
        event
            The join game event
        """

        # Find the Clueless game
        try:
            game: clueless.Clueless = JOIN_GAMES[event["join"]]
            game.add_character(event["character"])
        except KeyError:
            await self.error(f"Game with ID {event["join"]} not found!")
            return

        # Add the player to the channel group
        await self.channel_layer.group_add(event["join"], self.channel_name)

        # Send a "move" event to update the UI for connected clients
        await self.broadcast_positions(event["join"])

    async def watch(self, event) -> None:
        """Handles a connection for spectators joining an existing game

        Parameters
        ----------
        event
            The watch game event
        """

        try:
            self.WATCH_GAMES[event["watch"]]
        except KeyError:
            await self.error(f"Game with ID {event["watch"]} not found!")
            return

    async def move(self, event) -> None:
        """Processes a move event

        Parameters
        ----------
        event
            The move event
        """
        try:
            game: clueless.Clueless = JOIN_GAMES[event["game"]]
        except KeyError:
            await self.error(f"Game with ID {event["join"]} not found!")
            return

        try:
            # Play the move
            game.move(event["character"], event["x"], event["y"])
        except RuntimeError as exc:
            # Send an "error" event if the move was illegal
            await self.error(str(exc))
            return

        # Send a "move" event to update the UI
        await self.broadcast_positions(event["game"])

    async def suggest(self, event):
        """Processes a suggestion event

        Parameters
        ----------
        event
            The suggestion event
        """
        try:
            game: clueless.Clueless = JOIN_GAMES[event["game"]]
        except KeyError:
            await self.error(f"Game with ID {event["join"]} not found!")
            return

        try:
            # Make the suggestion
            game.suggest(event["suspect"], event["weapon"])
        except RuntimeError as exc:
            await self.error(str(exc))

    async def accuse(self, event) -> None:
        """Processes an accusation event

        Parameters
        ----------
        event
            The accusation event
        """
        try:
            game: clueless.Clueless = JOIN_GAMES[event["game"]]
        except KeyError:
            await self.error(f"Game with ID {event["game"]} not found!")
            return

        try:
            # Make the accusation
            game.accuse(event["suspect"], event["weapon"], event["room"])

            if game.winner is not None:
                win_event = {"type": "win", "player": game.winner}
                await self.channel_layer.group_send(
                    event["game"],
                    {"type": "game_event", "message": json.dumps(win_event)},
                )

        except RuntimeError as exc:
            await self.error(str(exc))

    async def receive(self, text_data):
        """Receives a message from the Websocket

        Parameters
        ----------
        text_data : str
            The received message
        """
        event = json.loads(text_data)
        event_formatted = json.dumps(event, indent=2)

        print(f"Received event from frontend: {event_formatted}\n")

        if event["type"] == "init":
            if "join" in event:
                # Players join an existing game
                await self.join(event)
            elif "watch" in event:
                # Spectators watch an existing game
                await self.watch(event)
            else:
                # First player starts a new game
                await self.start(event)
        elif event["type"] == "move":
            await self.move(event)
        elif event["type"] == "suggestion":
            # await self.suggest(event)
            pass
        elif event["type"] == "accusation":
            await self.accuse(event)
        elif event["type"] == "query_id":
            if event["id"] not in JOIN_GAMES:
                await self.error("Invalid game ID!")
        else:
            await self.error("Received invalid event!")

    # Receive message from room group
    async def game_event(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=message)
