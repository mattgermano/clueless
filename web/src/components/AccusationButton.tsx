import { PsychologyAltOutlined } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { Characters, CharacterSelections } from "./utils/characters";
import { Rooms, RoomSelections } from "./utils/rooms";
import { Weapons, WeaponSelections } from "./utils/weapons";

interface AccusationButtonProps {
  handleAccusationClick(character: string, weapon: string, room: string): void;
}

export default function AccusationButton({
  handleAccusationClick,
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
      <Button variant="outlined" onClick={handleOpen}>
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
              {RoomSelections}
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
