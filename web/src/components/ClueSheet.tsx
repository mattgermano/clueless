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
import { Weapons } from "./utils/weapons";
import { Rooms } from "./utils/rooms";

// prettier-ignore
// TODO: consolidate these definitions with a loop
const initialSuspectCheckboxStates: any = {
  "miss_scarlett": [false, false, false, false, false, false, false],
  "colonel_mustard": [false, false, false, false, false, false, false],
  "mrs_white": [false, false, false, false, false, false, false],
  "mr_green": [false, false, false, false, false, false, false],
  "mrs_peacock": [false, false, false, false, false, false, false],
  "professor_plum": [false, false, false, false, false, false, false],
}

// prettier-ignore
const initialWeaponCheckboxStates: any = {
  "knife": [false, false, false, false, false, false, false],
  "candle_stick": [false, false, false, false, false, false, false],
  "revolver": [false, false, false, false, false, false, false],
  "rope": [false, false, false, false, false, false, false],
  "lead_pipe": [false, false, false, false, false, false, false],
  "wrench": [false, false, false, false, false, false, false],
};

// prettier-ignore
const initialRoomCheckboxStates: any = {
  "ballroom": [false, false, false, false, false, false, false],
  "billiard_room": [false, false, false, false, false, false, false],
  "conservatory": [false, false, false, false, false, false, false],
  "dining_room": [false, false, false, false, false, false, false],
  "hall": [false, false, false, false, false, false, false],
  "kitchen": [false, false, false, false, false, false, false],
  "library": [false, false, false, false, false, false, false],
  "lounge": [false, false, false, false, false, false, false],
  "study": [false, false, false, false, false, false, false],
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

  const handleSuspectCheckboxChange = (id: string, column: Number) => {
    const newData = { ...suspectCheckboxStates };

    newData[id] = newData[id].map((item: string, itemIndex: Number) =>
      itemIndex === column ? !item : item,
    );

    setSuspectCheckboxStates(newData);
  };

  const handleWeaponCheckboxChange = (id: string, column: Number) => {
    const newData = { ...weaponCheckboxStates };

    newData[id] = newData[id].map((item: string, itemIndex: Number) =>
      itemIndex === column ? !item : item,
    );

    setWeaponCheckboxStates(newData);
  };

  const handleRoomCheckboxChange = (id: string, column: Number) => {
    const newData = { ...roomCheckboxStates };

    newData[id] = newData[id].map((item: string, itemIndex: Number) =>
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
                            checked={suspectCheckboxStates[character.id][index]}
                            onChange={() =>
                              handleSuspectCheckboxChange(character.id, index)
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
                            checked={weaponCheckboxStates[weapon.id][index]}
                            onChange={() =>
                              handleWeaponCheckboxChange(weapon.id, index)
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
                            checked={roomCheckboxStates[room.id][index]}
                            onChange={() =>
                              handleRoomCheckboxChange(room.id, index)
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
