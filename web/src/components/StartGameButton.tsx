"use client";

import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import CharacterPortrait from "@/components/CharacterPortrait";
import { Characters } from "@/components/utils/characters";
import Link from "next/link";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "black",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function StartGameButton() {
  const [open, setOpen] = useState(false);
  const [character, setCharacter] = useState(Characters[0].name);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: SelectChangeEvent) => {
    setCharacter(event.target.value as string);
  };

  const characterSelections = Characters.map((character) => (
    <MenuItem value={character.name} key={character.name}>
      <CharacterPortrait
        title={character.name}
        image={character.image}
        width={50}
        height={50}
      />
      {character.name}
    </MenuItem>
  ));

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        <span className="pr-2">Start Game</span>{" "}
        <RocketLaunchOutlined fontSize="small" />
      </Button>
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle>Game Settings</DialogTitle>
        <FormControl fullWidth>
          <InputLabel>Character</InputLabel>
          <Select value={character} label="Character" onChange={handleChange}>
            {characterSelections}
          </Select>
        </FormControl>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Link href="/game">
            <Button variant="contained">Start</Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
}
