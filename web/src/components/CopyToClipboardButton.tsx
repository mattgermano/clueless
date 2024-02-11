import { ContentCopy } from "@mui/icons-material";
import { Button, Snackbar } from "@mui/material";
import { useState } from "react";

export default function CopyToClipboardButton() {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(window.location.toString());
  };

  return (
    <>
      <Button onClick={handleClick} variant="contained">
        <ContentCopy />
      </Button>
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={2000}
        message="Copied to clipboard"
      />
    </>
  );
}
