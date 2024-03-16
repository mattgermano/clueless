"use client";

import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined";
import {
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CharacterPortrait from "@/components/CharacterPortrait";
import { CharacterSelections, Characters } from "@/components/utils/characters";
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
  const [character, setCharacter] = useState(Characters[0].id);
  const [playerCount, setPlayerCount] = useState("3");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCharacterChange = (event: SelectChangeEvent) => {
    setCharacter(event.target.value as string);
  };

  const handlePlayerCountChange = (event: SelectChangeEvent) => {
    setPlayerCount(event.target.value as string);
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>
        <span className="pr-2">Start Game</span>{" "}
        <RocketLaunchOutlined fontSize="small" />
      </Button>
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle>Game Settings</DialogTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px", // Adjust the space between the select boxes here
          }}
        >
          <FormControl fullWidth>
            <InputLabel>Character</InputLabel>
            <Select
              value={character}
              label="Character"
              onChange={handleCharacterChange}
            >
              {CharacterSelections}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Maximum Player Count</InputLabel>
            <Select
              value={playerCount}
              label="Maximum Player Count"
              onChange={handlePlayerCountChange}
            >
              {["3", "4", "5", "6"].map((count) => (
                <MenuItem key={count} value={count}>
                  {count}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Link
            href={`/game?character=${character}?player_count=${playerCount}`}
          >
            <Button variant="contained">Start</Button>
          </Link>
        </DialogActions>
      </Dialog>
    </>
  );
}
