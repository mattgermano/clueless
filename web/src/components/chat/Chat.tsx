"use client";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import EventLog from "./EventLog";
import { Message, PlayerMessageProps, SystemMessageProps } from "./Message";
import PlayerChat from "./PlayerChat";
export interface ChatProps {
  handleSendChat(s: string): void;
  messages: Message[];
}

export const Chat = ({ messages, handleSendChat }: ChatProps) => {
  const [chatMessages, setChatMessages] = useState<Array<PlayerMessageProps>>(
    [],
  );

  const [gameEventMessages, setGameEventMessages] = useState<
    Array<SystemMessageProps>
  >([]);
  const [radioSelection, setRadioSelection] = useState("game_event");
  useEffect(() => {
    setGameEventMessages(
      messages.filter(
        (msg): msg is SystemMessageProps => msg.type === "system",
      ),
    );
    setChatMessages(
      messages.filter(
        (msg): msg is PlayerMessageProps => msg.type === "player",
      ),
    );
  }, [messages]);

  return (
    <>
      <FormControl>
        <Typography variant="h6">Chat Rooms</Typography>
        <RadioGroup
          row
          defaultValue="game_event"
          onChange={(_, v) => {
            setRadioSelection(v);
          }}
        >
          <FormControlLabel
            value="game_event"
            control={<Radio />}
            label="Game Events"
          />
          <FormControlLabel value="chat" control={<Radio />} label="Chat" />
          <FormControlLabel value="both" control={<Radio />} label="Both" />
        </RadioGroup>
      </FormControl>
      {(radioSelection === "game_event" || radioSelection === "both") && (
        <EventLog messages={gameEventMessages} />
      )}
      {(radioSelection === "chat" || radioSelection === "both") && (
        <PlayerChat messages={chatMessages} handleSendChat={handleSendChat} />
      )}
    </>
  );
};
