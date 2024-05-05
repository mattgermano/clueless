import enum

from django.db import models


class Game(models.Model):
    join_id = models.CharField(max_length=12)
    watch_id = models.CharField(max_length=12)
    finished = models.BooleanField(default=False)


class EventType(enum.StrEnum):
    INIT = "init"
    MOVE = "move"
    SUGGESTION = "suggestion"
    ACCUSATION = "accusation"
    DISPROVE = "disprove"
    END_TURN = "end_turn"
    QUERY_GAME = "query_game"
    CHAT = "chat"
    WIN = "win"
    LOSE = "lose"
    TOTAL_LOSS = "all_losers"
    JOIN = "join"
    DISCONNECT = "disconnect"
    END_GAME = "end_game"
    TURN = "turn"
    START = "start"


class Event(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    event_type = models.CharField(
        max_length=20, choices={elem.value: elem.value for elem in EventType}
    )
    event_content = models.JSONField()
