from concurrent.futures import ThreadPoolExecutor

from . import models


class Manager:
    """
    This class handles requests by other parts of the backend for data in the
    database.
    """

    @staticmethod
    def store_event_information(
        game_id: str, event: dict, event_type: models.EventType
    ) -> None:
        try:
            event_entry = models.Event(
                game=models.Game.objects.get(join_id=game_id),
                event_type=event_type,
                event_content=event,
            )
            event_entry.save()
        except Exception as e:
            print(e, flush=True)

    @staticmethod
    def game_init(join_key: str, watch_key: str, event: dict) -> None:
        def db_transaction(join_key: str, watch_key: str, event: dict) -> None:

            game = models.Game(join_id=join_key, watch_id=watch_key)
            game.save()
            event_entry = models.Event(
                game=game,
                event_type=models.EventType.INIT,
                event_content=event,
            )
            event_entry.save()

        with ThreadPoolExecutor() as executor:
            executor.submit(db_transaction, join_key, watch_key, event)

    @staticmethod
    def game_end(game_id: str) -> None:
        def end_game(game_id: str) -> None:
            try:
                game = models.Game.objects.get(join_id=game_id)
                game.finished = True
                game.save()
            except Exception as e:
                print(e, flush=True)

        with ThreadPoolExecutor() as executor:
            executor.submit(end_game, game_id)

    @staticmethod
    def update_positions(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information, game_id, event, models.EventType.MOVE
            )

    @staticmethod
    def save_suggestion(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information,
                game_id,
                event,
                models.EventType.SUGGESTION,
            )

    @staticmethod
    def save_chat(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information, game_id, event, models.EventType.CHAT
            )

    @staticmethod
    def save_accusation(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information,
                game_id,
                event,
                models.EventType.ACCUSATION,
            )

    @staticmethod
    def save_disprove(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information,
                game_id,
                event,
                models.EventType.DISPROVE,
            )

    @staticmethod
    def save_game_query(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information,
                game_id,
                event,
                models.EventType.QUERY_GAME,
            )

    @staticmethod
    def save_loss(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information,
                game_id,
                event,
                models.EventType.LOSE,
            )

    @staticmethod
    def save_win(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information,
                game_id,
                event,
                models.EventType.WIN,
            )

    @staticmethod
    def save_total_loss(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information,
                game_id,
                event,
                models.EventType.TOTAL_LOSS,
            )

    @staticmethod
    def save_join(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information,
                game_id,
                event,
                models.EventType.JOIN,
            )

    @staticmethod
    def save_disconnect(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information,
                game_id,
                event,
                models.EventType.DISCONNECT,
            )

    @staticmethod
    def save_end_game(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information,
                game_id,
                event,
                models.EventType.END_GAME,
            )

    @staticmethod
    def save_turn(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information,
                game_id,
                event,
                models.EventType.TURN,
            )

    @staticmethod
    def save_start(game_id: str, event: dict) -> None:
        with ThreadPoolExecutor() as executor:
            executor.submit(
                Manager.store_event_information,
                game_id,
                event,
                models.EventType.START,
            )

    @staticmethod
    def get_game_events(game_id: str) -> list[dict]:
        def get_events(game_id: str, event_list: list) -> None:
            try:
                game = models.Game.objects.get(join_id=game_id).id
                events = models.Event.objects.filter(game=game)
                for event in events:
                    if event.event_type not in [
                        models.EventType.INIT,
                        models.EventType.QUERY_GAME,
                        models.EventType.MOVE,
                    ]:
                        event_list.append(event.event_content)
            except Exception as e:
                print(e, flush=True)

        event_list: list[dict] = []
        with ThreadPoolExecutor() as executor:
            executor.submit(get_events, game_id, event_list)

        return event_list
