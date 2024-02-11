"use client";

import Square from "@/components/Square";
import Grid from "@mui/material/Unstable_Grid2";

interface BoardProps {
  handleRoomClick: any;
}

export default function Board({ handleRoomClick }: BoardProps) {
  return (
    <Grid container spacing={2} columns={50}>
      <Grid xs={10}>
        <Square
          image="/rooms/study.webp"
          title="Study"
          x={0}
          y={0}
          handleClick={handleRoomClick}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={1}
          y={0}
          handleClick={handleRoomClick}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hall.webp"
          title="Hall"
          x={2}
          y={0}
          handleClick={handleRoomClick}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={3}
          y={0}
          handleClick={handleRoomClick}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/lounge.webp"
          title="Lounge"
          x={4}
          y={0}
          handleClick={handleRoomClick}
        />
      </Grid>

      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={0}
          y={1}
          handleClick={handleRoomClick}
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
        />
      </Grid>

      <Grid xs={10}>
        <Square
          image="/rooms/library.webp"
          title="Library"
          x={0}
          y={2}
          handleClick={handleRoomClick}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={1}
          y={2}
          handleClick={handleRoomClick}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/billiard_room.webp"
          title="Billiard Room"
          x={2}
          y={2}
          handleClick={handleRoomClick}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={3}
          y={2}
          handleClick={handleRoomClick}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/dining_room.webp"
          title="Dining Room"
          x={4}
          y={2}
          handleClick={handleRoomClick}
        />
      </Grid>

      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={0}
          y={3}
          handleClick={handleRoomClick}
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
        />
      </Grid>

      <Grid xs={10}>
        <Square
          image="/rooms/conservatory.webp"
          title="Conservatory"
          x={0}
          y={4}
          handleClick={handleRoomClick}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={1}
          y={4}
          handleClick={handleRoomClick}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/ballroom.webp"
          title="Ballroom"
          x={2}
          y={4}
          handleClick={handleRoomClick}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/hallway.webp"
          title="Hallway"
          x={3}
          y={4}
          handleClick={handleRoomClick}
        />
      </Grid>
      <Grid xs={10}>
        <Square
          image="/rooms/kitchen.webp"
          title="Kitchen"
          x={4}
          y={4}
          handleClick={handleRoomClick}
        />
      </Grid>
    </Grid>
  );
}
