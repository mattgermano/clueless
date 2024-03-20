import { Box, ListItemText, MenuItem } from "@mui/material";
import ImagePortrait from "../ImagePortrait";
export interface Character {
  id: string;
  name: string;
  image: string;
  starting_position: Position;
}

export interface CharacterPositions {
  [player: string]: {
    x: number;
    y: number;
  };
}

interface Position {
  x: number;
  y: number;
}

export const Characters = [
  {
    id: "miss_scarlett",
    name: "Miss Scarlett",
    image: "/characters/miss_scarlett.webp",
    starting_position: {
      x: 3,
      y: 0,
    },
  },
  {
    id: "colonel_mustard",
    name: "Colonel Mustard",
    image: "/characters/colonel_mustard.webp",
    starting_position: {
      x: 4,
      y: 1,
    },
  },
  {
    id: "mrs_white",
    name: "Mrs. White",
    image: "/characters/mrs_white.webp",
    starting_position: {
      x: 3,
      y: 4,
    },
  },
  {
    id: "mr_green",
    name: "Mr. Green",
    image: "/characters/mr_green.webp",
    starting_position: {
      x: 1,
      y: 4,
    },
  },
  {
    id: "mrs_peacock",
    name: "Mrs. Peacock",
    image: "/characters/mrs_peacock.webp",
    starting_position: {
      x: 0,
      y: 3,
    },
  },
  {
    id: "professor_plum",
    name: "Professor Plum",
    image: "/characters/professor_plum.webp",
    starting_position: {
      x: 0,
      y: 1,
    },
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

export function GetCharacterById(id: string) {
  for (const character of Characters) {
    if (character.id === id) {
      return character;
    }
  }

  return Characters[0];
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
