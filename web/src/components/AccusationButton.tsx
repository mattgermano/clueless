import { Theme } from "@/app/game/page";
import { PsychologyAltOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { CharacterSelections, Characters } from "./utils/characters";
import { Rooms } from "./utils/rooms";
import { WeaponSelections, Weapons } from "./utils/weapons";

interface AccusationButtonProps {
  handleAccusationClick(character: string, weapon: string, room: string): void;
  gameStarted: Boolean;
  theme: Theme;
}

export default function AccusationButton({
  handleAccusationClick,
  gameStarted,
  theme,
}: AccusationButtonProps) {
  const [open, setOpen] = useState(false);
  const [character, setCharacter] = useState(Characters[0].id);
  const [weapon, setWeapon] = useState(Weapons[0].id);
  const [room, setRoom] = useState(Rooms[0].id);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCharacterChange = (event: SelectChangeEvent) => {
    setCharacter(event.target.value as string);
  };

  const handleWeaponChange = (event: SelectChangeEvent) => {
    setWeapon(event.target.value as string);
  };

  const handleRoomChange = (event: SelectChangeEvent) => {
    setRoom(event.target.value as string);
  };

  return (
    <>
      <Button disabled={!gameStarted} variant="outlined" onClick={handleOpen}>
        <span className="pr-2">Accusation</span>{" "}
        <PsychologyAltOutlined fontSize="small" />
      </Button>
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle>Make an Accusation</DialogTitle>
        <div>
          <FormControl fullWidth>
            <InputLabel>Suspect</InputLabel>
            <Select
              value={character}
              label="Suspect"
              onChange={handleCharacterChange}
            >
              {CharacterSelections}
            </Select>
          </FormControl>
        </div>
        <div className="mt-4">
          <FormControl fullWidth>
            <InputLabel>Weapon</InputLabel>
            <Select value={weapon} label="Weapon" onChange={handleWeaponChange}>
              {WeaponSelections}
            </Select>
          </FormControl>
        </div>
        <div className="mt-4">
          <FormControl fullWidth>
            <InputLabel>Room</InputLabel>
            <Select value={room} label="Room" onChange={handleRoomChange}>
              {Rooms.map((room) => (
                <MenuItem value={room.id} key={room.id}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <ListItemText primary={room.name} />
                    <Avatar
                      src={room.image[theme as Theme]}
                      alt={room.name}
                      sx={{ width: 50, height: 50 }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleAccusationClick(character, weapon, room);
              handleClose();
            }}
          >
            Accuse
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
