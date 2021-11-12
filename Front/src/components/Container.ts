import { Entity } from '../../../Core/types/Entity';
import { Endpoints } from '../../../Core/Api/Api';
import { Network } from '../utils/Network';
import { IResponse } from '../../../Core/types/Response';


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