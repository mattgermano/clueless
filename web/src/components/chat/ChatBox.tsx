import { ChatOutlined } from "@mui/icons-material";
import { Button, Drawer, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { Chat, ChatProps } from "./Chat";

export const ChatBox = ({ messages, handleSendChat }: ChatProps) => {
  useEffect(() => {}, [messages]);
  const [open, setOpen] = useState(true);
  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(!open)}>
        <span className="pr-2">Chat</span> <ChatOutlined fontSize="small" />
      </Button>
      <Drawer
        anchor="right"
        variant="persistent"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            "& .MuiDrawer-paper": { boxSizing: "border-box" },
            height: "calc(100%)",
            minWidth: 400,
            maxWidth: 400,
          }}
        >
          <Chat messages={messages} handleSendChat={handleSendChat} />
        </Paper>
      </Drawer>
    </div>
  );
};
