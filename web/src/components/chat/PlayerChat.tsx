import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { PlayerMessage, PlayerMessageProps } from "./Message";
interface PlayerChatProps {
  children: React.ReactNode;
  messages: PlayerMessageProps[];
  handleSendChat(s: string): void;
}
let systemMessageId = 1;
export default function PlayerChat({
  children,
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
      <Box height={80} justifyContent={"center"} width="90%" display="flex">
        <TextField
          label="Send a message..."
          value={chatMessage}
          onChange={(e) => {
            setChatMessage(e.target.value);
          }}
          sx={{ height: 60 }}
        />
        <Button
          sx={{ height: 60 }}
          onClick={() => {
            handleSendChat(chatMessage);
            setChatMessage("");
          }}
        >
          Send
        </Button>
      </Box>
    </>
  );
}
