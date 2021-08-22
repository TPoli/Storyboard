import { Api, Endpoints } from '../../../Core/Api/Api'

const axios = require('axios');

axios.defaults.withCredentials = true;
export namespace Network {
	export const Get = (endpoint: Endpoints, params: object) => {
		axios.get(`http://localhost:${Api.ServerPort}/${endpoint}`)
			.then((response: any) => {
				console.log(response.data.url);
				console.log(response.data.explanation);
			})
			.catch((error: any) => {
				console.log(error);
			});
	};

	export const Post = (endpoint: Endpoints, params: object) => {
		axios({
			method: 'post',
			url: `http://localhost:${Api.ServerPort}/${endpoint}`,
			data: params
		})
			.then((response: any) => {
				// console.log(response.data.url);
				// console.log(response.data.explanation);
			})
			.catch((error: any) => {
				console.log(error);
			});
	};
};
