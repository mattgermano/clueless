import json
import secrets

from channels.generic.websocket import WebsocketConsumer

from . import clueless

JOIN = {}
WATCH = {}


class CluelessConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def error(self, message: str) -> None:
        """Sends an error message to the client

        Parameters
        ----------
        message : str
            The error message
        """
        event = {"type": "error", "message": message}
        self.send(json.dumps(event))

    def start(self, character: str) -> None:
        """
        Handles a connection from the first player and starts a new game

        Parameters
        ----------
        character: str
            The character starting the game
        """

        # Initialize a Clueless game
        game: clueless.Clueless = clueless.Clueless()
        game.add_character(character)

        join_key = secrets.token_urlsafe(12)
        JOIN[join_key] = game

        watch_key = secrets.token_urlsafe(12)
        WATCH[watch_key] = game

        # Send the access token to the browser of the first player
        event = {
            "type": "init",
            "join": join_key,
            "watch": watch_key,
        }
        self.send(json.dumps(event))

    def join(self, join_key, character: str) -> None:
        """Handles a connection for subsequent players to join an existing game

        Parameters
        ----------
        join_key : str
            The unique identifier of the game to join

        character: str
            The character that joined the game
        """

        # Find the Clueless game
        try:
            game = clueless.Clueless = JOIN[join_key]
            game.add_character(character)
        except KeyError:
            self.error(f"Game with ID {join_key} not found!")

    def watch(self, watch_key: str) -> None:
        """Handles a connection for spectators joining an existing game

        Parameters
        ----------
        watch_key : str
            The unique identifier of the game to spectate
        """

        try:
            WATCH[watch_key]
        except KeyError:
            self.error(f"Game with ID {watch_key} not found!")

    def move(self, game_id: str, character: str, x, y) -> None:
        game: clueless.Clueless = JOIN[game_id]
        try:
            # Play the move
            game.move(character, x, y)
        except RuntimeError as exc:
            # Send an "error" event if the move was illegal
            self.error(str(exc))
            return

        # Send a "move" event to update the UI.
        updated_positions = game.get_character_positions()
        event = {
            "type": "move",
            "positions": {},
        }
        for character, position in updated_positions.items():
            if character in game.get_characters():
                event["positions"][character] = {"x": position[0], "y": position[1]}

        # TODO: Update this to broadcast to all connected clients
        self.send(json.dumps(event))

    def suggest(self, game_id, suspect, weapon, room):
        game: clueless.Clueless = JOIN[game_id]
        try:
            # Make the suggestion
            game.suggest(suspect, weapon)
        except RuntimeError as exc:
            self.error(str(exc))

    def accuse(self, game_id: str, suspect: str, weapon: str, room: str) -> None:
        """Processes an accusation event

        Parameters
        ----------
        game_id : str
            The game instance
        suspect : str
            The suspect to accuse
        weapon : str
            The weapon used
        room : str
            The room
        """
        game: clueless.Clueless = JOIN[game_id]
        try:
            # Make the accusation
            game.accuse(suspect, weapon, room)

            if game.winner is not None:
                event = {"type": "win", "player": game.winner}
                self.send(json.dumps(event))
        except RuntimeError as exc:
            self.error(str(exc))

    def receive(self, text_data):
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
                self.join(event["join"], event["character"])
            elif "watch" in event:
                # Spectators watch an existing game
                self.watch(event["watch"])
            else:
                # First player starts a new game
                self.start(event["character"])
        elif event["type"] == "move":
            self.move(event["game"], event["character"], event["x"], event["y"])
        elif event["type"] == "suggestion":
            # self.suggest(event["game"], event["suspect"], event["weapon"], event["room"])
            pass
        elif event["type"] == "accusation":
            self.accuse(event["game"], event["suspect"], event["weapon"], event["room"])
        else:
            self.error("Received invalid event!")
