"use client";

import Square from "@/components/Square";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import {
  CharacterPositions,
  GetCharactersByPosition,
  Position,
} from "./utils/characters";
import { GetWeaponByPosition, WeaponPositions } from "./utils/weapons";

interface BoardProps {
  characterPositions?: CharacterPositions;
  weaponPositions?: WeaponPositions;
  handleRoomClick(x: Number, y: Number): void;
  gameStarted: Boolean;
  theme: string;
}

export default function Board({
  characterPositions,
  weaponPositions,
  gameStarted,
  handleRoomClick,
  theme,
}: BoardProps) {
  const startingRooms = [
    { image: "", title: "", x: 0, y: 0 },
    { image: "", title: "", x: 1, y: 0 },
    { image: "", title: "", x: 2, y: 0 },
    { image: "", title: "", x: 3, y: 0 },
    { image: "", title: "", x: 4, y: 0 },
    { image: "", title: "", x: 5, y: 0 },
    { image: "", title: "", x: 6, y: 0 },

    { image: "", title: "", x: 0, y: 1 },
    { image: `/rooms/${theme}/study.webp`, title: "Study", x: 1, y: 1 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 2, y: 1 },
    { image: `/rooms/${theme}/hall.webp`, title: "Hall", x: 3, y: 1 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 4, y: 1 },
    { image: `/rooms/${theme}/lounge.webp`, title: "Lounge", x: 5, y: 1 },
    { image: "", title: "", x: 6, y: 1 },

    { image: "", title: "", x: 0, y: 2 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 1, y: 2 },
    { image: "", title: "", x: 2, y: 2 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 3, y: 2 },
    { image: "", title: "", x: 4, y: 2 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 5, y: 2 },
    { image: "", title: "", x: 6, y: 2 },

    { image: "", title: "", x: 0, y: 3 },
    { image: `/rooms/${theme}/library.webp`, title: "Library", x: 1, y: 3 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 2, y: 3 },
    {
      image: `/rooms/${theme}/billiard_room.webp`,
      title: "Billiard Room",
      x: 3,
      y: 3,
    },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 4, y: 3 },
    {
      image: `/rooms/${theme}/dining_room.webp`,
      title: "Dining Room",
      x: 5,
      y: 3,
    },
    { image: "", title: "", x: 6, y: 3 },

    { image: "", title: "", x: 0, y: 4 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 1, y: 4 },
    { image: "", title: "", x: 2, y: 4 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 3, y: 4 },
    { image: "", title: "", x: 4, y: 4 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 5, y: 4 },
    { image: "", title: "", x: 6, y: 4 },

    { image: "", title: "", x: 0, y: 5 },
    {
      image: `/rooms/${theme}/conservatory.webp`,
      title: "Conservatory",
      x: 1,
      y: 5,
    },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 2, y: 5 },
    { image: `/rooms/${theme}/ballroom.webp`, title: "Ballroom", x: 3, y: 5 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 4, y: 5 },
    { image: `/rooms/${theme}/kitchen.webp`, title: "Kitchen", x: 5, y: 5 },
    { image: "", title: "", x: 6, y: 5 },

    { image: "", title: "", x: 0, y: 6 },
    { image: "", title: "", x: 1, y: 6 },
    { image: "", title: "", x: 2, y: 6 },
    { image: "", title: "", x: 3, y: 6 },
    { image: "", title: "", x: 4, y: 6 },
    { image: "", title: "", x: 5, y: 6 },
    { image: "", title: "", x: 6, y: 6 },
  ];

  const rooms = [
    { image: `/rooms/${theme}/study.webp`, title: "Study", x: 1, y: 1 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 2, y: 1 },
    { image: `/rooms/${theme}/hall.webp`, title: "Hall", x: 3, y: 1 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 4, y: 1 },
    { image: `/rooms/${theme}/lounge.webp`, title: "Lounge", x: 5, y: 1 },

    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 1, y: 2 },
    { image: "", title: "", x: 2, y: 2 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 3, y: 2 },
    { image: "", title: "", x: 4, y: 2 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 5, y: 2 },

    { image: `/rooms/${theme}/library.webp`, title: "Library", x: 1, y: 3 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 2, y: 3 },
    {
      image: `/rooms/${theme}/billiard_room.webp`,
      title: "Billiard Room",
      x: 3,
      y: 3,
    },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 4, y: 3 },
    {
      image: `/rooms/${theme}/dining_room.webp`,
      title: "Dining Room",
      x: 5,
      y: 3,
    },

    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 1, y: 4 },
    { image: "", title: "", x: 2, y: 4 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 3, y: 4 },
    { image: "", title: "", x: 4, y: 4 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 5, y: 4 },

    {
      image: `/rooms/${theme}/conservatory.webp`,
      title: "Conservatory",
      x: 1,
      y: 5,
    },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 2, y: 5 },
    { image: `/rooms/${theme}/ballroom.webp`, title: "Ballroom", x: 3, y: 5 },
    { image: `/rooms/${theme}/hallway.webp`, title: "Hallway", x: 4, y: 5 },
    { image: `/rooms/${theme}/kitchen.webp`, title: "Kitchen", x: 5, y: 5 },
  ];

  const [firstTurnComplete, setFirstTurnComplete] = useState(false);
  const displayedRooms = firstTurnComplete ? startingRooms : startingRooms;

  useEffect(() => {
    let foundCharacterInStartingSquare = false;

    if (characterPositions) {
      Object.entries(characterPositions).forEach(
        ([_, value]: [string, Position]) => {
          if (
            value.x === 0 ||
            value.x === 6 ||
            value.y === 0 ||
            value.y === 6
          ) {
            foundCharacterInStartingSquare = true;
          }
        },
      );
    }

    setFirstTurnComplete(!foundCharacterInStartingSquare);
  }, [characterPositions]);

  return (
    <Grid container spacing={1} columns={firstTurnComplete ? 70 : 70}>
      {displayedRooms.map((room) => (
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
            weapons={GetWeaponByPosition(room.x, room.y, weaponPositions)}
            gameStarted={gameStarted}
          />
        </Grid>
      ))}
    </Grid>
  );
}
