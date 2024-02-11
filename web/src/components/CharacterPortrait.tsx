import { Avatar, Tooltip } from "@mui/material";

interface CharacterPortraitProps {
  title: string;
  image: string;
  width?: number;
  height?: number;
}

export default function CharacterPortrait({
  title,
  image,
  width = 150,
  height = 150,
}: CharacterPortraitProps) {
  return (
    <Tooltip title={title}>
      <Avatar
        alt={title}
        src={image}
        sx={{ width: { width }, height: { height } }}
      />
    </Tooltip>
  );
}
