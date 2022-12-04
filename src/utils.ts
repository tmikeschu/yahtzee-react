import { match } from "ts-pattern";
import produce from "immer";
import { ScoreCard, YahtzeeContext, Tuple5 } from "./types";

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function getRandomRotation() {
  return getRandomIntInclusive(0, 360);
}

function getRandomRotationSequence() {
  return Array.from({ length: getRandomIntInclusive(5, 10) }, () =>
    getRandomRotation()
  );
}

function getRandomXTranslation() {
  return getRandomIntInclusive(-10, 10);
}

function getRandomYTranslation() {
  return getRandomIntInclusive(-20, -1);
}

function getRandomRoll() {
  return getRandomIntInclusive(1, 6);
}

const makeInitialScoreCard = (): ScoreCard => {
  return {
    upper: {
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
    },
    lower: {
      threeOfAKind: null,
      fourOfAKind: null,
      fullHouse: null,
      smallStraight: null,
      largeStraight: null,
      yahtzee: null,
      chance: null,
    },
    yahtzeeCount: 0,
  };
};

function isGameOver(store: YahtzeeContext) {
  const { upper, lower } = store.scoreCard;
  return Object.values({ ...upper, ...lower }).every((n) => n !== null);
}

function sum(...nums: number[]) {
  return nums.reduce((a, b) => a + b, 0);
}

function getFrequency(...nums: number[]) {
  return nums.reduce((acc, el) => {
    acc[el] = (acc[el] ?? 0) + 1;
    return acc;
  }, {} as Record<number, number>);
}

function evaluateHand(store: YahtzeeContext): ScoreCard {
  const { scoreCard: current } = store;

  if (!store.hand) return current;

  const hand = store.hand.map(({ value }) => value) as Tuple5<number>;
  const isYahtzee = new Set(hand).size === 1;
  const isJokerRules = current.yahtzeeCount >= 1;

  return produce(current, (draft) => {
    draft.upper = Object.fromEntries(
      Object.entries(draft.upper).map(([key, val]) => [
        key,
        val ??
          match<keyof ScoreCard["upper"], number>(
            key as keyof ScoreCard["upper"]
          )
            .with("ones", () => sum(...hand.filter((x) => x === 1)))
            .with("twos", () => sum(...hand.filter((x) => x === 2)))
            .with("threes", () => sum(...hand.filter((x) => x === 3)))
            .with("fours", () => sum(...hand.filter((x) => x === 4)))
            .with("fives", () => sum(...hand.filter((x) => x === 5)))
            .with("sixes", () => sum(...hand.filter((x) => x === 6)))
            .otherwise(() => 0),
      ])
    ) as typeof draft.upper;

    draft.lower = Object.fromEntries(
      Object.entries(draft.lower).map(([key, val]) => [
        key,
        val ??
          match<keyof ScoreCard["lower"], number>(
            key as keyof ScoreCard["lower"]
          )
            .with("threeOfAKind", () => {
              const freqs = Object.values(getFrequency(...hand));
              return freqs.some((x) => x >= 3) ? sum(...hand) : 0;
            })
            .with("fourOfAKind", () => {
              const freqs = Object.values(getFrequency(...hand));
              return freqs.some((x) => x >= 4) ? sum(...hand) : 0;
            })
            .with("fullHouse", () => {
              const freqs = getFrequency(...hand);
              const [a, b] = Object.values(freqs).sort((a, b) => a - b);
              return (isJokerRules && isYahtzee) || (a === 2 && b === 3)
                ? 25
                : 0;
            })
            .with("smallStraight", () => {
              const digits = Array.from(
                new Set([...hand].sort((a, b) => a - b))
              ).join("");
              return (isJokerRules && isYahtzee) ||
                digits.match(/(1234|2345|3456)/)
                ? 35
                : 0;
            })
            .with("largeStraight", () => {
              const digits = Array.from(
                new Set([...hand].sort((a, b) => a - b))
              ).join("");
              return (isJokerRules && isYahtzee) ||
                digits.match(/(12345|23456)/)
                ? 40
                : 0;
            })
            .with("yahtzee", () => {
              const freqs = Object.values(getFrequency(...hand));
              return freqs.some((x) => x === 5) ? 50 : 0;
            })
            .with("chance", () => sum(...hand))
            .otherwise(() => 0),
      ])
    ) as typeof draft.lower;
  });
}

function getUpperScore(upper: ScoreCard["upper"]): number {
  return sum(...Object.values(upper).map((x) => x ?? 0));
}

function getUpperBonus(upper: ScoreCard["upper"]): number {
  return getUpperScore(upper) >= 63 ? 35 : 0;
}

function getLowerScore(lower: ScoreCard["lower"]): number {
  return sum(...Object.values(lower).map((x) => x ?? 0));
}

function getYahtzeeBonus(store: YahtzeeContext) {
  return Math.max(0, store.scoreCard.yahtzeeCount - 1) * 100;
}

function getTotalScore(store: YahtzeeContext) {
  const { upper, lower } = store.scoreCard;
  return (
    getUpperScore(upper) +
    getUpperBonus(upper) +
    getLowerScore(lower) +
    getYahtzeeBonus(store)
  );
}

const capitalize = (s: string) =>
  s[0].toUpperCase() + s.slice(1).toLocaleLowerCase();

const getLabel = (key: keyof ScoreCard["upper"] | keyof ScoreCard["lower"]) => {
  return match(key)
    .with(
      "threeOfAKind",
      "fourOfAKind",
      "fullHouse",
      "smallStraight",
      "largeStraight",
      (k) => {
        const split = k.replace(/([a-z])([A-Z])?([A-Z])/g, "$1 $2 $3");
        return capitalize(split);
      }
    )
    .otherwise((k) => capitalize(k));
};

function handIsYahtzee(hand: YahtzeeContext["hand"]) {
  return new Set(hand?.map(({ value }) => value)).size === 1;
}

export const YahtzeeUtils = {
  getLowerScore,
  getUpperScore,
  getUpperBonus,
  getRandomRoll,
  getTotalScore,
  getYahtzeeBonus,
  evaluateHand,
  isGameOver,
  getLabel,
  handIsYahtzee,
  makeInitialScoreCard,
  getRandomRotation,
  getRandomRotationSequence,
  getRandomXTranslation,
  getRandomYTranslation,
};
