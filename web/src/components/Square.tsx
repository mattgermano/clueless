import { Button, Tooltip } from "@mui/material";
import Image from "next/image";
import { Character } from "./utils/characters";

interface SquareProps {
  title: string;
  image: string;
  x: Number;
  y: Number;
  handleClick(x: Number, y: Number): void;
  width?: number;
  height?: number;
  character?: Character;
}

export default function Square({
  title,
  image,
  x,
  y,
  character,
  handleClick,
  width = 500,
  height = 500,
}: SquareProps) {
  return (
    <Button variant="outlined" onClick={() => handleClick(x, y)}>
      <Tooltip title={title}>
        <div className="relative">
          <Image
            alt={title}
            src={image}
            width={width}
            height={height}
            className="z-0"
          ></Image>

          {character && (
            <Image
              alt={character.name}
              src={character.image}
              width={70}
              height={70}
              className="absolute inset-1"
            ></Image>
          )}
        </div>
      </Tooltip>
    </Button>
  );
}
