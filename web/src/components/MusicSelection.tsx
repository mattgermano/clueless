import { MusicNoteOutlined, VolumeDown, VolumeUp } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function MusicSelection() {
  const [open, setOpen] = useState(false);
  const [music, setMusic] = useState("None");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleMusicChange = (event: SelectChangeEvent) => {
    setMusic(event.target.value as string);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
    if (audioRef.current) {
      audioRef.current.volume = newValue as number;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (music === "None") {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  }, [music]);

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        <span className="pr-2">Music</span>{" "}
        <MusicNoteOutlined fontSize="small" />
      </Button>
      {music !== "None" && <audio ref={audioRef} src={music} loop />}
      <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
        <DialogTitle>Music Selection</DialogTitle>
        <div>
          <FormControl fullWidth>
            <InputLabel>Music</InputLabel>
            <Select value={music} label="Music" onChange={handleMusicChange}>
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="/music/shadows_of_the_night.mp3">
                Shadows of the Night
              </MenuItem>
              <MenuItem value="/music/whispering_shadows.mp3">
                Whispering Shadows
              </MenuItem>
              <MenuItem value="/music/phantom_echoes.mp3">
                Phantom Echoes
              </MenuItem>
              <MenuItem value="/music/whispers_of_the_shadows.mp3">
                Whispers of the Shadows
              </MenuItem>
              <MenuItem value="/music/clue_in_the_shadows.mp3">
                Clue in the Shadows
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <Stack
          className="mt-4"
          spacing={2}
          direction="row"
          sx={{ mb: 1 }}
          alignItems="center"
        >
          <VolumeDown />
          <Slider
            value={volume}
            min={0}
            max={1}
            step={0.1}
            onChange={handleVolumeChange}
            marks
            aria-labelledby="continuous-slider"
          />
          <VolumeUp />
        </Stack>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleClose();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
