import { Box, ListItemText, MenuItem } from "@mui/material";
import ImagePortrait from "../ImagePortrait";
export interface Character {
  id: string;
  name: string;
  image: string;
}

export interface CharacterPositions {
  [player: string]: {
    x: number;
    y: number;
  };
}

export interface CharacterCards {
  [player: string]: string[];
}

export interface Position {
  x: number;
  y: number;
}

export const Characters = [
  {
    id: "miss_scarlett",
    name: "Miss Scarlett",
    image: "/characters/miss_scarlett.webp",
  },
  {
    id: "colonel_mustard",
    name: "Colonel Mustard",
    image: "/characters/colonel_mustard.webp",
  },
  {
    id: "mrs_white",
    name: "Mrs. White",
    image: "/characters/mrs_white.webp",
  },
  {
    id: "mr_green",
    name: "Mr. Green",
    image: "/characters/mr_green.webp",
  },
  {
    id: "mrs_peacock",
    name: "Mrs. Peacock",
    image: "/characters/mrs_peacock.webp",
  },
  {
    id: "professor_plum",
    name: "Professor Plum",
    image: "/characters/professor_plum.webp",
  },
];

export const CharacterSelections = Characters.map((character) => (
  <MenuItem value={character.id} key={character.id}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <ListItemText primary={character.name} />
      <ImagePortrait
        image={character.image}
        title={character.name}
        width={50}
        height={50}
      />
    </Box>
  </MenuItem>
));

export const AvailableCharacterSelections = ({
  characters,
}: {
  characters: string[];
}) => {
  return Characters.map(
    (character) =>
      characters.includes(character.id) && (
        <MenuItem value={character.id} key={character.id}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <ListItemText primary={character.name} />
            <ImagePortrait
              image={character.image}
              title={character.name}
              width={50}
              height={50}
            />
          </Box>
        </MenuItem>
      ),
  );
};

export function GetCharacterById(id: string) {
  for (const character of Characters) {
    if (character.id === id) {
      return character;
    }
  }

  return undefined;
}

export function GetCardsByCharacter(
  character?: string,
  characterCards?: CharacterCards,
) {
  let cards: string[] = [];

  if (characterCards && character) {
    Object.entries(characterCards).map(([player, playerCards]) => {
      if (player === character) {
        cards = playerCards;
      }
    });
  }

  return cards;
}

export function GetCharactersByPosition(
  x: Number,
  y: Number,
  positions?: CharacterPositions,
) {
  let characters: Character[] = [];

  if (positions) {
    Object.entries(positions).forEach(([player, value]: [string, Position]) => {
      if (x === value.x && y === value.y) {
        const character = GetCharacterById(player);
        if (character) {
          characters.push(character);
        }
      }
    });
  }

  return characters;
}
