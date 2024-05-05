import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { SystemMessage, SystemMessageProps } from "./Message";

interface EventLogProps {
  messages: SystemMessageProps[];
}

let systemMessageId = 1;
export default function EventLog({ messages }: EventLogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Dependency array includes messages, so it scrolls down every time the messages array changes

  return (
    <Box className="text-left thin-scrollbar ml-2 mr-2 mt-2 ring-gray-600 ring-2 overflow-y-scroll overflow-x-hidden">
      <Typography className="text-center" variant="h6">
        Game Events
      </Typography>
      {messages.map((msg) => (
        <SystemMessage
          id={1}
          key={msg.id}
          type={msg.type}
          event_type={msg.event_type}
          message={msg.message}
        ></SystemMessage>
      ))}
      <div ref={messagesEndRef} /> {/* Invisible element at the bottom */}
    </Box>
  );
}
