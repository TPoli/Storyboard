import { Config } from 'core';
import { AllRoutePayloads, AllRoutes, IAuthFailResponse, RouteNames } from 'storyboard-networking';

import { store } from '../store';

const axios = require('axios');

axios.defaults.withCredentials = true;

export namespace Network {

	const createUrl = (endpoint: RouteNames, params: AllRoutePayloads = {}) => {
		let url = `${Config.connectionProtocal}://${Config.serverUrl}:${Config.serverPort}/${endpoint}`;
		if (params) {
			let first = true;
			Object.entries(params).forEach(([key, value,]) => {
				if (first) {
					url += '?';
				} else {
					url += '&';
				}
				first = false;
				url += `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
			});
		}
		return url;
	};

	export async function Get<BodyType extends AllRoutePayloads, ResponseType>(endpoint: RouteNames, params: BodyType, callback?: (response: ResponseType) => void): Promise<boolean> {
		const route = AllRoutes.find((r) => r.path === endpoint);
		if (!route || !route.methods.includes('GET')) {
			return false;
		}

		try {
			const response = axios.get(createUrl(endpoint, params));

			if (!response.data.success) {
				if ((response.data as IAuthFailResponse).message === 'authentication failed') {
					store.commit('logOut');
				}
				return false;
			}

			if (callback) {
				callback(response.data);
			}

			return response.data;
		} catch (error) {
			console.log(JSON.stringify(error));

			return false;
		}
	}

	export async function Post<BodyType extends AllRoutePayloads, ResponseType> (endpoint: RouteNames, params: BodyType, callback: (response: ResponseType) => void): Promise<boolean> {
		const route = AllRoutes.find((r) => r.path === endpoint);
		if (!route || !route.methods.includes('POST')) {
			return false;
		}
		try {
			const response = await axios({
				method: 'post',
				url: createUrl(endpoint),
				data: params,
			});

			if (!response.data.success) {
				if ((response.data as IAuthFailResponse).message === 'authentication failed') {
					store.commit('logOut');
				}
				return false;
			}

			if (callback) {
				callback(response.data);
			}

			return response.data;
		} catch (error) {
			console.log(JSON.stringify(error));

			return false;
		}
	}
}
