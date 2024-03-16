import { Box, ListItemText, MenuItem } from "@mui/material";
import CharacterPortrait from "../CharacterPortrait";
export interface Character {
  name: string;
  image: string;
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
      <CharacterPortrait
        image={character.image}
        title={character.name}
        width={50}
        height={50}
      />
    </Box>
  </MenuItem>
));
