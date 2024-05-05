export interface Room {
  name: string;
  image: string;
}

export const Rooms = [
  {
    id: "ballroom",
    name: "Ballroom",
    image: {
      Classic: "/rooms/Classic/ballroom.webp",
      "8-Bit": "/rooms/8-Bit/ballroom.webp",
      Medieval: "/rooms/Medieval/ballroom.webp",
    },
  },
  {
    id: "billiard_room",
    name: "Billiard Room",
    image: {
      Classic: "/rooms/Classic/billiard_room.webp",
      "8-Bit": "/rooms/8-Bit/billiard_room.webp",
      Medieval: "/rooms/Medieval/billiard_room.webp",
    },
  },
  {
    id: "conservatory",
    name: "Conservatory",
    image: {
      Classic: "/rooms/Classic/conservatory.webp",
      "8-Bit": "/rooms/8-Bit/conservatory.webp",
      Medieval: "/rooms/Medieval/conservatory.webp",
    },
  },
  {
    id: "dining_room",
    name: "Dining Room",
    image: {
      Classic: "/rooms/Classic/dining_room.webp",
      "8-Bit": "/rooms/8-Bit/dining_room.webp",
      Medieval: "/rooms/Medieval/dining_room.webp",
    },
  },
  {
    id: "hall",
    name: "Hall",
    image: {
      Classic: "/rooms/Classic/hall.webp",
      "8-Bit": "/rooms/8-Bit/hall.webp",
      Medieval: "/rooms/Medieval/hall.webp",
    },
  },
  {
    id: "kitchen",
    name: "Kitchen",
    image: {
      Classic: "/rooms/Classic/kitchen.webp",
      "8-Bit": "/rooms/8-Bit/kitchen.webp",
      Medieval: "/rooms/Medieval/kitchen.webp",
    },
  },
  {
    id: "library",
    name: "Library",
    image: {
      Classic: "/rooms/Classic/library.webp",
      "8-Bit": "/rooms/8-Bit/library.webp",
      Medieval: "/rooms/Medieval/library.webp",
    },
  },
  {
    id: "lounge",
    name: "Lounge",
    image: {
      Classic: "/rooms/Classic/lounge.webp",
      "8-Bit": "/rooms/8-Bit/lounge.webp",
      Medieval: "/rooms/Medieval/lounge.webp",
    },
  },
  {
    id: "study",
    name: "Study",
    image: {
      Classic: "/rooms/Classic/study.webp",
      "8-Bit": "/rooms/8-Bit/study.webp",
      Medieval: "/rooms/Medieval/study.webp",
    },
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
