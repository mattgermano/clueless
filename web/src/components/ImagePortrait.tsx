import { Avatar, Box, Tooltip } from "@mui/material";

interface ImagePortraitProps {
  title: string;
  image: string;
  width?: number;
  height?: number;
}

export default function ImagePortrait({
  title,
  image,
  width = 150,
  height = 150,
}: ImagePortraitProps) {
  return (
    <Tooltip title={title}>
      <Avatar
        alt={title}
        src={image}
        sx={{
          width: { width },
          height: { height },
          border: "3px solid white",
        }}
      />
    </Tooltip>
  );
}
