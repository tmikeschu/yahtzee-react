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
import { toast } from "./toast";

type Event =
  | { type: "ROLL" | "RESET" }
  | { type: "SELECT_DIE"; index: number }
  | ({ type: "SET_SCORE"; isYahtzee?: boolean } & Partial<ScoreCard>);

export const yahtzeeMachine = createMachine(
  {
    id: "yahtzee",
    tsTypes: {} as import("./machine.typegen").Typegen0,
    schema: {
      events: {} as Event,
      context: {} as YahtzeeContext,
    },
    context: {
      turn: 0,
      scoreCard: YahtzeeUtils.makeInitialScoreCard(),
      hand: null,
      yahtzeeCount: 0,
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
        entry: ["gameOverToast"],
        on: {
          ROLL: { target: "rolling", actions: ["reset", "roll"] },
        },
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

          hand?.forEach((d, index) => {
            if (index === e.index) {
              d.selected = !d.selected;
            }
          });

          return hand;
        },
      }),
      setScore: assign({
        turn: (_ctx, _evt) => 0,
        hand: (_ctx, _evt) => null,
        yahtzeeCount: (ctx, evt) => {
          return evt.isYahtzee ? ctx.yahtzeeCount + 1 : ctx.yahtzeeCount;
        },
        scoreCard: (ctx, evt) => {
          const { isYahtzee, type: _, ...rest } = evt;
          return Object.assign(ctx.scoreCard, rest);
        },
      }),
      reset: assign({
        turn: (_ctx, _evt) => 0,
        hand: (_ctx, _evt) => null,
        scoreCard: (_ctx, _evt) => YahtzeeUtils.makeInitialScoreCard(),
        yahtzeeCount: (_ctx, _evt) => 0,
      }),
      gameOverToast: (ctx) => {
        toast({
          status: "info",
          title: "Game Over",
          description: `Total score: ${YahtzeeUtils.getTotalScore(ctx)}`,
          isClosable: true,
        });
      },
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
  persist: () => void;
};

export const useYahtzeeStore = create(
  (set: StoreApi<Store>["setState"], get): Store => {
    let persistedState: StateFrom<typeof yahtzeeMachine> | undefined;
    try {
      persistedState = JSON.parse(localStorage.getItem("yahtzee") || "null");
    } catch (e) {
      console.error(e);
    }

    const service = interpret(yahtzeeMachine)
      .onTransition((state) => {
        const initialStateChanged =
          state.changed === undefined && Object.keys(state.children).length;

        if (state.changed || initialStateChanged) {
          set({ state });
        }
      })
      .start(persistedState);

    return {
      state: service.getSnapshot(),
      send: service.send,
      service,
      persist: () => {
        const state = service.getSnapshot();
        localStorage.setItem("yahtzee", JSON.stringify(state));
      },
    };
  }
);
