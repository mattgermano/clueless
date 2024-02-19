from channels.generic.websocket import WebsocketConsumer


class PlayerMoveConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        self.send(
            text_data=f"Echoing message: {text_data}",
        )
