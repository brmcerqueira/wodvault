import { RollResult } from "./diceRoll.ts";

export type Guild = {
  id: string;
  currentCharacterId: string | null;
  storytellerId: string | null;
  difficulty: number | null;
  modifier: number | null;
  rollChannelId: string | null;
  characters: Record<string, string>;
  lastRolls: Record<string, {
    content: string;
    result: RollResult;
  }>;
};
