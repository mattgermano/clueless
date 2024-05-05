"use client";

import PersonAddAlt1 from "@mui/icons-material/PersonAddAlt1";
import Button from "@mui/material/Button";
import {
  Alert,
  AlertTitle,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  Link,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AvailableCharacterSelections } from "./utils/characters";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function JoinGameButton() {
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || null;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: true,
      reconnectInterval: 5,
      shouldReconnect: () => true,
    },
  );

  const [gameId, setGameId] = useState("");
  const [open, setOpen] = useState(false);
  const [valid, setValid] = useState(false);
  const [character, setCharacter] = useState("");
  const [spectator, setSpectator] = useState(false);
  const [characters, setCharacters] = useState<string[]>([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setGameId("");
    setCharacter("");
    setCharacters([]);
    setOpen(false);
  };
  const handleCharacterChange = (event: SelectChangeEvent) => {
    setCharacter(event.target.value as string);
  };

  useEffect(() => {
    setCharacters([]);
    setSpectator(false);
    setValid(false);
    if (open && gameId.length > 0) {
      let event = {
        type: "query_game",
        game_id: gameId,
      };

      sendJsonMessage(event);
    }
  }, [open, gameId, sendJsonMessage]);

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    if (
      lastJsonMessage &&
      typeof lastJsonMessage === "object" &&
      "type" in lastJsonMessage
    ) {
      console.log(
        `Received event from backend: ${JSON.stringify(lastJsonMessage, null, 2)}`,
      );

      const event = lastJsonMessage as any;
      switch (event.type) {
        case "query_game":
          setSpectator(event.spectator);
          setValid(event.valid);
          if (event.characters !== undefined) {
            setCharacters(event.characters);
            if (event.characters.length > 0) {
              setCharacter(event.characters[0]);
            }
          }
          break;

        default:
          throw new Error(`Unsupported event type: ${event.type}.`);
      }
    }
  }, [lastJsonMessage]);

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
          {characters.length > 0 && !spectator && (
            <FormControl fullWidth>
              <InputLabel>Character</InputLabel>
              <Select
                value={character}
                label="Character"
                onChange={handleCharacterChange}
              >
                {AvailableCharacterSelections({ characters })}
              </Select>
            </FormControl>
          )}
        </Box>
        {readyState !== ReadyState.OPEN && (
          <Alert severity="error" className="rounded mt-2 ml-2 mr-2">
            <AlertTitle>Error</AlertTitle>
            Clue-Less game server is currently offline!
          </Alert>
        )}
        {readyState === ReadyState.OPEN && gameId.length > 0 && !valid && (
          <Alert severity="error" className="rounded mt-2 ml-2 mr-2">
            <AlertTitle>Error</AlertTitle>
            Invalid game ID!
          </Alert>
        )}
        {readyState === ReadyState.OPEN &&
          gameId.length > 0 &&
          valid &&
          characters.length === 0 && (
            <Alert severity="error" className="rounded mt-2 ml-2 mr-2">
              <AlertTitle>Error</AlertTitle>
              Game is currently full!
            </Alert>
          )}
        {spectator && (
          <Alert severity="info" className="rounded mt-2 ml-2 mr-2">
            You will join the game as a spectator.
          </Alert>
        )}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {(readyState !== ReadyState.OPEN || character.length === 0) && (
            <Button variant="contained" disabled>
              Join
            </Button>
          )}
          {readyState === ReadyState.OPEN && character.length > 0 && (
            <Link
              href={
                spectator
                  ? `/game?watch=${gameId}`
                  : `/game?join=${gameId}&character=${character}`
              }
            >
              <Button variant="contained">Join</Button>
            </Link>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
