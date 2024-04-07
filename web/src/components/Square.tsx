import { Button, Tooltip } from "@mui/material";
import Image from "next/image";
import ImagePortrait from "./ImagePortrait";
import { Character } from "./utils/characters";

interface SquareProps {
  title: string;
  image: string;
  x: Number;
  y: Number;
  handleClick(x: Number, y: Number): void;
  characters?: Character[];
  weapons?: Weapons[];
  gameStarted: Boolean;
  width?: number;
  height?: number;
}

export default function Square({
  title,
  image,
  x,
  y,
  characters,
  weapons,
  handleClick,
  gameStarted,
  width = 500,
  height = 500,
}: SquareProps) {
  function getClasses() {
    if (y === 0) {
      return "items-end justify-center";
    } else if (y === 6) {
      return "items-start justify-center";
    } else if (x === 6) {
      return "items-center justify-start";
    } else if (x === 0) {
      return "items-center justify-end";
    }
  }

  const classes = getClasses();

  return (
    <>
      {title.length === 0 && (
        <div className={`relative min-h-[130px] flex ${classes}`}>
          {characters &&
            characters.map((character) => {
              return (
                <div key={character.id} className={`absolute`}>
                  <ImagePortrait
                    title={character.name}
                    image={character.image}
                    width={50}
                    height={50}
                  />
                </div>
              );
            })}
        </div>
      )}
      {title.length > 0 && (
        <Button
          disabled={!gameStarted}
          variant="outlined"
          onClick={() => handleClick(x, y)}
        >
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
                characters.length <= 3 &&
                characters.map((character, index) => {
                  let position = "";
                  if (index === 0) {
                    position = "left-0 top-0";
                  } else if (index === 1) {
                    position = "right-0 top-0";
                  } else if (index === 2) {
                    position = "bottom-0 left-0";
                  }

                  return (
                    <div key={character.id} className={`absolute ${position}`}>
                      <ImagePortrait
                        title={character.name}
                        image={character.image}
                        width={50}
                        height={50}
                      />
                    </div>
                  );
                })}

              {characters && characters.length > 3 && (
                <div className="absolute left-0 top-0">
                  <ImagePortrait
                    title={characters
                      .map((character) => character.name)
                      .join(", ")}
                    image="/characters/generic.webp"
                    width={50}
                    height={50}
                  />
                </div>
              )}

              {weapons &&
                weapons.length <= 2 &&
                weapons.map((weapon, index) => {
                  let position = "";
                  if (index === 0) {
                    position = "bottom-0 right-0";
                  } else if (index === 1) {
                    position = "bottom-0 right-5";
                  }

                  return (
                    <div key={weapon.id} className={`absolute ${position}`}>
                      <ImagePortrait
                        title={weapon.name}
                        image={weapon.image}
                        width={40}
                        height={40}
                      />
                    </div>
                  );
                })}
            </div>
          </Tooltip>
        </Button>
      )}
    </>
  );
}
