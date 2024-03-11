"use client";

import PersonAddAlt1 from "@mui/icons-material/PersonAddAlt1";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  Link,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function JoinGameButton() {
  const [gameId, setGameId] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        <span className="pr-2">Join Game</span>{" "}
        <PersonAddAlt1 fontSize="small" />
      </Button>
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
        <FormControl fullWidth>
          <TextField
            required
            id="outlined-required"
            label="Game ID"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setGameId(event.target.value);
            }}
          />
        </FormControl>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Link href={`/game?join=${gameId}`}>
            <Button variant="contained">Join</Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
}
