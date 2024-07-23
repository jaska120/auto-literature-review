import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createConfigSlice } from "./config/config";
import { ConfigSlice } from "./config/types";

export const useBoundStore = create<ConfigSlice>()(
  persist(
    (...args) => ({
      ...createConfigSlice(...args),
    }),
    { name: "bound-store" }
  )
);
