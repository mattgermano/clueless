import { Avatar, Box, ListItemText, MenuItem } from "@mui/material";

export interface Weapon {
  name: string;
  image: string;
}

export interface WeaponPositions {
  [weapon: string]: {
    x: number;
    y: number;
  };
}

interface Position {
  x: number;
  y: number;
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

export function GetWeaponById(id: string) {
  for (const weapon of Weapons) {
    if (weapon.id === id) {
      return weapon;
    }
  }

  return Weapons[0];
}

export function GetWeaponByPosition(
  x: Number,
  y: Number,
  positions?: WeaponPositions,
) {
  let weapons: Weapon[] = [];

  if (positions) {
    Object.entries(positions).forEach(([player, value]: [string, Position]) => {
      if (x === value.x && y === value.y) {
        const weapon = GetWeaponById(player);
        if (weapon) {
          weapons.push(weapon);
        }
      }
    });
  }

  return weapons;
}
