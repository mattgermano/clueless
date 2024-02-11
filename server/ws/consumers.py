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

    def start(self):
        """
        Handles a connection from the first player and starts a new game
        """

        # Initialize a Clueless game
        game = clueless.Clueless()

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

    def join(self, join_key):
        """Handles a connection for subsequent players to join an existing game

        Parameters
        ----------
        join_key : str
            The unique identifier of the game to join
        """

        # Find the Clueless game
        try:
            JOIN[join_key]
        except KeyError:
            self.error(f"Game with ID {join_key} not found!")

    def watch(self, watch_key):
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

    def move(self, game_id, x, y):
        game = JOIN[game_id]
        try:
            # Play the move
            game.play(x, y)
        except RuntimeError as exc:
            # Send an "error" event if the move was illegal
            self.error(str(exc))

        # Send a "move" event to update the UI.
        event = {
            "type": "move",
            "x": x,
            "y": y,
        }

        # TODO: Update this to broadcast to all connected clients
        self.send(json.dumps(event))

    def suggest(self):
        pass

    def accuse(self):
        pass

    def receive(self, text_data):
        """Receives a message from the Websocket

        Parameters
        ----------
        text_data : str
            The received message
        """
        event = json.loads(text_data)

        if event["type"] == "init":
            if "join" in event:
                # Players join an existing game
                self.join(event["join"])
            elif "watch" in event:
                # Spectators watch an existing game
                self.watch(event["watch"])
            else:
                # First player starts a new game
                self.start()
        elif event["type"] == "move":
            self.move(event["game"], event["x"], event["y"])
        elif event["type"] == "suggestion":
            self.suggest()
        elif event["type"] == "accusation":
            self.accuse()
        else:
            self.error("Received invalid event!")
