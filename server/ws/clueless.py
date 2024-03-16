import random

clue_cards = {
    "suspects": [
        "miss_scarlet",
        "colonel_mustard",
        "mrs_white",
        "mr_green",
        "mrs_peacock",
        "professor_plum",
    ],
    "weapons": ["knife", "candle_stick", "revolver", "rope", "lead_pipe", "wrench"],
    "rooms": [
        "hall",
        "lounge",
        "dining_room",
        "kitchen",
        "ballroom",
        "conservatory",
        "billiard_room",
        "library",
        "study",
    ],
}


class Clueless:
    """
    A Clue-Less game
    """

    def __init__(self):
        self.moves = []
        self.winner = None
        self.clue_cards = clue_cards

        # Randomly generate the winning solution when the game is initialized
        self.solution = {
            "suspect": random.choice(clue_cards["suspects"]),
            "weapon": random.choice(clue_cards["weapons"]),
            "room": random.choice(clue_cards["rooms"]),
        }

        # Remove the solution from the cards
        self.clue_cards["suspects"].remove(self.solution["suspect"])
        self.clue_cards["weapons"].remove(self.solution["weapon"])
        self.clue_cards["rooms"].remove(self.solution["room"])

    def last_player(self):
        """
        Player who played the last move.
        """

    def play(self, x, y):
        """
        Play a move.
        """
        raise RuntimeError(f"Invalid move! ({x}, {y})")

    def suggest(self, suspect: str, weapon: str):
        raise RuntimeError(f"Suggestion ({suspect}, {weapon})")

    def accuse(self, suspect: str, weapon: str, room: str):
        """Makes an accusation

        Parameters
        ----------
        suspect : str
            The suspect
        weapon : str
            The weapon
        room : room
            The room
        """

        if (
            suspect == self.solution["suspect"]
            and weapon == self.solution["weapon"]
            and room == self.solution["room"]
        ):
            if self.winner is None:
                self.winner = "miss_scarlet"
        else:
            raise RuntimeError(
                f"False accusation! Solution is {self.solution["suspect"]} with the {self.solution["weapon"]} in the {self.solution["room"]}"
            )
