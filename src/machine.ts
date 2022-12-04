import { match } from "ts-pattern";
import produce from "immer";
import {
  assign,
  createMachine,
  interpret,
  InterpreterFrom,
  StateFrom,
} from "xstate";
import { YahtzeeContext, ScoreCard } from "./types";
import { YahtzeeUtils } from "./utils";
import create, { StoreApi } from "zustand";

type Event =
  | { type: "ROLL" | "RESET" }
  | { type: "SELECT_DIE"; index: number }
  | ({
      type: "SET_SCORE";
      level: "upper";
      isYahtzee?: boolean;
    } & Partial<ScoreCard["upper"]>)
  | ({
      type: "SET_SCORE";
      level: "lower";
      isYahtzee?: boolean;
    } & Partial<ScoreCard["lower"]>);

export const yahtzeeMachine = createMachine(
  {
    id: "yahtzee",
    tsTypes: {} as import("./machine.typegen").Typegen0,
    schema: {
      events: {} as Event,
      context: {} as Pick<YahtzeeContext, "scoreCard" | "hand" | "turn">,
    },
    context: {
      turn: 0,
      scoreCard: YahtzeeUtils.makeInitialScoreCard(),
      hand: null,
    },
    initial: "idle",
    on: {
      RESET: { actions: ["reset"] },
      ROLL: [{ target: "rolling", actions: ["roll"], cond: "canRoll" }],
    },
    states: {
      idle: {
        on: {
          ROLL: { target: "rolling", actions: ["roll"] },
        },
      },
      rolling: {
        after: {
          300: { target: "selecting" },
        },
      },
      selecting: {
        on: {
          SET_SCORE: { actions: ["setScore"], target: "scored" },
          SELECT_DIE: { actions: ["selectDie"] },
        },
      },
      scoring: {
        on: {
          SET_SCORE: { actions: ["setScore"], target: "scored" },
        },
      },
      scored: {
        always: [
          {
            target: "gameOver",
            cond: "isGameOver",
          },
        ],
      },
      gameOver: {
        type: "final",
      },
    },
  },
  {
    actions: {
      roll: assign({
        turn: (ctx, _e) => ctx.turn + 1,
        hand: (ctx, _e) => {
          const { hand } = ctx;

          return (
            hand ??
            Array.from({ length: 5 }, () => ({
              selected: false,
              value: YahtzeeUtils.getRandomRoll(),
            }))
          ).map((d) =>
            d.selected ? d : { ...d, value: YahtzeeUtils.getRandomRoll() }
          ) as typeof hand;
        },
      }),
      selectDie: assign({
        hand: (ctx, e) => {
          const { hand } = ctx;
          const { index: i } = e;
          return produce<typeof hand>(hand, (draft) => {
            if (!draft) return;
            draft[i].selected = !draft[i].selected;
          });
        },
      }),
      setScore: assign({
        turn: (_ctx, _evt) => 0,
        hand: (_ctx, _evt) => null,
        scoreCard: (ctx, evt) => {
          const { isYahtzee } = evt;
          const { scoreCard } = ctx;

          return produce(scoreCard, (draft) => {
            if (scoreCard.lower.yahtzee !== null && isYahtzee) {
              draft.yahtzeeCount += 1;
            }
            match(evt)
              .with(
                { level: "upper" },
                ({ isYahtzee, level, type, ...rest }) => {
                  draft.upper = { ...draft.upper, ...rest };
                }
              )
              .with(
                { level: "lower" },
                ({ isYahtzee, level, type, ...rest }) => {
                  draft.lower = { ...draft.lower, ...rest };
                }
              )
              .otherwise(() => {});
          });
        },
      }),
      reset: assign({
        turn: (_ctx, _evt) => 0,
        hand: (_ctx, _evt) => null,
        scoreCard: (_ctx, _evt) => YahtzeeUtils.makeInitialScoreCard(),
      }),
    },
    guards: {
      canRoll: (ctx, _e) => ctx.turn < 3,
      isGameOver: (ctx, _e) => YahtzeeUtils.isGameOver(ctx),
    },
  }
);

type Interpreter = InterpreterFrom<typeof yahtzeeMachine>;

type Store = {
  state: StateFrom<typeof yahtzeeMachine>;
  send: Interpreter["send"];
  service: Interpreter;
};

export const useYahtzeeStore = create(
  (set: StoreApi<Store>["setState"]): Store => {
    const service = interpret(yahtzeeMachine)
      .onTransition((state) => {
        const initialStateChanged =
          state.changed === undefined && Object.keys(state.children).length;

        if (state.changed || initialStateChanged) {
          set({ state });
        }
      })
      .start();

    return {
      state: service.getSnapshot(),
      send: service.send,
      service,
    };
  }
);
