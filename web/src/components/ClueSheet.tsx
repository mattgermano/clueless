import { Theme } from "@/app/game/page";
import { ArticleOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  Checkbox,
  Drawer,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import ImagePortrait from "./ImagePortrait";
import { CharacterCards, Characters } from "./utils/characters";
import { Rooms } from "./utils/rooms";
import { Weapons } from "./utils/weapons";

interface SuspectCheckboxStates {
  miss_scarlett: boolean[];
  colonel_mustard: boolean[];
  mrs_white: boolean[];
  mr_green: boolean[];
  mrs_peacock: boolean[];
  professor_plum: boolean[];
}

interface WeaponCheckboxStates {
  knife: boolean[];
  candle_stick: boolean[];
  revolver: boolean[];
  rope: boolean[];
  lead_pipe: boolean[];
  wrench: boolean[];
}

interface RoomCheckboxStates {
  ballroom: boolean[];
  billiard_room: boolean[];
  conservatory: boolean[];
  dining_room: boolean[];
  hall: boolean[];
  kitchen: boolean[];
  library: boolean[];
  lounge: boolean[];
  study: boolean[];
}

type Suspect =
  | "miss_scarlett"
  | "colonel_mustard"
  | "mrs_white"
  | "mr_green"
  | "mrs_peacock"
  | "professor_plum";

type Weapon =
  | "knife"
  | "candle_stick"
  | "revolver"
  | "rope"
  | "lead_pipe"
  | "wrench";

type Room =
  | "ballroom"
  | "billiard_room"
  | "conservatory"
  | "dining_room"
  | "hall"
  | "kitchen"
  | "library"
  | "lounge"
  | "study";

const initialSuspectCheckboxStates: SuspectCheckboxStates = {
  miss_scarlett: Array(7).fill(false),
  colonel_mustard: Array(7).fill(false),
  mrs_white: Array(7).fill(false),
  mr_green: Array(7).fill(false),
  mrs_peacock: Array(7).fill(false),
  professor_plum: Array(7).fill(false),
};

const initialWeaponCheckboxStates: WeaponCheckboxStates = {
  knife: Array(7).fill(false),
  candle_stick: Array(7).fill(false),
  revolver: Array(7).fill(false),
  rope: Array(7).fill(false),
  lead_pipe: Array(7).fill(false),
  wrench: Array(7).fill(false),
};

const initialRoomCheckboxStates: RoomCheckboxStates = {
  ballroom: Array(7).fill(false),
  billiard_room: Array(7).fill(false),
  conservatory: Array(7).fill(false),
  dining_room: Array(7).fill(false),
  hall: Array(7).fill(false),
  kitchen: Array(7).fill(false),
  library: Array(7).fill(false),
  lounge: Array(7).fill(false),
  study: Array(7).fill(false),
};

interface ClueCardProps {
  character?: string | null;
  characterCards?: CharacterCards;
  theme: Theme;
}

export default function ClueCard({
  character,
  characterCards,
  theme,
}: ClueCardProps) {
  const [open, setOpen] = useState(false);
  const [suspectCheckboxStates, setSuspectCheckboxStates] = useState(
    initialSuspectCheckboxStates,
  );
  const [weaponCheckboxStates, setWeaponCheckboxStates] = useState(
    initialWeaponCheckboxStates,
  );
  const [roomCheckboxStates, setRoomCheckboxStates] = useState(
    initialRoomCheckboxStates,
  );

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleSuspectCheckboxChange = (id: Suspect, column: Number) => {
    const newData = { ...suspectCheckboxStates };

    newData[id] = newData[id].map((item: boolean, itemIndex: Number) =>
      itemIndex === column ? !item : item,
    );

    setSuspectCheckboxStates(newData);
  };

  const handleWeaponCheckboxChange = (id: Weapon, column: Number) => {
    const newData = { ...weaponCheckboxStates };

    newData[id] = newData[id].map((item: boolean, itemIndex: Number) =>
      itemIndex === column ? !item : item,
    );

    setWeaponCheckboxStates(newData);
  };

  const handleRoomCheckboxChange = (id: Room, column: Number) => {
    const newData = { ...roomCheckboxStates };

    newData[id] = newData[id].map((item: boolean, itemIndex: Number) =>
      itemIndex === column ? !item : item,
    );

    setRoomCheckboxStates(newData);
  };

  function resetCheckboxStates() {
    setSuspectCheckboxStates(initialSuspectCheckboxStates);
    setWeaponCheckboxStates(initialWeaponCheckboxStates);
    setRoomCheckboxStates(initialRoomCheckboxStates);
  }

  return (
    <>
      <Button variant="outlined" onClick={toggleDrawer(true)}>
        <span className="pr-2">Clue Sheet</span>{" "}
        <ArticleOutlined fontSize="small" />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="right">
        <Card variant="outlined">
          <TableContainer style={{ maxHeight: 550 }} component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  {Characters.map((character) => (
                    <TableCell key={character.id} align="right">
                      {character.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Characters.map((character) => (
                  <TableRow
                    key={character.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <ImagePortrait
                        title={character.name}
                        image={character.image[theme]}
                        width={45}
                        height={45}
                      />
                    </TableCell>
                    {[...Array(7)].map((_, index) => (
                      <TableCell key={index} align="right">
                        <Checkbox
                          checked={
                            suspectCheckboxStates[character.id as Suspect][
                              index
                            ]
                          }
                          onChange={() =>
                            handleSuspectCheckboxChange(
                              character.id as Suspect,
                              index,
                            )
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Card variant="outlined">
          <TableContainer style={{ maxHeight: 550 }} component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  {Characters.map((character) => (
                    <TableCell key={character.id} align="right">
                      {character.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Weapons.map((weapon) => (
                  <TableRow
                    key={weapon.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <ImagePortrait
                        title={weapon.name}
                        image={weapon.image[theme]}
                        width={45}
                        height={45}
                      />
                    </TableCell>
                    {[...Array(7)].map((_, index) => (
                      <TableCell key={index} align="right">
                        <Checkbox
                          checked={
                            weaponCheckboxStates[weapon.id as Weapon][index]
                          }
                          onChange={() =>
                            handleWeaponCheckboxChange(
                              weapon.id as Weapon,
                              index,
                            )
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Card variant="outlined">
          <TableContainer style={{ maxHeight: 550 }} component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  {Characters.map((character) => (
                    <TableCell key={character.id} align="right">
                      {character.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Rooms.map((room) => (
                  <TableRow
                    key={room.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <ImagePortrait
                        title={room.name}
                        image={room.image[theme]}
                        width={45}
                        height={45}
                      />
                    </TableCell>
                    {[...Array(7)].map((_, index) => (
                      <TableCell key={index} align="right">
                        <Checkbox
                          checked={roomCheckboxStates[room.id as Room][index]}
                          onChange={() =>
                            handleRoomCheckboxChange(room.id as Room, index)
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Button variant="contained" onClick={resetCheckboxStates}>
          Clear Selections
        </Button>
      </Drawer>
    </>
  );
}
