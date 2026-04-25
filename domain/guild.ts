import { RollResult } from "../bot/diceRoll.ts";

export type Guild = {
  _id: string;
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
