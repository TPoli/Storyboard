import { Component } from 'vue';
import { createStore, Store, StoreOptions } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { ICollection } from 'core';
import { IUserContext, UserContext } from './userContext';

export type StoreComponent = Component & {
	$store: Store<State>;
};

export interface State {
	username: string,
	loggedIn: boolean,
	currentCollection: string,
	userContext: IUserContext;
	collectionCache: ICollection[];
}

export interface IStateMutations {
	login: (state: State, username: string) => void;
	logOut: (state: State) => void;
	openCollection: (state: State, collection: ICollection) => void;
	updateUserContext: (state: State, userContext: IUserContext) => void;
	setCurrentCollection: (state: State, collectionId: string) => void;
}

interface StateObject {
	state: State;
	mutations: IStateMutations;
	plugins: Function[];
}

const defaultState: State = {
	username: '',
	loggedIn: false,
	currentCollection: '',
	collectionCache: [],
	userContext: {
		currentIndex: 0,
		history: [],
	},
};

const stateObject: StateObject = {
	state: {...defaultState,},
	mutations: {
		login (state, username) {
			state.username = username;
			state.loggedIn = true;
		},
		logOut (state) {
			// state.username = state.username; // helper to log back in quickly
			state.loggedIn = defaultState.loggedIn;
			state.currentCollection = defaultState.currentCollection;
			state.userContext = defaultState.userContext;
			state.collectionCache = defaultState.collectionCache;
		},
		openCollection (state, collection) {
			const userContext = new UserContext(state.userContext);

			userContext.openCollection({
				id: collection.uuid,
				title: collection.title,
				type: 'Collection',
			});

			state.userContext = {
				currentIndex: userContext.currentIndex,
				history: userContext.history,
			};

			if (!state.collectionCache.find(c => c.uuid === collection.uuid)) {
				state.collectionCache.push(collection);
			}
			
			state.currentCollection = collection.uuid;
		},
		updateUserContext (state, userContext) {
			state.userContext = userContext;
		},
		setCurrentCollection (state, collectionId) {
			state.currentCollection = collectionId;
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
		updateUserContext: (userContext: IUserContext) => {
			store.commit('updateUserContext', userContext)
		},
		setCurrentCollection: (collectionId: string) => {
			store.commit('setCurrentCollection', collectionId)
		},
	}
}