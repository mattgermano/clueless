"use client";

import { MenuBook } from "@mui/icons-material";
import { Box, Button, List, ListItem, Modal, Typography } from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "black",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function RulesButton() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        <span className="pr-4">Rules</span> <MenuBook fontSize="small" />
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Game Rules
          </Typography>
          <List>
            <ListItem>
              The rooms are laid out in a 3x3 grid with a hallway separating
              each pair of adjacent rooms.
            </ListItem>
            <ListItem>
              All characters are located in starter squares. The first move for
              each player is to move their character to the adjacent hallway.
            </ListItem>
            <ListItem>
              Each hallway only holds up to one character. If a character is
              currently in a hallway, you may not move there.
            </ListItem>
            <ListItem>
              When it is your turn, you do not need to roll a die.
            </ListItem>
            <ListItem>
              If you are in a room, you may do one of the following: move
              through one of the doors to the hallway (if it is not blocked),
              take a secret passage to a diagonally opposite room (if there is
              one) and make a suggestion, or if you were moved to the room by
              another player who has made a suggestion, you may, if you wish,
              stay in that room and make a suggestion. Otherwise, you may move
              through a doorway or take a secret passage as described above.
            </ListItem>
            <ListItem>
              If you are in a hallway, you must move to one of the two rooms
              accessible from that hallway and make a suggestion.
            </ListItem>
            <ListItem>
              If all exits are blocked (i.e., there are characters in all of the
              hallways) and you are not in one of the corner rooms (with a
              secret passage), and you were not moved to the room by another
              player making a suggestion, you can not make a suggestion (but you
              can make an accusation).
            </ListItem>
            <ListItem>
              Your first move must be to the hallway that is adjacent to your
              home square. The inactive characters stay in their home squares
              until they are moved to a room by someone making a suggestion.
            </ListItem>
            <ListItem>
              As in the regular game, whenever a suggestion is made, you only
              specify the character and the weapon. The room must be the room
              the one making the suggestion is currently in. The suspect in the
              suggestion is moved to the room in the suggestion.
            </ListItem>
            <ListItem>
              You may make an accusation at any time during your turn.
            </ListItem>
            <ListItem>Source: Clue-Less rules document on Canvas</ListItem>
          </List>
          <Button
            variant="contained"
            className="float-right"
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
