"use client";

import RocketLaunchOutlined from "@mui/icons-material/RocketLaunchOutlined";
import {
  Alert,
  AlertTitle,
  Box,
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
import { CharacterSelections, Characters } from "@/components/utils/characters";
import Link from "next/link";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function StartGameButton() {
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || null;
  const { readyState } = useWebSocket(WS_URL, {
    share: true,
    reconnectInterval: 5,
    shouldReconnect: () => true,
  });

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
            <InputLabel>Player Count</InputLabel>
            <Select
              value={playerCount}
              label="Player Count"
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
        {readyState !== ReadyState.OPEN && (
          <Alert severity="error" className="rounded mt-2 ml-2 mr-2">
            <AlertTitle>Error</AlertTitle>
            Clue-Less game server is currently offline!
          </Alert>
        )}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {readyState !== ReadyState.OPEN && (
            <Button variant="contained" disabled>
              Start
            </Button>
          )}
          {readyState === ReadyState.OPEN && (
            <Link
              href={`/game?character=${character}&player_count=${playerCount}`}
            >
              <Button variant="contained">Start</Button>
            </Link>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
