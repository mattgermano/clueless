import { Avatar, Box, ListItemText, MenuItem } from "@mui/material";

export interface Room {
  name: string;
  image: string;
}

export const Rooms = [
  {
    id: "ballroom",
    name: "Ballroom",
    image: "/rooms/ballroom.webp",
  },
  {
    id: "billiard_room",
    name: "Billiard Room",
    image: "/rooms/billiard_room.webp",
  },
  {
    id: "conservatory",
    name: "Conservatory",
    image: "/rooms/conservatory.webp",
  },
  {
    id: "dining_room",
    name: "Dining Room",
    image: "/rooms/dining_room.webp",
  },
  {
    id: "hall",
    name: "Hall",
    image: "/rooms/hall.webp",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    image: "/rooms/kitchen.webp",
  },
  {
    id: "library",
    name: "Library",
    image: "/rooms/library.webp",
  },
  {
    id: "lounge",
    name: "Lounge",
    image: "/rooms/lounge.webp",
  },
  {
    id: "study",
    name: "Study",
    image: "/rooms/study.webp",
  },
];

export function GetRoomById(id: string | undefined) {
  for (const room of Rooms) {
    if (room.id === id) {
      return room;
    }
  }

  return Rooms[0];
}

export const RoomSelections = Rooms.map((room) => (
  <MenuItem value={room.id} key={room.id}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <ListItemText primary={room.name} />
      <Avatar src={room.image} alt={room.name} sx={{ width: 50, height: 50 }} />
    </Box>
  </MenuItem>
));
