import { Button, Tooltip } from "@mui/material";
import Image from "next/image";
import { Character } from "./utils/characters";
import ImagePortrait from "./ImagePortrait";
import { Weapon } from "./utils/weapons";

interface SquareProps {
  title: string;
  image: string;
  x: Number;
  y: Number;
  handleClick(x: Number, y: Number): void;
  width?: number;
  height?: number;
  characters?: Character[];
  weapon?: Weapon;
}

export default function Square({
  title,
  image,
  x,
  y,
  characters,
  weapon,
  handleClick,
  width = 500,
  height = 500,
}: SquareProps) {
  return (
    <>
      {title.length > 0 && (
        <Button variant="outlined" onClick={() => handleClick(x, y)}>
          <Tooltip title={title}>
            <div className="relative">
              <Image
                alt={title}
                src={image}
                width={width}
                height={height}
                className="z-0"
              />

              {characters &&
                characters.map((character, index) => {
                  // -left-14 top-12
                  let position = "";
                  if (index === 0) {
                    position = "left-0 top-0";
                  } else {
                    position = "right-0 top-0";
                  }

                  return (
                    <div key={character.id} className={`absolute ${position}`}>
                      <ImagePortrait
                        title={character.name}
                        image={character.image}
                        width={70}
                        height={70}
                      />
                    </div>
                  );
                })}

              {weapon && (
                <div className="absolute -bottom-4 -left-4">
                  <ImagePortrait
                    title={weapon.name}
                    image={weapon.image}
                    width={70}
                    height={70}
                  />
                </div>
              )}
            </div>
          </Tooltip>
        </Button>
      )}
    </>
  );
}
