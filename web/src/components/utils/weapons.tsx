import { Avatar, Box, ListItemText, MenuItem } from "@mui/material";

export interface Weapon {
  id: string;
  name: string;
  image: {
    [theme: string]: string;
  };
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
    image: {
      Classic: "/weapons/knife.webp",
      "8-Bit": "/weapons/knife.webp",
      Medieval: "/weapons/knife.webp",
    },
  },
  {
    id: "candle_stick",
    name: "Candle Stick",
    image: {
      Classic: "/weapons/candle_stick.webp",
      "8-Bit": "/weapons/candle_stick.webp",
      Medieval: "/weapons/candle_stick.webp",
    },
  },
  {
    id: "revolver",
    name: "Revolver",
    image: {
      Classic: "/weapons/revolver.webp",
      "8-Bit": "/weapons/revolver.webp",
      Medieval: "/weapons/revolver.webp",
    },
  },
  {
    id: "rope",
    name: "Rope",
    image: {
      Classic: "/weapons/rope.webp",
      "8-Bit": "/weapons/rope.webp",
      Medieval: "/weapons/rope.webp",
    },
  },
  {
    id: "lead_pipe",
    name: "Lead Pipe",
    image: {
      Classic: "/weapons/lead_pipe.webp",
      "8-Bit": "/weapons/lead_pipe.webp",
      Medieval: "/weapons/lead_pipe.webp",
    },
  },
  {
    id: "wrench",
    name: "Wrench",
    image: {
      Classic: "/weapons/wrench.webp",
      "8-Bit": "/weapons/wrench.webp",
      Medieval: "/weapons/wrench.webp",
    },
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
        src={weapon.image["Classic"]}
        alt={weapon.name}
        sx={{ width: 50, height: 50 }}
      />
    </Box>
  </MenuItem>
));

export function GetWeaponById(id: string | undefined) {
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
