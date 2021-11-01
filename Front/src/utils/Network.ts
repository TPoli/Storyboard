import { EndpointRoutes } from '../../../Core/Api/Api';
import { Response, IAuthFailResponse } from '../../../Core/types/Response';
import { IDataResposne } from '../../../Core/types/Response';
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

	export const Get = (endpoint: EndpointRoutes, params: object, callback: Callback) => {
		axios.get(createUrl(endpoint, params))
			.then((response: IDataResposne) => {
				console.log((response.data as any).url);
				console.log((response.data as any).explanation);
				if (!response.data.success && (response.data as IAuthFailResponse).message === 'authentication failed') {
					// router.push({path: '/login'});
					return;
				}
				callback(response.data);
			})
			.catch((error: any) => {
				console.log(error);
			}); // add check to see if endpoint allows get
	};

	export const Post = (endpoint: EndpointRoutes, params: object, callback: Callback) => {

		const networkCallback = (response: IDataResposne) => {
			if (!response.data.success) {
				if ((response.data as IAuthFailResponse).message === 'authentication failed') {
					store.commit('logOut');
				}
				return;
			}
			callback(response.data);
		};

		axios({
			method: 'post',
			url: createUrl(endpoint),
			data: params,
		})
			.then(networkCallback)
			.catch((error: any) => {
				console.log(error);
			}); // add check to see if endpoint allows post
	};
}
