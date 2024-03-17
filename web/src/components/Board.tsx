"use client";

import Square from "@/components/Square";
import Grid from "@mui/material/Unstable_Grid2";
import { GetCharacterByPosition, PlayerPositions } from "./utils/characters";

interface BoardProps {
  positions?: PlayerPositions;
  handleRoomClick(x: Number, y: Number): void;
}

export default function Board({ positions, handleRoomClick }: BoardProps) {
  return (
    <Grid container spacing={2} columns={50}>
      <Grid xs={10}>
        <Square
          image="/rooms/study.webp"
          title="Study"
          x={0}
          y={0}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(0, 0, positions)}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={1}
          y={0}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(1, 0, positions)}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hall.webp"
          title="Hall"
          x={2}
          y={0}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(2, 0, positions)}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={3}
          y={0}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(3, 0, positions)}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/lounge.webp"
          title="Lounge"
          x={4}
          y={0}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(4, 0, positions)}
        />
      </Grid>

      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={0}
          y={1}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(0, 1, positions)}
        />
      </Grid>
      <Grid xs={10}></Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={2}
          y={1}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(2, 1, positions)}
        />
      </Grid>
      <Grid xs={10}></Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={4}
          y={1}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(4, 1, positions)}
        />
      </Grid>

      <Grid xs={10}>
        <Square
          image="/rooms/library.webp"
          title="Library"
          x={0}
          y={2}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(0, 2, positions)}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={1}
          y={2}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(1, 2, positions)}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/billiard_room.webp"
          title="Billiard Room"
          x={2}
          y={2}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(2, 2, positions)}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={3}
          y={2}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(3, 2, positions)}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/dining_room.webp"
          title="Dining Room"
          x={4}
          y={2}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(4, 2, positions)}
        />
      </Grid>

      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={0}
          y={3}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(0, 3, positions)}
        />
      </Grid>
      <Grid xs={10}></Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={2}
          y={3}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(2, 3, positions)}
        />
      </Grid>
      <Grid xs={10}></Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={4}
          y={3}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(4, 3, positions)}
        />
      </Grid>

      <Grid xs={10}>
        <Square
          image="/rooms/conservatory.webp"
          title="Conservatory"
          x={0}
          y={4}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(0, 4, positions)}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={1}
          y={4}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(1, 4, positions)}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/ballroom.webp"
          title="Ballroom"
          x={2}
          y={4}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(2, 4, positions)}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={3}
          y={4}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(3, 4, positions)}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/kitchen.webp"
          title="Kitchen"
          x={4}
          y={4}
          handleClick={handleRoomClick}
          character={GetCharacterByPosition(4, 4, positions)}
        />
      </Grid>
    </Grid>
  );
}
