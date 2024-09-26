import { create, StateCreator } from "zustand";
// import { customSessionStorage } from "../storages/sesssion.storage";
import { devtools, persist } from "zustand/middleware";
import { useWeddingBoundStore } from "../wedding";
// import { firebaseStorage } from "../storages/firebase.storage";
// import { logger } from "../middlewares/logger.middleware";

interface PersonState {
  firstName: string;
  lastName: string;
}

interface Actions {
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}

const storeAPI: StateCreator<
  PersonState & Actions,
  [["zustand/devtools", unknown]]
> = (set) => ({
  firstName: "",
  lastName: "",

  setFirstName: (value: string) =>
    set({ firstName: value }, false, "setFirstName"),
  setLastName: (value: string) =>
    set({ lastName: value }, false, "setLastName"),
});

export const userPersonStore = create<PersonState & Actions>()(
  // logger(
  devtools(
    persist(storeAPI, {
      name: "person-storage",
      // storage: customSessionStorage,
      // storage: firebaseStorage,
    })
  )
  // )
);

userPersonStore.subscribe((nextState, prevState) => {
  console.log(nextState, prevState);
  const { firstName, lastName } = nextState;

  // Warning with cyclic dependencies
  useWeddingBoundStore.getState().setFirstName(firstName);
  useWeddingBoundStore.getState().setLastName(lastName);
});
