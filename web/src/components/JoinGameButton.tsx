"use client";

import PersonAddAlt1 from "@mui/icons-material/PersonAddAlt1";
import Button from "@mui/material/Button";
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  Link,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { CharacterSelections, Characters } from "./utils/characters";

export default function JoinGameButton() {
  const [gameId, setGameId] = useState("");
  const [open, setOpen] = useState(false);
  const [character, setCharacter] = useState(Characters[0].id);
  const [spectatorChecked, setSpectatorChecked] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleSpectatorCheck() {
    setSpectatorChecked(!spectatorChecked);
  }

  const handleCharacterChange = (event: SelectChangeEvent) => {
    setCharacter(event.target.value as string);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        <span className="pr-2">Join Game</span>{" "}
        <PersonAddAlt1 fontSize="small" />
      </Button>
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle>Join Settings</DialogTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px", // Adjust the space between the select boxes here
          }}
        >
          <FormControl fullWidth>
            <TextField
              required
              label="Game ID"
              id="outlined-required"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setGameId(event.target.value);
              }}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Character</InputLabel>
            <Select
              value={character}
              label="Character"
              onChange={handleCharacterChange}
              disabled={spectatorChecked}
            >
              {CharacterSelections}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                value={spectatorChecked}
                onChange={handleSpectatorCheck}
              />
            }
            label="Join as Spectator?"
          />
        </Box>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Link
            href={
              spectatorChecked
                ? `/game?watch=${gameId}`
                : `/game?join=${gameId}&character=${character}`
            }
          >
            <Button variant="contained">Join</Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
}
