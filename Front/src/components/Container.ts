import { Endpoints, IResponse } from 'core';
import { Network } from '../utils/Network';

export default {
name: 'Container',
	props: {
		msg: String,
	},
	methods: {
		login() {
			const loginCallback = (response: IResponse) => {

			};
			Network.Post(Endpoints.LOGIN, {un: 'bob', pw: 'bob',}, loginCallback);
		},
	},
};
