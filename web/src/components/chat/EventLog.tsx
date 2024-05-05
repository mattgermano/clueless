import { Box } from "@mui/material";
import { SystemMessage, SystemMessageProps } from "./Message";

interface EventLogProps {
  messages: SystemMessageProps[];
}

let systemMessageId = 1;
export default function EventLog({ messages }: EventLogProps) {
  return (
    <Box className="text-left" sx={{ overflow: "auto" }}>
      {messages.map((msg) => (
        <SystemMessage
          id={1}
          key={msg.id}
          type={msg.type}
          event_type={msg.event_type}
          message={msg.message}
        ></SystemMessage>
      ))}
    </Box>
  );
}
