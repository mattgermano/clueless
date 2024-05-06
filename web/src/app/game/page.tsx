"use client";

import AccusationButton from "@/components/AccusationButton";
import Board from "@/components/Board";
import ClueSheet from "@/components/ClueSheet";
import ImagePortrait from "@/components/ImagePortrait";
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
import { GetRoomById } from "@/components/utils/rooms";
import { GetWeaponById, WeaponPositions } from "@/components/utils/weapons";
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

import { ChatBox } from "@/components/chat/ChatBox";
import { Message } from "@/components/chat/Message";
import MusicSelection from "@/components/MusicSelection";

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
  sender?: string;
  reason?: string;
  actions?: string[];
}

export type Theme = "Classic" | "8-Bit" | "Medieval";

export default function Game() {
  const [theme, setTheme] = useState<Theme>("Classic");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [winner, setWinner] = useState("");
  const [joinId, setJoinId] = useState<string | null>("");
  const [watchId, setWatchId] = useState("");
  const [gameEnded, setGameEnded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [character, setCharacter] = useState<string | null | undefined>(
    undefined,
  );
  const [suggestion, setSuggestion] = useState({
    character: "",
    suspect: "",
    weapon: "",
    room: "",
  });
  const [accusation, setAccusation] = useState({
    character: "",
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
  const [messages, setMessages] = useState<Array<Message>>([]);

  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || null;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: true,
      shouldReconnect: () => true,
    },
  );

  const [counter, setCounter] = useState(0);

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

  function handleSendChat(chat: string) {
    if (joinId) {
      const event = {
        type: "chat",
        game_id: joinId,
        sender: character,
        message: chat,
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

  function closeBackdrop(event: any) {
    if (gameEnded) {
      event.stopPropagation();
    } else {
      setAccusation({
        character: "",
        suspect: "",
        weapon: "",
        room: "",
      });
      setBackdropOpen(false);
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search);
    const boardTheme = searchParams.get("theme");
    if (boardTheme) {
      setTheme(boardTheme as Theme);
    }
  }, []);

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
      // console.log(
      //   `Sending event to backend: ${JSON.stringify(event, null, 2)}`,
      // );
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
      // console.log(
      //   `Received event from backend: ${JSON.stringify(lastJsonMessage, null, 2)}`,
      // );

      const event = lastJsonMessage as EventObject;
      switch (event.type) {
        case "init":
          // Create links for inviting other players and spectators
          if (event.join !== undefined) setJoinId(event.join);
          if (event.watch !== undefined) setWatchId(event.watch);
          setCounter(counter + 1);
          setMessages((m) => [
            ...m,
            {
              id: counter,
              type: "system",
              event_type: "init",
              message: "A new game has been created!",
            },
          ]);
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

        case "join":
          if (event.character !== undefined) {
            setCounter(counter + 1);
            setMessages((m) => [
              ...m,
              {
                id: counter,
                type: "system",
                event_type: "join",
                message: `${GetCharacterById(event.character)?.name} joined the game!`,
              },
            ]);
          }
          break;

        case "start":
          setGameStarted(true);
          if (event.cards !== undefined) setCharacterCards(event.cards);
          setCounter(counter + 1);
          setMessages((m) => [
            ...m,
            {
              id: counter,
              type: "system",
              event_type: "start",
              message: "The game has started!",
            },
          ]);
          break;

        case "suggestion":
          if (
            event.character !== undefined &&
            event.suspect !== undefined &&
            event.weapon !== undefined &&
            event.room !== undefined
          ) {
            setSuggestion({
              character: event.character,
              suspect: event.suspect,
              weapon: event.weapon,
              room: event.room,
            });
            setCounter(counter + 1);
            setMessages((m) => [
              ...m,
              {
                id: counter,
                type: "system",
                event_type: "suggestion",
                message:
                  `${GetCharacterById(currentTurn)?.name} suggests it was` +
                  ` ${GetCharacterById(event.suspect)?.name} in the` +
                  ` ${GetCardInfo(event.room)?.name} with the ${GetWeaponById(event.weapon)?.name}!`,
              },
            ]);
          }
          break;

        case "disprove":
          if (
            event.character !== undefined &&
            event.disprover !== undefined &&
            event.card !== undefined
          ) {
            if (event.card.length === 0) {
              setInfo(
                `${GetCharacterById(event.disprover)?.name} could not disprove your suggestion!`,
              );
              setCounter(counter + 1);
              setMessages((m) => [
                ...m,
                {
                  id: counter,
                  type: "system",
                  event_type: "disprove",
                  message:
                    `${GetCharacterById(event.disprover)?.name}` +
                    ` could not disprove the suggestion!`,
                },
              ]);
            } else {
              setInfo(
                `Your suggestion was disproven by ${GetCharacterById(event.disprover)?.name} with the ${GetCardInfo(event.card)?.name} card.`,
              );
              setCounter(counter + 1);
              let isSuggestor =
                character == event.character || character == event.disprover;
              let optionalStr = `with the ${GetCardInfo(event.card)?.name} card`;
              setMessages((m) => [
                ...m,
                {
                  id: counter,
                  type: "system",
                  event_type: "disprove",
                  message:
                    `${GetCharacterById(event.disprover)?.name}` +
                    ` disproved the suggestion` +
                    ` ${isSuggestor ? optionalStr : ""}!`,
                },
              ]);
            }
          }
          break;

        case "accusation":
          if (
            event.character !== undefined &&
            event.suspect !== undefined &&
            event.weapon !== undefined &&
            event.room !== undefined
          ) {
            setAccusation({
              character: event.character,
              suspect: event.suspect,
              weapon: event.weapon,
              room: event.room,
            });

            setCounter(counter + 1);
            setMessages((m) => [
              ...m,
              {
                id: counter,
                type: "system",
                event_type: "accusation",
                message:
                  `${GetCharacterById(currentTurn)?.name} accuses` +
                  ` ${GetCharacterById(event.suspect)?.name} in the` +
                  ` ${GetCardInfo(event.room)?.name} with the ${GetWeaponById(event.weapon)?.name}!`,
              },
            ]);
          }
          break;

        case "chat":
          setCounter(counter + 1);
          setMessages((m) => [
            ...m,
            {
              id: counter,
              type: "player",
              sender: event.sender,
              isUser: event.sender == character,
              message: event.message,
            },
          ]);
          break;

        case "win":
          if (
            event.character !== undefined &&
            event.suspect !== undefined &&
            event.weapon !== undefined &&
            event.room !== undefined
          ) {
            setAccusation({
              character: event.character,
              suspect: event.suspect,
              weapon: event.weapon,
              room: event.room,
            });
            setWinner(event.character);
            setGameStarted(false);
            setGameEnded(true);
            setInfo("");
            setBackdropOpen(true);
            setCounter(counter + 1);
            setMessages((m) => [
              ...m,
              {
                id: counter,
                type: "system",
                event_type: "win",
                message: `${GetCharacterById(event.character)?.name} has won the game!`,
              },
            ]);
          }
          break;

        case "move":
          if (event.character !== undefined && event.room !== undefined) {
            setCounter(counter + 1);
            setMessages((m) => [
              ...m,
              {
                id: counter,
                type: "system",
                event_type: "move",
                message: `${GetCharacterById(event.character)?.name} moved to the ${event.room === "Hallway" ? event.room : GetRoomById(event.room)?.name}!`,
              },
            ]);
          }
          break;

        case "end_turn":
          if (event.character !== undefined) {
            setCounter(counter + 1);
            setMessages((m) => [
              ...m,
              {
                id: counter,
                type: "system",
                event_type: "end_turn",
                message: `${GetCharacterById(event.character)?.name} has ended their turn!`,
              },
            ]);
          }
          break;

        case "lose":
          setCounter(counter + 1);
          setMessages((m) => [
            ...m,
            {
              id: counter,
              type: "system",
              event_type: "lose",
              message:
                `${GetCharacterById(event.player)?.name} made a false` +
                ` accusation and has lost the game!`,
            },
          ]);

          setInfo(
            `${GetCharacterById(event.player)?.name} has made a false accusation! They accused ${GetCharacterById(event.suspect)?.name} with the ${GetWeaponById(event.weapon)?.name} in the ${GetRoomById(event.room)?.name}.`,
          );
          setBackdropOpen(true);

          break;

        case "end_game":
          if (
            event.suspect !== undefined &&
            event.weapon !== undefined &&
            event.room !== undefined &&
            event.reason !== undefined
          ) {
            setAccusation({
              character: event.suspect,
              suspect: event.suspect,
              weapon: event.weapon,
              room: event.room,
            });
            setCurrentTurn(undefined);
            setGameEnded(true);
            setGameStarted(false);
            if (event.reason === "false_accusations") {
              setInfo(
                `All players have made false accusations! The game has now ended. The solution was ${GetCharacterById(event.suspect)?.name} with the ${GetWeaponById(event.weapon)?.name} in the ${GetRoomById(event.room)?.name}.`,
              );
            } else if (event.reason === "not_enough_players") {
              setInfo(
                `Too many players have disconnected! The game has now ended. The solution was ${GetCharacterById(event.suspect)?.name} with the ${GetWeaponById(event.weapon)?.name} in the ${GetRoomById(event.room)?.name}.`,
              );
            }
            setBackdropOpen(true);
          }
          break;

        case "disconnect":
          setCounter(counter + 1);
          setMessages((m) => [
            ...m,
            {
              id: counter,
              type: "system",
              event_type: "disconnect",
              message: `${GetCharacterById(event.character)?.name} disconnected from the game!`,
            },
          ]);
          break;

        case "error":
          if (event.message !== undefined) setError(event.message);
          setOpenErrorSnackbar(true);
          break;

        default:
          throw new Error(`Unsupported event type: ${event.type}.`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  // Prompt the user to confirm that they want to reload the page after a refresh
  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }

    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  });

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            {joinId && !gameStarted && !winner && (
              <TextWithCopyButton
                title="Join Game ID:"
                text={joinId}
                handleCopy={handleCopy}
              />
            )}
            {watchId && !gameStarted && !winner && (
              <TextWithCopyButton
                title="Watch Game ID:"
                text={watchId}
                handleCopy={handleCopy}
              />
            )}
          </Box>
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            }}
            open={backdropOpen}
            onClick={closeBackdrop}
          >
            {accusation.character.length > 0 && !winner ? (
              <main className="flex flex-col">
                <Typography variant="h6" component="div" className="block mb-5">
                  {info}
                </Typography>
                <div className="flex justify-center space-x-4 m-10">
                  <ImagePortrait
                    title={GetCharacterById(accusation.suspect)?.name}
                    image={GetCharacterById(accusation.suspect)?.image[theme]}
                    width={125}
                    height={125}
                  />
                  <ImagePortrait
                    title={GetWeaponById(accusation.weapon)?.name}
                    image={GetWeaponById(accusation.weapon)?.image[theme]}
                    width={125}
                    height={125}
                  />
                  <ImagePortrait
                    title={GetRoomById(accusation.room)?.name}
                    image={GetRoomById(accusation.room)?.image[theme]}
                    width={125}
                    height={125}
                  />
                </div>
              </main>
            ) : (
              <Typography variant="h6" component="div" className="block mb-5">
                {info}
              </Typography>
            )}
            {winner && (
              <div className="flex flex-col">
                <Typography variant="h6" component="div" className="block mb-5">
                  {GetCharacterById(winner)?.name} has won the game! The
                  solution was {GetCharacterById(accusation.suspect)?.name} with
                  the {GetWeaponById(accusation.weapon)?.name} in the{" "}
                  {GetRoomById(accusation.room)?.name}.
                </Typography>
                <div className="flex justify-center space-x-4 m-4">
                  <ImagePortrait
                    title={GetCharacterById(accusation.suspect)?.name}
                    image={GetCharacterById(accusation.suspect)?.image[theme]}
                    width={125}
                    height={125}
                  />
                  <ImagePortrait
                    title={GetWeaponById(accusation.weapon)?.name}
                    image={GetWeaponById(accusation.weapon)?.image[theme]}
                    width={125}
                    height={125}
                  />
                  <ImagePortrait
                    title={GetRoomById(accusation.room)?.name}
                    image={GetRoomById(accusation.room)?.image[theme]}
                    width={125}
                    height={125}
                  />
                </div>
              </div>
            )}
          </Backdrop>
          <div className="relative flex">
            {!winner && !gameEnded && (
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
                  image={
                    currentTurn
                      ? GetCharacterById(currentTurn)?.image[theme]
                      : "/characters/generic.webp"
                  }
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {!gameStarted ? (
                      <b>Waiting for additional players!</b>
                    ) : (
                      <>
                        <b>Available Actions</b>
                        {currentActions.map((action) => (
                          <ol key={action}>
                            <li>{action}</li>
                          </ol>
                        ))}

                        {currentActions.includes("Disprove") && (
                          <>
                            <Typography
                              gutterBottom
                              variant="subtitle1"
                              component="div"
                            >
                              <br />
                              <b>
                                {GetCharacterById(suggestion.character)?.name}
                                &apos;s Suggestion
                              </b>
                            </Typography>
                            <div className="flex justify-center space-x-2">
                              <ImagePortrait
                                title={
                                  GetCharacterById(suggestion.suspect)?.name
                                }
                                image={
                                  GetCharacterById(suggestion.suspect)?.image[
                                    theme
                                  ]
                                }
                                width={40}
                                height={40}
                              />
                              <ImagePortrait
                                title={GetWeaponById(suggestion.weapon)?.name}
                                image={
                                  GetWeaponById(suggestion.weapon)?.image[theme]
                                }
                                width={40}
                                height={40}
                              />
                              <ImagePortrait
                                title={GetRoomById(suggestion.room)?.name}
                                image={
                                  GetRoomById(suggestion.room)?.image[theme]
                                }
                                width={40}
                                height={40}
                              />
                            </div>
                          </>
                        )}
                      </>
                    )}
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
              theme={theme}
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
              theme={theme}
            />
            {gameStarted &&
              currentTurn === character &&
              currentActions.includes("End") && (
                <Button variant="outlined" onClick={handleEndTurnClick}>
                  <span className="pr-2">End Turn</span>{" "}
                  <SkipNext fontSize="small" />
                </Button>
              )}
            <ChatBox messages={messages} handleSendChat={handleSendChat} />
            <ClueSheet
              character={character}
              characterCards={characterCards}
              theme={theme}
            />
            <MusicSelection />
          </div>
          <div className="flex flex-row justify-center space-x-4 mt-4">
            {characterCards &&
              character &&
              GetCardsByCharacter(character, characterCards).map((card) => {
                let cards = {
                  suspect: suggestion.suspect,
                  weapon: suggestion.weapon,
                  room: suggestion.room,
                };
                let classes = "";
                if (
                  currentTurn === character &&
                  currentActions.includes("Disprove")
                ) {
                  classes = "ring-4 ring-red-500";
                  if (Object.values(cards).includes(card)) {
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
                      !Object.values(cards).includes(card)
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
                        image={GetCardInfo(card)?.image[theme]}
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
            !GetCardsByCharacter(character, characterCards).some((card) => {
              let cards = {
                suspect: suggestion.suspect,
                weapon: suggestion.weapon,
                room: suggestion.room,
              };
              return Object.values(cards).includes(card);
            }) && (
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
