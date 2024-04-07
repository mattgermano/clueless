"""WebSocket server that accepts game connections from clients and processes events"""

import json
import secrets
from functools import wraps
from typing import Any, Callable, Dict, List

from channels.generic.websocket import AsyncWebsocketConsumer

from . import clueless

JOIN_GAMES = {}
WATCH_GAMES = {}


def require_keys(required_keys: List[str]):
    """Defines a decorator function that checks if a given list of keys are present in a dictionary

    Parameters
    ----------
    required_keys : List[str]
        A list of keys that must be present in the dictionary
    """

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(self, event):
            missing_keys = [key for key in required_keys if key not in event]
            if missing_keys:
                missing_keys_str = ", ".join(missing_keys)
                await self.error(f"Missing required keys in event: {missing_keys_str}")
                return
            return await func(self, event)

        return wrapper

    return decorator


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
            game = JOIN_GAMES[game_id]
        except KeyError:
            await self.error(f"Game with ID {game_id} not found!")
            return

        event = {
            "type": "position",
            "character_positions": {},
            "weapon_positions": {},
        }

        for character, position in game.character_positions.items():
            event["character_positions"][character] = {
                "x": position[0],
                "y": position[1],
            }
        for weapon, position in game.weapon_positions.items():
            event["weapon_positions"][weapon] = {
                "x": position[0],
                "y": position[1],
            }

        await self.channel_layer.group_send(
            game_id, {"type": "game_event", "message": json.dumps(event)}
        )

    async def broadcast_turn(self, game_id: str) -> None:
        """Sends the current turn information to all connected clients

        Parameters
        ----------
        game_id : str
            The game to broadcast a turn event for
        """
        try:
            game = JOIN_GAMES[game_id]
        except KeyError:
            await self.error(f"Game with ID {game_id} not found!")
            return

        event = {
            "type": "turn",
            "character": game.turn["character"],
            "actions": game.turn["actions"],
        }

        await self.channel_layer.group_send(
            game_id, {"type": "game_event", "message": json.dumps(event)}
        )

    @require_keys(["character", "player_count"])
    async def start(self, event: Dict[str, Any]) -> None:
        """
        Handles a connection from the first player and starts a new game

        Parameters
        ----------
        event : Dict[str, Any]
            The start game event
        """
        join_key = secrets.token_urlsafe(12)
        watch_key = secrets.token_urlsafe(12)

        # Create a game instance
        game = clueless.Clueless(join_key, event["player_count"])
        game.add_character(event["character"])

        JOIN_GAMES[join_key] = game
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
        await self.broadcast_positions(join_key)

    @require_keys(["join"])
    async def join(self, event: Dict[str, str]) -> None:
        """Handles a connection for subsequent players that join an existing game

        Parameters
        ----------
        event : Dict[str, str]
            The join game event
        """
        try:
            game = JOIN_GAMES[event["join"]]
            try:
                game.add_character(event["character"])
            except RuntimeError as exc:
                await self.error(str(exc))
        except KeyError:
            await self.error("Game with ID {} not found!".format(event["join"]))
            return

        # Add the player to the channel group
        await self.channel_layer.group_add(event["join"], self.channel_name)

        # Send a "position" event to update the UI for connected clients
        await self.broadcast_positions(event["join"])

        if game.is_full():
            start_event = {
                "type": "start",
                "cards": {},
            }

            for character, cards in game.character_cards.items():
                start_event["cards"][character] = cards

            await self.channel_layer.group_send(
                event["join"],
                {"type": "game_event", "message": json.dumps(start_event)},
            )
            await self.broadcast_turn(event["join"])

    @require_keys(["watch"])
    async def watch(self, event: Dict[str, str]) -> None:
        """Handles a connection for spectators joining an existing game

        Parameters
        ----------
        event : Dict[str, str]
            The watch game event
        """
        try:
            game = WATCH_GAMES[event["watch"]]
        except KeyError:
            await self.error("Game with ID {} not found!".format(event["watch"]))
            return

        await self.channel_layer.group_add(game.id, self.channel_name)
        await self.broadcast_positions(game.id)

    @require_keys(["game_id", "character", "x", "y"])
    async def move(self, event: Dict[str, Any]) -> None:
        """Processes a move event

        Parameters
        ----------
        event : Dict[str, Any]
            The move event
        """
        try:
            game = JOIN_GAMES[event["game_id"]]
        except KeyError:
            await self.error("Game with ID {} not found!".format(event["game_id"]))
            return

        try:
            # Play the move
            game.move(event["character"], event["x"], event["y"])
        except RuntimeError as exc:
            # Send an "error" event if the move was illegal
            await self.error(str(exc))
            return

        # Send a "position" event to update the UI
        await self.broadcast_positions(event["game_id"])
        await self.broadcast_turn(event["game_id"])

    @require_keys(["game_id", "character", "suspect", "weapon"])
    async def suggest(self, event: Dict[str, str]):
        """Processes a suggestion event

        Parameters
        ----------
        event : Dict[str, str]
            The suggestion event
        """
        try:
            game = JOIN_GAMES[event["game_id"]]
        except KeyError:
            await self.error("Game with ID {} not found!".format(event["game_id"]))
            return

        try:
            # Make the suggestion
            game.suggest(event["character"], event["suspect"], event["weapon"])
        except RuntimeError as exc:
            await self.error(str(exc))

        await self.broadcast_positions(event["game_id"])

        event["room"] = clueless.room_positions[
            game.character_positions[event["character"]]
        ]
        await self.channel_layer.group_send(
            event["game_id"], {"type": "game_event", "message": json.dumps(event)}
        )

        await self.broadcast_turn(event["game_id"])

    @require_keys(["game_id", "character", "suspect", "weapon", "room"])
    async def accuse(self, event: Dict[str, str]) -> None:
        """Processes an accusation event

        Parameters
        ----------
        event : Dict[str, str]
            The accusation event
        """
        try:
            game = JOIN_GAMES[event["game_id"]]
        except KeyError:
            await self.error("Game with ID {} not found!".format(event["game_id"]))
            return

        try:
            # Make the accusation
            game.accuse(
                event["character"], event["suspect"], event["weapon"], event["room"]
            )

            if game.winner is not None:
                win_event = {"type": "win", "player": game.winner}
                await self.channel_layer.group_send(
                    event["game_id"],
                    {"type": "game_event", "message": json.dumps(win_event)},
                )
                return

        except RuntimeError as exc:
            await self.error(str(exc))

        await self.broadcast_turn(event["game_id"])

    @require_keys(["game_id", "card"])
    async def disprove(self, event: Dict[str, str]) -> None:
        """Processes a disprove event

        Parameters
        ----------
        event : Dict[str, str]
            The disprove event
        """
        try:
            game = JOIN_GAMES[event["game_id"]]
        except KeyError:
            await self.error("Game with ID {} not found!".format(event["game_id"]))
            return

        try:
            game.disprove(event["card"])

        except RuntimeError as exc:
            await self.error(str(exc))

        # TODO: this does not work if there are 3 players, 2 of which have lost
        # No one was able to disprove the suggestion
        if game.turn["character"] == game.last_suggestion["character"]:
            game.turn["actions"] = [
                clueless.Action.Accuse.name,
                clueless.Action.End.name,
            ]

        await self.broadcast_turn(event["game_id"])

        disprove_event = {
            "type": "disprove",
            "character": game.last_suggestion["character"],
            "disprover": game.disprover,
            "card": event["card"],
        }
        await self.channel_layer.group_send(
            event["game_id"],
            {"type": "game_event", "message": json.dumps(disprove_event)},
        )

    @require_keys(["game_id"])
    async def end_turn(self, event: Dict[str, str]) -> None:
        """Ends the current players turn

        Parameters
        ----------
        event : Dict[str,str]
            The end_turn event
        """
        try:
            game = JOIN_GAMES[event["game_id"]]
        except KeyError:
            await self.error("Game with ID {} not found!".format(event["game_id"]))
            return

        game.next_turn()
        game.turn["actions"] = [clueless.Action.Move.name, clueless.Action.Accuse.name]

        await self.broadcast_turn(event["game_id"])

    @require_keys(["game_id"])
    async def query_game(self, event: Dict[str, str]) -> None:
        """Processes a query_game event

        Parameters
        ----------
        event : Dict[str, str]
            The query_game event
        """
        valid = False

        if event["game_id"] in JOIN_GAMES:
            game = JOIN_GAMES[event["game_id"]]
            spectator = False
            valid = True
        elif event["game_id"] in WATCH_GAMES:
            game = WATCH_GAMES[event["game_id"]]
            spectator = True
            valid = True
        else:
            return

        query_game_event = {
            "type": "query_game",
            "valid": valid,
            "characters": [] if game.is_full() else game.get_available_characters(),
            "spectator": spectator,
        }
        await self.send(json.dumps(query_game_event))

    async def init(self, event: Dict[str, str]) -> None:
        """Processes an initialization event

        Parameters
        ----------
        event : Dict[str, str]
            The initialization event
        """
        if "join" in event:
            # Players join an existing game
            await self.join(event)
        elif "watch" in event:
            # Spectators watch an existing game
            await self.watch(event)
        else:
            # First player starts a new game
            await self.start(event)

    async def game_event(self, event: Dict[str, Any]) -> None:
        """Callback function executed when sending a message to a group

        Parameters
        ----------
        event: Dict[str, Any]
            The event to send to the client
        """
        message = event["message"]

        await self.send(text_data=message)

    async def receive(self, text_data: str) -> None:
        """Receives a message from the Websocket

        Parameters
        ----------
        text_data : str
            The received message
        """
        event = json.loads(text_data)
        event_formatted = json.dumps(event, indent=2)

        print(f"Received event from frontend: {event_formatted}\n", flush=True)

        if "type" not in event:
            await self.error("Received event without a type!")
            return

        # Define a dispatch table
        event_handlers = {
            "init": self.init,
            "move": self.move,
            "suggestion": self.suggest,
            "accusation": self.accuse,
            "disprove": self.disprove,
            "end_turn": self.end_turn,
            "query_game": self.query_game,
        }

        # Get the handler based on the event type
        handler = event_handlers.get(
            event["type"],
            lambda e: self.error(
                "Received invalid event with type {}!".format(e["type"])
            ),
        )

        if callable(handler):
            await handler(event)
