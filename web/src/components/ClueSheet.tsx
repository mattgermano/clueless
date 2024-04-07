import {
  ArticleOutlined,
  Build,
  MeetingRoom,
  Person,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Drawer,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Characters } from "./utils/characters";
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

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function ClueCard() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
      <Drawer open={open} onClose={toggleDrawer(false)} anchor="bottom">
        <Tabs onChange={handleChange}>
          <Tab icon={<Person />} label="Suspects" {...a11yProps(0)} />
          <Tab icon={<Build />} label="Weapons" {...a11yProps(1)} />
          <Tab icon={<MeetingRoom />} label="Rooms" {...a11yProps(2)} />
        </Tabs>
        <CustomTabPanel value={value} index={0}>
          <Card variant="outlined">
            <TableContainer style={{ maxHeight: 400 }} component={Paper}>
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
                        {character.name}
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
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <Card variant="outlined">
            <TableContainer style={{ maxHeight: 400 }} component={Paper}>
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
                        {weapon.name}
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
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
          <Card variant="outlined">
            <TableContainer style={{ maxHeight: 400 }} component={Paper}>
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
                        {room.name}
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
        </CustomTabPanel>

        <Button variant="contained" onClick={resetCheckboxStates}>
          Clear Selections
        </Button>
      </Drawer>
    </>
  );
}
