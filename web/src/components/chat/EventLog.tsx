import { Box } from "@mui/material";
import { SystemMessage, SystemMessageProps } from "./Message";

interface EventLogProps {
  children: React.ReactNode;
  messages: SystemMessageProps[];
}

let systemMessageId = 1;
export default function EventLog({ children, messages }: EventLogProps) {
  return (
    <Box sx={{ overflow: "auto" }}>
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
