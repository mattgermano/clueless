"use client";

import Board from "@/components/Board";
import Particles from "@/components/Particles";
import { Alert, Link } from "@mui/material";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Game() {
  const [error, setError] = useState();
  const [joinId, setJoinId] = useState();
  const [watchId, setWatchId] = useState();

  const WS_URL = "ws://127.0.0.1:8000/ws/hello-django";
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    },
  );

  function getWebSocketServer() {
    if (window.location.host === "clueless.cassini.dev") {
      // TODO: Update with production server once deployed
      return "ws://127.0.0.1:8000/ws/hello-django";
    } else if (window.location.host === "localhost:3000") {
      return "ws://127.0.0.1:8000/ws/hello-django";
    } else {
      throw new Error(`Unsupported host: ${window.location.host}`);
    }
  }

  function handleRoomClick(x: Number, y: Number) {
    console.log(`Clicked: (${x}, ${y})`);
    if (joinId) {
      const event = {
        type: "move",
        x: x,
        y: y,
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
        // Player joining an existing game
        event = {
          type: "init",
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
        event = {
          type: "init",
        };
      }
      console.log(JSON.stringify(event));
      sendJsonMessage(event);
    }
  }, [readyState, sendJsonMessage]);

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    if (lastJsonMessage) {
      console.log(`Got a new message: ${JSON.stringify(lastJsonMessage)}`);

      const event: any = lastJsonMessage;
      switch (event.type) {
        case "init":
          // Create links for inviting other players and spectators
          setJoinId(event.join);
          setWatchId(event.watch);
          break;

        case "move":
          // Update the UI with the move
          break;

        case "win":
          break;

        case "error":
          setError(event.message);
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

  return (
    <main className="relative min-h-screen flex flex-col justify-center bg-slate-900 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
        <div className="text-center">
          <Particles
            className="absolute inset-0 pointer-events-none"
            quantity={50}
          />
          <div className="mb-2">
            <span>The WebSocket is currently {connectionStatus}</span>
          </div>
          <div className="mb-2">
            {lastJsonMessage ? (
              <span>Last message: {JSON.stringify(lastJsonMessage)}</span>
            ) : null}
          </div>
          <div>
            {joinId && (
              <Link href={`http://localhost:3000/game?join=${joinId}`}>
                Join Game Link
              </Link>
            )}
          </div>
          <div>
            {watchId && (
              <Link href={`http://localhost:3000/game?watch=${watchId}`}>
                Watch Game Link
              </Link>
            )}
          </div>
          <div className="mb-2 mt-2">
            {error && (
              <Alert className="justify-center" severity="error">
                {error}
              </Alert>
            )}
          </div>
          <Board handleRoomClick={handleRoomClick} />
        </div>
      </div>
    </main>
  );
}
