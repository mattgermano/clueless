import { QuestionMarkOutlined } from "@mui/icons-material";
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
import { Weapons, WeaponSelections } from "./utils/weapons";

interface SuggestionButtonProps {
  handleSuggestionClick: any;
}

export default function SuggestionButton({
  handleSuggestionClick,
}: SuggestionButtonProps) {
  const [open, setOpen] = useState(false);
  const [character, setCharacter] = useState(Characters[0].id);
  const [weapon, setWeapon] = useState(Weapons[0].id);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCharacterChange = (event: SelectChangeEvent) => {
    setCharacter(event.target.value as string);
  };

  const handleWeaponChange = (event: SelectChangeEvent) => {
    setWeapon(event.target.value as string);
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        <span className="pr-2">Suggestion</span>{" "}
        <QuestionMarkOutlined fontSize="small" />
      </Button>
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle>Make a Suggestion</DialogTitle>
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
            <Select
              value={weapon}
              label="Suspect"
              onChange={handleWeaponChange}
            >
              {WeaponSelections}
            </Select>
          </FormControl>
        </div>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleSuggestionClick(character, weapon);
              handleClose();
            }}
          >
            Suggest
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
