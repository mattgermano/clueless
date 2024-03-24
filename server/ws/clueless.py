import random
from copy import deepcopy
from typing import Dict, List, Tuple

clue_cards: Dict[str, List[str]] = {
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

character_positions: Dict[str, Tuple] = {
    "miss_scarlett": (4, 0),
    "colonel_mustard": (6, 2),
    "mrs_white": (4, 6),
    "mr_green": (2, 6),
    "mrs_peacock": (0, 4),
    "professor_plum": (0, 2),
}

hallway_posistions: List[Tuple] = [
    (2, 1),
    (4, 1),
    (1, 2),
    (3, 2),
    (5, 2),
    (2, 3),
    (4, 3),
    (1, 4),
    (3, 4),
    (5, 4),
    (2, 5),
    (4, 5),
]


class Clueless:
    """
    A Clue-Less game instance
    """

    def __init__(self, id, player_count):
        self.id = id
        self.player_count = player_count
        self.moves = []
        self.characters = []
        self.character_positions = character_positions
        self.character_cards = {}
        self.winner = None
        self.clue_cards = deepcopy(clue_cards)

    def add_character(self, character: str) -> None:
        """Adds a character to the game

        Parameters
        ----------
        character : str
            The character to add
        """
        if not self.is_full():
            self.characters.append(character)
            self.character_cards[character] = []

            if self.is_full():
                # Randomly generate the winning solution when the game becomes full
                self.solution = {
                    "suspect": random.choice(clue_cards["suspects"]),
                    "weapon": random.choice(clue_cards["weapons"]),
                    "room": random.choice(clue_cards["rooms"]),
                }

                # Remove the solution from the cards
                self.clue_cards["suspects"].remove(self.solution["suspect"])
                self.clue_cards["weapons"].remove(self.solution["weapon"])
                self.clue_cards["rooms"].remove(self.solution["room"])

                # Distribute the remaining cards evenly among all players
                self.distribute_cards()
        else:
            raise RuntimeError("Game is currently full!")

    def get_available_characters(self):
        if self.is_full():
            return []
        else:
            return [
                character
                for character in clue_cards["suspects"]
                if character not in self.characters
            ]

    def distribute_cards(self):
        if not self.is_full():
            raise RuntimeError("Cannot distribute cards until game is full!")

        # Flatten the list of cards
        all_cards = sum(self.clue_cards.values(), [])
        # Shuffle the cards to randomize distribution
        random.shuffle(all_cards)

        # Distribute cards evenly among characters
        character_count = len(self.characters)
        for index, card in enumerate(all_cards):
            self.character_cards[self.characters[index % character_count]].append(card)

    def is_full(self):
        return self.player_count == len(self.characters)

    def character_in_hallway(self, x, y):
        for position in character_positions.values():
            if position == (x, y):
                return True

        return False

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
                raise RuntimeError(f"Invalid move by {character}!")

        # Each hallway only holds up to one character
        if (x, y) in hallway_posistions and self.character_in_hallway(x, y):
            raise RuntimeError(
                f"Invalid move by {character}! Hallway is currently occupied."
            )

        character_positions[character] = (x, y)

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
