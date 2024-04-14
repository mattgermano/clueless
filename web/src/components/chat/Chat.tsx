"use client";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
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
    setGameEventMessages(messages.filter((msg) => msg.type === "system"));
    setChatMessages(messages.filter((msg) => msg.type === "player"));
  }, [messages]);

  return (
    <>
      <FormControl>
        <FormLabel>Chat Rooms</FormLabel>
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
        </RadioGroup>
      </FormControl>
      {radioSelection === "chat" && (
        <PlayerChat messages={chatMessages} handleSendChat={handleSendChat} />
      )}
      {radioSelection === "game_event" && (
        <EventLog messages={gameEventMessages} />
      )}
    </>
  );
};
