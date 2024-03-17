import random

clue_cards = {
    "suspects": [
        "miss_scarlett",
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

character_positions = {
    "miss_scarlett": (0, 0),
    "colonel_mustard": (0, 0),
    "mrs_white": (0, 0),
    "mr_green": (0, 0),
    "mrs_peacock": (0, 0),
    "professor_plum": (0, 0),
}


class Clueless:
    """
    A Clue-Less game
    """

    def __init__(self):
        self.moves = []
        self.characters = []
        self.character_positions = character_positions
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

    def add_character(self, character: str) -> None:
        """Adds a character to the game

        Parameters
        ----------
        character : str
            The character to add
        """
        self.characters.append(character)

    def get_characters(self):
        return self.characters

    def move(self, character: str, x, y) -> None:
        x_current, y_current = self.character_positions[character]

        # Characters cannot move more than one square in any direction (except
        # for secret passages)
        if (abs(x - x_current) > 1 or abs(y - y_current) > 1) or (
            abs(x - x_current) == 1 and abs(y - y_current) == 1
        ):
            # Check for secret passages
            if ((x_current, y_current), (x, y)) in [((0, 0), (4, 4)), ((4, 4), (0, 0))]:
                character_positions[character] = (x, y)
            elif ((x_current, y_current), (x, y)) in [
                ((4, 0), (0, 4)),
                ((0, 4), (4, 0)),
            ]:
                character_positions[character] = (x, y)
            else:
                raise RuntimeError(f"Invalid move by {character}! ({x}, {y})")

        character_positions[character] = (x, y)

    def get_character_positions(self):
        return self.character_positions

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
                self.winner = self.characters[0]
        else:
            raise RuntimeError(
                "False accusation! Solution is {} with the {} in the {}".format(
                    self.solution["suspect"],
                    self.solution["weapon"],
                    self.solution["room"],
                )
            )
