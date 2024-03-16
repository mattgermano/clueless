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
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function JoinGameButton() {
  const [gameId, setGameId] = useState("");
  const [open, setOpen] = useState(false);
  const [spectatorChecked, setSpectatorChecked] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleSpectatorCheck() {
    setSpectatorChecked(!spectatorChecked);
  }

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        <span className="pr-2">Join Game</span>{" "}
        <PersonAddAlt1 fontSize="small" />
      </Button>
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle>Join Settings</DialogTitle>
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
        <FormControlLabel
          control={
            <Checkbox
              value={spectatorChecked}
              onChange={handleSpectatorCheck}
            />
          }
          label="Join as Spectator?"
        />
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Link
            href={
              spectatorChecked
                ? `/game?watch=${gameId}`
                : `/game?join=${gameId}`
            }
          >
            <Button variant="contained">Join</Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
}
