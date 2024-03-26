import { Characters } from "./characters";
import { Rooms } from "./rooms";
import { Weapons } from "./weapons";

export function GetCardInfo(card: string) {
  for (const character of Characters) {
    if (card === character.id) {
      return character;
    }
  }

  for (const weapon of Weapons) {
    if (card === weapon.id) {
      return weapon;
    }
  }

  for (const room of Rooms) {
    if (card === room.id) {
      return room;
    }
  }

  return undefined;
}
