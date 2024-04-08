// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.after(300)#yahtzee.rolling": {
      type: "xstate.after(300)#yahtzee.rolling";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    gameOverToast: "";
    reset: "RESET" | "ROLL";
    roll: "ROLL";
    selectDie: "SELECT_DIE";
    setScore: "SET_SCORE";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    canRoll: "ROLL";
    isGameOver: "";
  };
  eventsCausingServices: {};
  matchesStates:
    | "gameOver"
    | "idle"
    | "rolling"
    | "scored"
    | "scoring"
    | "selecting";
  tags: never;
}
