import { EndpointRoutes, Api } from '../../../Core/Api/Api';
import { Response, IAuthFailResponse } from '../../../Core/types/Response';
import {Config} from '../../../Core/Config/config';

import { store } from '../store';

const axios = require('axios');

axios.defaults.withCredentials = true;

export namespace Network {
	export type Callback = (response: Response) => void;

	const createUrl = (endpoint: string, params: object = {}) => {
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

	export const Get = async (endpoint: EndpointRoutes, params: object, callback?: Callback) => {

		if (!Api.AllEndpoints[endpoint].methods.find(restMethod => restMethod === 'GET')) {
			// route doesn't support get
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
	};

	export const Post = async (endpoint: EndpointRoutes, params: object, callback?: Callback) => {

		if (!Api.AllEndpoints[endpoint].methods.find(restMethod => restMethod === 'POST')) {
			// route doesn't support post
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
	};
}
