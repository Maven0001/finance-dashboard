import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Role } from "../../types/interface";

interface AppState {
  role: Role;
  darkMode: boolean;
  activeTab: "dashboard" | "transactions" | "insights";
}

const appSlice = createSlice({
  name: "app",
  initialState: {
    role: "viewer" as Role,
    darkMode: false,
    activeTab: "dashboard" as AppState["activeTab"],
  },
  reducers: {
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setActiveTab: (state, action: PayloadAction<AppState["activeTab"]>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setRole, toggleDarkMode, setActiveTab } = appSlice.actions;
export default appSlice.reducer;
