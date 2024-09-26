import { createJSONStorage, StateStorage } from "zustand/middleware";

const firebaseURL =
  "https://curso-zustand-26bd7-default-rtdb.firebaseio.com/zustand";

export const storageAPI: StateStorage = {
  getItem: async function (name: string): Promise<string | null> {
    try {
      const data = await fetch(`${firebaseURL}/${name}.json`).then((res) =>
        res.json()
      );
      console.log(data);
      return JSON.stringify(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  setItem: async function (name: string, value: string): Promise<void> {
    const data = await fetch(`${firebaseURL}/${name}.json`, {
      method: "PUT",
      body: value,
    }).then((res) => res.json());
    console.log(data);
    return data;
  },
  removeItem: function (name: string): void {
    console.log("removeItem", name);
  },
};

export const firebaseStorage = createJSONStorage(() => storageAPI);
