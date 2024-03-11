class Clueless:
    """
    A Clue-Less game
    """

    def __init__(self):
        self.moves = []
        self.winner = None

    def last_player(self):
        """
        Player who played the last move.
        """

    def play(self, x, y):
        """
        Play a move.
        """
        raise RuntimeError(f"Invalid move! ({x}, {y})")
