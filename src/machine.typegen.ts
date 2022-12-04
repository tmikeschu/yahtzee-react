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
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    reset: "RESET";
    roll: "ROLL";
    selectDie: "SELECT_DIE";
    setScore: "SET_SCORE";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    canRoll: "ROLL";
    isGameOver: "";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "gameOver"
    | "idle"
    | "rolling"
    | "scored"
    | "scoring"
    | "selecting";
  tags: never;
}
