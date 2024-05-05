import { Paper, Typography } from "@mui/material";

import { GetCharacterById } from "../utils/characters";

export interface PlayerMessageProps {
  id: number;
  type: string; // player
  sender: string | undefined;
  isUser: boolean | undefined;
  message: string | undefined;
}

export interface SystemMessageProps {
  id: number;
  type: string; // system
  event_type: string;
  message: string;
}

export type Message = PlayerMessageProps | SystemMessageProps;

export const PlayerMessage = (props: PlayerMessageProps) => {
  let sender = GetCharacterById(props.sender)?.name;
  if (props.isUser && sender !== null) {
    sender += " (You)";
  }
  return (
    <Paper>
      <Typography paragraph>
        {sender}: {props.message}
      </Typography>
    </Paper>
  );
};

export const SystemMessage = (props: SystemMessageProps) => {
  return (
    <Paper>
      <Typography paragraph>{props.message}</Typography>
    </Paper>
  );
};
