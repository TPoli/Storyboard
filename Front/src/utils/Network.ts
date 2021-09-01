import { Api, Endpoints } from '../../../Core/Api/Api';
import { Response, IAuthFailResponse } from '../../../Core/types/Response';
import { IDataResposne } from '../../../Core/types/Response';

import router from '../router';
import { store } from '../store';

const axios = require('axios');

axios.defaults.withCredentials = true;

export namespace Network {
	type networkCallback = (response: Response) => void;

	export const Get = (endpoint: Endpoints, params: object, callback: networkCallback) => {
		axios.get(`http://localhost:${Api.ServerPort}/${endpoint}`)
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

	export const Post = (endpoint: Endpoints, params: object, callback: networkCallback) => {

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
			url: `http://localhost:${Api.ServerPort}/${endpoint}`,
			data: params
		})
			.then(networkCallback)
			.catch((error: any) => {
				console.log(error);
			}); // add check to see if endpoint allows post
	};
};
