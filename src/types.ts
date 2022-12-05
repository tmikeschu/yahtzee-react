export type Tuple5<T> = [T, T, T, T, T];

export const UPPER_KEYS = [
  "ones",
  "twos",
  "threes",
  "fours",
  "fives",
  "sixes",
] as const;
export type UpperKey = typeof UPPER_KEYS[number];
export type UpperScoreCard = Record<UpperKey, number | null>;

export const LOWER_KEYS = [
  "threeOfAKind",
  "fourOfAKind",
  "fullHouse",
  "smallStraight",
  "largeStraight",
  "yahtzee",
  "chance",
] as const;
export type LowerKey = typeof LOWER_KEYS[number];

type ValidateKeys<
  K,
  T extends keyof T extends K ? (K extends keyof T ? unknown : never) : never
> = T;

export type LowerScoreCard = ValidateKeys<
  LowerKey,
  {
    threeOfAKind: number | null;
    fourOfAKind: number | null;
    fullHouse: number | null;
    smallStraight: 35 | 0 | null;
    largeStraight: 40 | 0 | null;
    yahtzee: 50 | 0 | null;
    chance: number | null;
  }
>;

export interface ScoreCard extends UpperScoreCard, LowerScoreCard {}

type SelectableDie = { value: number; selected: boolean };

export interface YahtzeeContext {
  hand: Tuple5<SelectableDie> | null;
  turn: number;
  scoreCard: ScoreCard;
  yahtzeeCount: number;
}
