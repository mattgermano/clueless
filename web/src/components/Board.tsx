"use client";

import Square from "@/components/Square";
import Grid from "@mui/material/Unstable_Grid2";
import {
  GetCharactersByPosition,
  CharacterPositions as CharacterPositions,
} from "./utils/characters";
import { GetWeaponByPosition, WeaponPositions } from "./utils/weapons";

interface BoardProps {
  characterPositions?: CharacterPositions;
  weaponPositions?: WeaponPositions;
  handleRoomClick(x: Number, y: Number): void;
}

export default function Board({
  characterPositions,
  weaponPositions,
  handleRoomClick,
}: BoardProps) {
  const rooms = [
    { image: "/rooms/study.webp", title: "Study", x: 0, y: 0 },
    { image: "/rooms/hallway.webp", title: "Hallway", x: 1, y: 0 },
    { image: "/rooms/hall.webp", title: "Hall", x: 2, y: 0 },
    { image: "/rooms/hallway.webp", title: "Hallway", x: 3, y: 0 },
    { image: "/rooms/lounge.webp", title: "Lounge", x: 4, y: 0 },
    { image: "/rooms/hallway.webp", title: "Hallway", x: 0, y: 1 },
    { image: "", title: "", x: 1, y: 1 },
    { image: "/rooms/hallway.webp", title: "Hallway", x: 2, y: 1 },
    { image: "", title: "", x: 3, y: 1 },
    { image: "/rooms/hallway.webp", title: "Hallway", x: 4, y: 1 },
    { image: "/rooms/library.webp", title: "Library", x: 0, y: 2 },
    { image: "/rooms/hallway.webp", title: "Hallway", x: 1, y: 2 },
    { image: "/rooms/billiard_room.webp", title: "Billiard Room", x: 2, y: 2 },
    { image: "/rooms/hallway.webp", title: "Hallway", x: 3, y: 2 },
    { image: "/rooms/dining_room.webp", title: "Dining Room", x: 4, y: 2 },
    { image: "/rooms/hallway.webp", title: "Hallway", x: 0, y: 3 },
    { image: "", title: "", x: 1, y: 3 },
    { image: "/rooms/hallway.webp", title: "Hallway", x: 2, y: 3 },
    { image: "", title: "", x: 3, y: 3 },
    { image: "/rooms/hallway.webp", title: "Hallway", x: 4, y: 3 },
    { image: "/rooms/conservatory.webp", title: "Conservatory", x: 0, y: 4 },
    { image: "/rooms/hallway.webp", title: "Hallway", x: 1, y: 4 },
    { image: "/rooms/ballroom.webp", title: "Ballroom", x: 2, y: 4 },
    { image: "/rooms/hallway.webp", title: "Hallway", x: 3, y: 4 },
    { image: "/rooms/kitchen.webp", title: "Kitchen", x: 4, y: 4 },
  ];

  return (
    <Grid container spacing={2} columns={50}>
      {rooms.map((room) => (
        <Grid key={`${room.title}-${room.x}-${room.y}`} xs={10}>
          <Square
            image={room.image}
            title={room.title}
            x={room.x}
            y={room.y}
            handleClick={handleRoomClick}
            characters={GetCharactersByPosition(
              room.x,
              room.y,
              characterPositions,
            )}
            weapon={GetWeaponByPosition(room.x, room.y, weaponPositions)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
