import { ContentCopy } from "@mui/icons-material";
import { Box, Button, TextField, Tooltip, Typography } from "@mui/material";

interface TextWithCopyButtonProps {
  title: string;
  text: string;
  handleCopy(text: string): void;
}

export default function TextWithCopyButton({
  title,
  text,
  handleCopy,
}: TextWithCopyButtonProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body1" sx={{ minWidth: "max-content" }}>
        {title}
      </Typography>
      <TextField
        disabled
        value={text}
        variant="outlined"
        fullWidth
        InputProps={{
          sx: { maxHeight: "40px" },
        }}
      />
      <Tooltip title="Copy to clipboard">
        <Button
          onClick={() => handleCopy(text)}
          variant="outlined"
          color="primary"
          aria-label="copy to clipboard"
        >
          <ContentCopy />
        </Button>
      </Tooltip>
    </Box>
  );
}
