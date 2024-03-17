import { Avatar, Box, ListItemText, MenuItem } from "@mui/material";

export interface Weapon {
  name: string;
  image: string;
}

export const Weapons = [
  {
    id: "knife",
    name: "Knife",
    image: "/weapons/knife.webp",
  },
  {
    id: "candle_stick",
    name: "Candle Stick",
    image: "/weapons/candle_stick.webp",
  },
  {
    id: "revolver",
    name: "Revolver",
    image: "/weapons/revolver.webp",
  },
  {
    id: "rope",
    name: "Rope",
    image: "/weapons/rope.webp",
  },
  {
    id: "lead_pipe",
    name: "Lead Pipe",
    image: "/weapons/lead_pipe.webp",
  },
  {
    id: "wrench",
    name: "Wrench",
    image: "/weapons/wrench.webp",
  },
];

export const WeaponSelections = Weapons.map((weapon) => (
  <MenuItem value={weapon.id} key={weapon.id}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <ListItemText primary={weapon.name} />
      <Avatar
        src={weapon.image}
        alt={weapon.name}
        sx={{ width: 50, height: 50 }}
      />
    </Box>
  </MenuItem>
));
