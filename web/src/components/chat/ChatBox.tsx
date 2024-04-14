import { Box, Drawer, Paper } from "@mui/material";
import { useEffect } from "react";
import { Chat, ChatProps } from "./Chat";

export const ChatBox = ({ messages, handleSendChat }: ChatProps) => {
  useEffect(() => {}, [messages]);
  return (
    <Box component="nav" sx={{ display: "flex" }}>
      <Drawer
        ModalProps={{ keepMounted: true }}
        variant="permanent"
        anchor="right"
        open
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
    </Box>
  );
};
