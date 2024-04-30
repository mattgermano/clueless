import { Box, TextField } from "@mui/material";
import { useState } from "react";
import { PlayerMessage, PlayerMessageProps } from "./Message";
interface PlayerChatProps {
  messages: PlayerMessageProps[];
  handleSendChat(s: string): void;
}
let systemMessageId = 1;
export default function PlayerChat({
  messages,
  handleSendChat,
}: PlayerChatProps) {
  const [chatMessage, setChatMessage] = useState<string>("");
  return (
    <>
      <Box height="calc(100% - 80px)">
        {messages.map((msg) => (
          <PlayerMessage
            id={1}
            key={msg.id}
            type={msg.type}
            sender={msg.sender}
            isUser={msg.isUser}
            message={msg.message}
          ></PlayerMessage>
        ))}
      </Box>
      <Box height={80} justifyContent={"left"} width="90%" display="flex" m="20px">
        <TextField
          label="Send a message..."
          value={chatMessage}
          onChange={(e) => {
            setChatMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendChat(chatMessage);
              setChatMessage("");
            }
          }}
          sx={{ height: 60 }}
        />
      </Box>
    </>
  );
}
