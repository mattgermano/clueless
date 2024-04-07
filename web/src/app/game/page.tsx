"use client";

import AccusationButton from "@/components/AccusationButton";
import Board from "@/components/Board";
import ClueSheet from "@/components/ClueSheet";
import Particles from "@/components/Particles";
import SuggestionButton from "@/components/SuggestionButton";
import TextWithCopyButton from "@/components/TextWithCopyButton";
import { GetCardInfo } from "@/components/utils/cards";
import {
  CharacterCards,
  CharacterPositions,
  GetCardsByCharacter,
  GetCharacterById,
} from "@/components/utils/characters";
import { WeaponPositions } from "@/components/utils/weapons";
import { SkipNext } from "@mui/icons-material";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface EventObject {
  type: string;
  join?: string;
  watch?: string;
  character_positions?: CharacterPositions;
  weapon_positions?: WeaponPositions;
  cards?: CharacterCards;
  player?: string;
  message?: string;
  character?: string;
  suspect?: string;
  weapon?: string;
  room?: string;
  disprover?: string;
  card?: string;
  actions?: string[];
}

export default function Game() {
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [winner, setWinner] = useState("");
  const [joinId, setJoinId] = useState<string | null>("");
  const [watchId, setWatchId] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [character, setCharacter] = useState<string | null | undefined>(
    undefined,
  );
  const [suggestion, setSuggestion] = useState({
    suspect: "",
    weapon: "",
    room: "",
  });
  const [currentTurn, setCurrentTurn] = useState<string | undefined>();
  const [currentActions, setCurrentActions] = useState<string[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [characterPositions, setCharacterPositions] = useState<
    CharacterPositions | undefined
  >();
  const [weaponPositions, setWeaponPositions] = useState<
    WeaponPositions | undefined
  >();
  const [characterCards, setCharacterCards] = useState<
    CharacterCards | undefined
  >();

  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || null;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: true,
      shouldReconnect: () => true,
    },
  );

  function handleRoomClick(x: Number, y: Number) {
    if (joinId) {
      const event = {
        type: "move",
        character: character,
        x: x,
        y: y,
        game_id: joinId,
      };

      sendJsonMessage(event);
    }
  }

  function handleSuggestionClick(suspect: string, weapon: string) {
    if (joinId) {
      const event = {
        type: "suggestion",
        character: character,
        suspect: suspect,
        weapon: weapon,
        game_id: joinId,
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
        character: character,
        suspect: suspect,
        weapon: weapon,
        room: room,
        game_id: joinId,
      };

      sendJsonMessage(event);
    }
  }

  function handleCardClick(card: string) {
    if (joinId) {
      const event = {
        type: "disprove",
        card: card,
        game_id: joinId,
      };

      sendJsonMessage(event);
    }
  }

  function handleEndTurnClick() {
    if (joinId) {
      const event = {
        type: "end_turn",
        game_id: joinId,
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
          player_count: playerCount ? parseInt(playerCount) : 0,
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

        case "turn":
          if (event.character !== undefined) setCurrentTurn(event.character);
          if (event.actions !== undefined) setCurrentActions(event.actions);
          break;

        case "position":
          if (event.character_positions !== undefined) {
            setCharacterPositions(event.character_positions);
          }
          if (event.weapon_positions !== undefined) {
            setWeaponPositions(event.weapon_positions);
          }
          break;

        case "start":
          setGameStarted(true);
          if (event.cards !== undefined) setCharacterCards(event.cards);
          break;

        case "suggestion":
          if (
            event.suspect !== undefined &&
            event.weapon !== undefined &&
            event.room !== undefined
          ) {
            setSuggestion({
              suspect: event.suspect,
              weapon: event.weapon,
              room: event.room,
            });
          }
          break;

        case "disprove":
          if (
            event.character !== undefined &&
            event.disprover !== undefined &&
            event.card !== undefined
          ) {
            if (character === event.character) {
              if (event.card.length === 0) {
                setInfo(
                  `${GetCharacterById(event.disprover)?.name} could not disprove your suggestion!`,
                );
              } else {
                setInfo(
                  `Your suggestion was disproven by ${GetCharacterById(event.disprover)?.name} with the ${GetCardInfo(event.card)?.name} card.`,
                );
              }
              setBackdropOpen(true);
            }
          }
          break;

        case "win":
          if (event.player !== undefined) {
            setWinner(event.player);
            setGameStarted(false);
          }
          break;

        case "error":
          if (event.message !== undefined) setError(event.message);
          setOpenErrorSnackbar(true);
          break;

        default:
          throw new Error(`Unsupported event type: ${event.type}.`);
      }
    }
  }, [lastJsonMessage, character]);

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
          <h1 className="inline-flex font-extrabold text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-4">
            Clue-Less
          </h1>
          {!gameStarted && (
            <Alert className="mb-2 justify-center" severity="info">
              Waiting for additional players before starting game!
            </Alert>
          )}
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
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdropOpen}
            onClick={() => setBackdropOpen(false)}
          >
            <h1>{info}</h1>
          </Backdrop>
          <div className="relative flex">
            {currentTurn && (
              <Card
                className="justify-center absolute -left-40 top-72"
                sx={{ maxWidth: 200 }}
                variant="outlined"
              >
                <Typography gutterBottom variant="h5" component="div">
                  Current Turn
                </Typography>
                <CardMedia
                  component="img"
                  height={10}
                  image={GetCharacterById(currentTurn)?.image}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    <b>Available Actions</b>
                    {currentActions.map((action) => (
                      <ol key={action}>
                        <li>{action}</li>
                      </ol>
                    ))}
                  </Typography>
                </CardContent>
              </Card>
            )}
            <Board
              handleRoomClick={handleRoomClick}
              characterPositions={characterPositions}
              weaponPositions={weaponPositions}
              gameStarted={
                gameStarted &&
                currentTurn === character &&
                currentActions.includes("Move")
              }
            />
          </div>
          <div className="inline-flex mt-2 justify-center space-x-4">
            <SuggestionButton
              handleSuggestionClick={handleSuggestionClick}
              gameStarted={
                gameStarted &&
                currentTurn === character &&
                currentActions.includes("Suggest")
              }
            />
            <AccusationButton
              handleAccusationClick={handleAccusationClick}
              gameStarted={
                gameStarted &&
                currentTurn === character &&
                currentActions.includes("Accuse")
              }
            />
            {currentActions.includes("End") && (
              <Button variant="outlined" onClick={handleEndTurnClick}>
                <span className="pr-2">End Turn</span>{" "}
                <SkipNext fontSize="small" />
              </Button>
            )}
            <ClueSheet />
          </div>
          <div className="flex flex-row justify-center space-x-4 mt-4">
            {characterCards &&
              character &&
              GetCardsByCharacter(character, characterCards).map((card) => {
                let classes = "";
                if (
                  currentTurn === character &&
                  currentActions.includes("Disprove")
                ) {
                  classes = "ring-4 ring-red-500";
                  if (Object.values(suggestion).includes(card)) {
                    classes = "ring-4 ring-green-500";
                  }
                }

                return (
                  <Button
                    key={card}
                    onClick={() => {
                      handleCardClick(card);
                    }}
                    disabled={
                      currentTurn !== character ||
                      !currentActions.includes("Disprove") ||
                      !Object.values(suggestion).includes(card)
                    }
                  >
                    <Card
                      variant="outlined"
                      className={`${classes}`}
                      sx={{ maxWidth: 300 }}
                    >
                      <CardMedia
                        component="img"
                        height={10}
                        image={GetCardInfo(card)?.image}
                      />
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="caption"
                          component="div"
                        >
                          {GetCardInfo(card)?.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Button>
                );
              })}
          </div>
          {character &&
            characterCards &&
            currentTurn === character &&
            currentActions.includes("Disprove") &&
            !GetCardsByCharacter(character, characterCards).some((card) =>
              Object.values(suggestion).includes(card),
            ) && (
              <div className="mt-2">
                <Button variant="outlined" onClick={() => handleCardClick("")}>
                  <span className="pr-2">Pass Turn</span>{" "}
                  <SkipNext fontSize="small" />
                </Button>
              </div>
            )}

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
