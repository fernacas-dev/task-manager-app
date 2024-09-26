import { StateCreator } from "zustand";

export interface GuestSlice {
  gestCount: number;
  setGuestCount: (guestCount: number) => void;
}

export const createGuestSlice: StateCreator<GuestSlice> = (set) => ({
  gestCount: 0,
  setGuestCount: (guestCount: number) =>
    set({ gestCount: guestCount > 0 ? guestCount : 0 }),
});
