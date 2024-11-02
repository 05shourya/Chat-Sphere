import { create } from "zustand";

export const useMobileViewStore = create((set) => ({
	activeView: 'list',
	changeView: (view) => {
		set({
			activeView: view
		})
	}
}))