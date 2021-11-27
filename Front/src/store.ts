import { Component } from 'vue';
import { createStore, Store, StoreOptions } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { IIndexable } from '../../Back/src/models';
import { ICollection } from '../../Core/types/Collection';

export type StoreComponent = Component & {
	$store: Store<State>;
};

export interface State {
	username: string,
	loggedIn: boolean,
	currentCollection: ICollection|null,
}

export interface IStateMutations {
	login: (state: State, username: string) => void;
	logOut: (state: State) => void;
	openCollection: (state: State, collection: ICollection) => void;
}

interface StateObject {
	state: State;
	mutations: IStateMutations;
	plugins: Function[];
}

const defaultState: State = {
	username: '',
	loggedIn: false,
	currentCollection: null,
};

const stateObject: StateObject = {
	state: {...defaultState,},
	mutations: {
		login (state, username) {
			state.username = username;
			state.loggedIn = true;
		},
		logOut (state) {
			const newState = {
				...defaultState,
				username: state.username,
			}
			for (const key in Object.keys(newState)) {
				(state as IIndexable)[key] = (newState as IIndexable)[key]
			}
		},
		openCollection (state, collection) {
			state.currentCollection = collection;
		},
	},
	plugins: [
		createPersistedState(),
	],
};

export const store = createStore<State>(stateObject as unknown as StoreOptions<State>);

export const getState = (component: StoreComponent): State => {
	return component.$store.state as State;
}

export const setState = (component: StoreComponent) => {
	
	const store = component.$store;

	return {
		login: (username: string) => {
			store.commit('login', username);
		},
		logOut: () => {
			store.commit('logOut');
		},
		openCollection: (collection: ICollection) => {
			store.commit('openCollection', collection)
		},
	}
}