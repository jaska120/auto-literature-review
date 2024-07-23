import { StateCreator } from "zustand";
import * as Op from "@/utils/operation";
import { SearchSlice } from "./types";
import { searchScopus } from "../effects/scopus/scopus";

export const createSearchSlice: StateCreator<SearchSlice> = (set) => ({
  literatureSearch: Op.idle,
  loadLiteratureSearch: async (query) => {
    set({ literatureSearch: Op.running });
    try {
      const response = await searchScopus(query);
      console.log({ response });
      set({ literatureSearch: Op.success(undefined) });
    } catch (e) {
      set({ literatureSearch: Op.error(e) });
    }
  },
});
