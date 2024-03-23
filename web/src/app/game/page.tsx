"use client";

import AccusationButton from "@/components/AccusationButton";
import Board from "@/components/Board";
import ClueSheet from "@/components/ClueSheet";
import Particles from "@/components/Particles";
import SuggestionButton from "@/components/SuggestionButton";
import TextWithCopyButton from "@/components/TextWithCopyButton";
import {
  GetCharacterById,
  CharacterPositions,
} from "@/components/utils/characters";
import { Alert, Box, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface EventObject {
  type: string;
  join?: string;
  watch?: string;
  positions?: CharacterPositions;
  player?: string;
  message?: string;
}

export default function Game() {
  const [error, setError] = useState("");
  const [winner, setWinner] = useState("");
  const [joinId, setJoinId] = useState<string | null>("");
  const [watchId, setWatchId] = useState("");
  const [character, setCharacter] = useState<string | null | undefined>(
    undefined,
  );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [characterPositions, setCharacterPositions] = useState<
    CharacterPositions | undefined
  >();

  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || null;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: true,
      shouldReconnect: () => true,
    },
  );

  function getWebSocketServer() {
    if (window.location.host === "clueless.cassini.dev") {
      // TODO: Update with production server once deployed
      return "ws://127.0.0.1:8000/ws/clueless";
    } else if (window.location.host === "localhost:3000") {
      return "ws://127.0.0.1:8000/ws/clueless";
    } else {
      throw new Error(`Unsupported host: ${window.location.host}`);
    }
  }

  function handleRoomClick(x: Number, y: Number) {
    console.log(`Clicked: (${x}, ${y})`);
    if (joinId) {
      const event = {
        type: "move",
        character: character,
        x: x,
        y: y,
        game: joinId,
      };

      sendJsonMessage(event);
    }
  }

  function handleSuggestionClick(
    suspect: string,
    weapon: string,
    room: string,
  ) {
    if (joinId) {
      const event = {
        type: "suggestion",
        suspect: suspect,
        weapon: weapon,
        room: room,
        game: joinId,
      };

      sendJsonMessage(event);
    }
  }

  function handleAccusationClick(
    suspect: string,
    weapon: string,
    room: string,
  ) {
    if (joinId) {
      const event = {
        type: "accusation",
        suspect: suspect,
        weapon: weapon,
        room: room,
        game: joinId,
      };

      sendJsonMessage(event);
    }
  }

  useEffect(() => {
    let event = {};

    // Send an "init" event according to who is connecting.
    if (readyState === ReadyState.OPEN) {
      const searchParams = new URLSearchParams(document.location.search);

      if (searchParams.has("join")) {
        const player = searchParams.get("character");

        setJoinId(searchParams.get("join"));
        setCharacter(player);

        // Player joining an existing game
        event = {
          type: "init",
          character: searchParams.get("character"),
          join: searchParams.get("join"),
        };
      } else if (searchParams.has("watch")) {
        // Player spectating an existing game
        event = {
          type: "init",
          watch: searchParams.get("watch"),
        };
      } else {
        // First player starts a new game
        const player = searchParams.get("character");
        const playerCount = searchParams.get("player_count");
        setCharacter(player);

        event = {
          type: "init",
          character: player,
          player_count: playerCount,
        };
      }
      console.log(
        `Sending event to backend: ${JSON.stringify(event, null, 2)}`,
      );
      sendJsonMessage(event);
    }
  }, [readyState, sendJsonMessage]);

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

      const event = lastJsonMessage as EventObject;
      switch (event.type) {
        case "init":
          // Create links for inviting other players and spectators
          if (event.join !== undefined) setJoinId(event.join);
          if (event.watch !== undefined) setWatchId(event.watch);
          break;

        case "move":
          setCharacterPositions(event.positions);
          break;

        case "win":
          if (event.player !== undefined) setWinner(event.player);
          break;

        case "error":
          if (event.message !== undefined) setError(event.message);
          setOpenErrorSnackbar(true);
          break;

        default:
          throw new Error(`Unsupported event type: ${event.type}.`);
      }
    }
  }, [lastJsonMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseErrorSnackbar = () => {
    setOpenErrorSnackbar(false);
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-center bg-slate-900 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div className="text-center">
          <Particles
            className="absolute inset-0 pointer-events-none"
            quantity={50}
          />
          <Alert className="mb-2 justify-center" severity="info">
            <span>The WebSocket is currently {connectionStatus}</span>
          </Alert>
          <Alert className="mb-2 justify-center" severity="info">
            {lastJsonMessage ? (
              <span>
                Last message from server:{" "}
                {JSON.stringify(lastJsonMessage, null, 2)}
              </span>
            ) : null}
          </Alert>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            {joinId && (
              <TextWithCopyButton
                title="Join Game ID:"
                text={joinId}
                handleCopy={handleCopy}
              />
            )}
            {watchId && (
              <TextWithCopyButton
                title="Watch Game ID:"
                text={watchId}
                handleCopy={handleCopy}
              />
            )}
          </Box>
          <div className="mb-2 mt-2">
            {winner && (
              <Alert className="justify-center" severity="success">
                {winner} has won the game!
              </Alert>
            )}
          </div>
          <Board
            handleRoomClick={handleRoomClick}
            characterPositions={characterPositions}
          />
          <div className="inline-flex mt-2 justify-center space-x-4">
            <SuggestionButton handleSuggestionClick={handleSuggestionClick} />
            <AccusationButton handleAccusationClick={handleAccusationClick} />
            <ClueSheet />
          </div>

          <Snackbar
            open={openErrorSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseErrorSnackbar}
          >
            <Alert
              onClose={handleCloseErrorSnackbar}
              severity="error"
              sx={{ width: "100%" }}
            >
              {error}
            </Alert>
          </Snackbar>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              Text copied to clipboard!
            </Alert>
          </Snackbar>
        </div>
      </div>
    </main>
  );
}
