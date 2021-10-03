import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
export interface State {
	username: string,
	loggedIn: boolean
};

export const store = createStore<State>({
	state: {
	  username: '',
	  loggedIn: false,
	},
	mutations: {
		login (state: State, username: string) {
			state.username = username;
			state.loggedIn = true;
		},
		logOut (state: State) {
			state.loggedIn = false;
		},
	},
	plugins: [
		createPersistedState(),
	],
})