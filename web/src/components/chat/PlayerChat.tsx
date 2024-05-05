import { SendOutlined } from "@mui/icons-material";
import { Box, Button, TextField } from "@mui/material";
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
      <Box className="text-left" height="calc(100% - 80px)">
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
      <Box justifyContent={"left"} display="flex" m="20px">
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
        />
        <Button
          onClick={() => {
            handleSendChat(chatMessage);
            setChatMessage("");
          }}
        >
          <SendOutlined />
        </Button>
      </Box>
    </>
  );
}
