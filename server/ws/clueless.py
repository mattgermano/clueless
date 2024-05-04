import random
from copy import deepcopy
from enum import Enum, auto
from typing import Dict, List, Optional, Tuple

MAX_PLAYER_COUNT: int = 6

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

starting_positions: Dict[str, Tuple[int, int]] = {
    "miss_scarlett": (4, 0),
    "colonel_mustard": (6, 2),
    "mrs_white": (4, 6),
    "mr_green": (2, 6),
    "mrs_peacock": (0, 4),
    "professor_plum": (0, 2),
}

hallways_positions: List[Tuple] = [
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

room_positions: Dict[Tuple, str] = {
    (1, 1): "study",
    (3, 1): "hall",
    (5, 1): "lounge",
    (1, 3): "library",
    (3, 3): "billiard_room",
    (5, 3): "dining_room",
    (1, 5): "conservatory",
    (3, 5): "ballroom",
    (5, 5): "kitchen",
}


class Action(Enum):
    Move = auto()
    Suggest = auto()
    Accuse = auto()
    Disprove = auto()
    End = auto()
    NONE = auto()


class Clueless:
    """
    A Clue-Less game instance that processes moves, accusations, and
    suggestions.
    """

    def __init__(self, id: str, player_count: int) -> None:
        """Initialize a game of Clue-Less

        Parameters
        ----------
        id : str
            The game ID
        player_count : int
            The number of players that must join before the game commences
        """
        self.id = id
        self.player_count = player_count
        self.characters: List[str] = []
        self.character_positions: Dict[str, Tuple[int, int]] = {}
        self.weapon_positions: Dict[str, Tuple[int, int]] = {
            "knife": (-1, -1),
            "candle_stick": (-1, -1),
            "revolver": (-1, -1),
            "rope": (-1, -1),
            "lead_pipe": (-1, -1),
            "wrench": (-1, -1),
        }
        self.turn_number = 1
        self.disprover = None
        self.last_suggestion = {}
        self.character_cards: Dict[str, List[str]] = {}
        self.clue_cards = deepcopy(clue_cards)
        self.turn = {"character": "", "actions": [Action.NONE.name]}
        self.losers = []
        self.last_positions = {}
        self.winner: Optional[str] = None

    def add_character(self, character: str) -> None:
        """Adds a character to the game

        Parameters
        ----------
        character : str
            The character to add
        """
        if not self.is_full():
            self.characters.append(character)
            self.character_positions[character] = starting_positions[character]
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
                # Distribute the weapon tokens across rooms
                self.distribute_weapons()

                # Sort the characters into the correct turn order
                self.characters = sorted(
                    self.characters, key=lambda x: clue_cards["suspects"].index(x)
                )

                # If there are fewer than 6 people playing, the remaining
                # characters must be distributed
                if self.player_count < MAX_PLAYER_COUNT:
                    inactive_characters = [
                        character
                        for character in clue_cards["suspects"]
                        if character not in self.characters
                    ]
                    for character in inactive_characters:
                        self.character_positions[character] = starting_positions[
                            character
                        ]

                self.turn["character"] = self.characters[0]
                self.turn["actions"] = [Action.Move.name]
        else:
            raise RuntimeError("Game is currently full!")

    def get_available_characters(self) -> list[str]:
        """Gets a list of unchosen characters

        Returns
        -------
        List[str]
            The list of characters not yet chosen
        """
        return [
            character
            for character in clue_cards["suspects"]
            if character not in self.characters
        ]

    def distribute_cards(self) -> None:
        """Shuffles and evenly distributes Clue cards to all players"""
        # Flatten the list of cards
        all_cards: List[str] = sum(self.clue_cards.values(), [])
        # Shuffle the cards to randomize distribution
        random.shuffle(all_cards)

        # Distribute cards evenly among characters
        character_count = len(self.characters)
        for index, card in enumerate(all_cards):
            self.character_cards[self.characters[index % character_count]].append(card)

    def distribute_weapons(self) -> None:
        """Distributes weapons across random board squares"""
        rooms = list(room_positions.keys())
        random.shuffle(rooms)

        for index, weapon in enumerate(self.weapon_positions):
            self.weapon_positions[weapon] = rooms[index]

    def is_full(self) -> bool:
        """Checks if the current game is full

        Returns
        -------
        bool
            True if the game is full, else False
        """
        return self.player_count == len(self.characters)

    def character_in_room(self, x: int, y: int) -> bool:
        """Checks if a character is currently occupying a given room

        Parameters
        ----------
        x : int
            The x-coordinate of the room
        y : int
            The y-coordinate of the room

        Returns
        -------
        bool
            True if a character is in the room, else False
        """
        for position in self.character_positions.values():
            if position == (x, y):
                return True

        return False

    def next_turn(self) -> None:
        """Sets the current turn to the next character"""
        self.disprover = None
        self.turn_number += 1

        self.turn["character"] = self.characters[
            (self.characters.index(self.turn["character"]) + 1) % len(self.characters)
        ]

        if (
            self.turn["character"] in self.losers
            and Action.Disprove.name not in self.turn["actions"]
        ):
            self.next_turn()

        # Check if player is trapped in room
        position_x, position_y = self.character_positions[self.turn["character"]]

        # Define the relative positions of adjacent hallways
        relative_positions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

        # Initialize counters for adjacent hallways and players in those hallways
        adjacent_hallways, players_in_adjacent_hallway = 0, 0
        # Player is not in a hallway or in corner rooms, implying they are in a room
        if (position_x, position_y) not in hallways_positions and (
            position_x,
            position_y,
        ) not in [(1, 1), (5, 5), (5, 1), (1, 5)]:
            # Iterate over each relative position to check adjacent hallways
            for dx, dy in relative_positions:
                adjacent_pos = (position_x + dx, position_y + dy)
                if adjacent_pos in hallways_positions:
                    adjacent_hallways += 1
                    if self.character_in_room(*adjacent_pos):
                        players_in_adjacent_hallway += 1

            # Check if the player is trapped
            if adjacent_hallways == players_in_adjacent_hallway:
                self.turn["actions"] = [Action.Accuse.name, Action.End.name]

    def move(self, character: str, x: int, y: int) -> None:
        """Moves a character to a given square

        Parameters
        ----------
        character : str
            The character to move
        x : int
            The x-coordinate to move to
        y : int
            The y-coordinate to move to

        Raises
        ------
        RuntimeError
            If a move is invalid
        """
        x_current, y_current = self.character_positions[character]
        new_position = (x, y)

        secret_passages = {
            ((1, 1), (5, 5)),
            ((5, 5), (1, 1)),
            ((5, 1), (1, 5)),
            ((1, 5), (5, 1)),
        }

        is_secret_passage = (
            (x_current, y_current),
            new_position,
        ) in secret_passages or (
            (new_position),
            (x_current, y_current),
        ) in secret_passages

        if not is_secret_passage and (
            (abs(x - x_current) > 1 or abs(y - y_current) > 1)
            or (abs(x - x_current) == 1 and abs(y - y_current) == 1)
            or new_position == (x_current, y_current)
        ):
            raise RuntimeError("Invalid move!")

        if new_position in hallways_positions and self.character_in_room(x, y):
            raise RuntimeError("Invalid move! Hallway is currently occupied.")

        self.character_positions[character] = new_position
        self.last_positions[character] = new_position

        if new_position not in hallways_positions:
            self.turn["actions"] = [Action.Suggest.name, Action.Accuse.name]
        else:
            if self.turn_number > len(self.characters):
                self.turn["actions"] = [Action.Accuse.name, Action.End.name]
            elif self.turn_number == len(self.characters):
                self.turn["actions"] = [Action.Move.name, Action.Accuse.name]
                self.next_turn()
            else:
                self.turn["actions"] = [Action.Move.name]
                self.next_turn()

    def suggest(self, character: str, suspect: str, weapon: str) -> None:
        """Processes a suggestion

        Parameters
        ----------
        character : str
            The character making the suggestion
        suspect : str
            The suspect being suggested
        weapon : str
            The weapon being suggested
        """
        if self.character_positions[character] in hallways_positions:
            raise RuntimeError("Cannot make a suggestion from a hallway!")

        # Move the suspect and weapon to the character's room
        self.character_positions[suspect] = self.character_positions[character]
        self.weapon_positions[weapon] = self.character_positions[character]

        # Move to the next player to begin disproving suggestions
        self.turn["actions"] = [Action.Disprove.name]
        self.next_turn()

        self.last_suggestion = {
            "character": character,
            "suspect": suspect,
            "weapon": weapon,
            "room": room_positions[self.character_positions[character]],
        }

    def accuse(self, character: str, suspect: str, weapon: str, room: str) -> None:
        """Processes an accusation to determine if a player has won the game

        Parameters
        ----------
        character : str
            The character making the accusation
        suspect : str
            The suspect being accused
        weapon : str
            The weapon being accused
        room : room
            The room being accused
        """
        self.next_turn()
        position_x, position_y = self.character_positions[self.turn["character"]]
        if (position_x, position_y) in hallways_positions:
            self.turn["actions"] = [Action.Move.name, Action.Accuse.name]

        if (
            suspect == self.solution["suspect"]
            and weapon == self.solution["weapon"]
            and room == self.solution["room"]
        ):
            if self.winner is None:
                self.winner = character
        else:
            self.losers.append(character)

            raise RuntimeError(
                "You have made a false accusation and can no longer win the game!"
            )

    def disprove(self, card: str) -> None:
        """Processes a player disproving a suggestion

        Parameters
        ----------
        card : str
            The card that disproves the last suggestion
        """
        disprover = self.turn["character"]
        self.next_turn()
        self.disprover = disprover

        # Player had no card to disprove the suggestion
        if len(card) == 0:
            return

        # Successfully disproved the suggestion
        if card in list(self.last_suggestion.values()):
            self.turn["character"] = self.last_suggestion["character"]
            self.turn["actions"] = [Action.Accuse.name, Action.End.name]

        self.disprover = disprover
