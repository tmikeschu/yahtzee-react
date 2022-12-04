export type Tuple5<T> = [T, T, T, T, T];

export interface ScoreCard {
  upper: {
    ones: number | null;
    twos: number | null;
    threes: number | null;
    fours: number | null;
    fives: number | null;
    sixes: number | null;
  };
  lower: {
    threeOfAKind: number | null;
    fourOfAKind: number | null;
    fullHouse: number | null;
    smallStraight: 35 | 0 | null;
    largeStraight: 40 | 0 | null;
    yahtzee: 50 | 0 | null;
    chance: number | null;
  };
  yahtzeeCount: number;
}

export interface YahtzeeContext {
  hand: Tuple5<{ value: number; selected: boolean }> | null;
  turn: number;
  scoreCard: ScoreCard;
}

export interface YahtzeeStore extends YahtzeeContext {
  roll: () => void;
  select: (n: number) => void;
  setUpper: <K extends keyof ScoreCard["upper"]>(
    key: K,
    value: ScoreCard["upper"][K],
    isYahtzee?: boolean
  ) => void;
  setLower: <K extends keyof ScoreCard["lower"]>(
    key: K,
    value: ScoreCard["lower"][K],
    isYahtzee?: boolean
  ) => void;
  reset: () => void;
}
