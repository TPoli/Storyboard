import { Endpoints, IResponse } from 'core';
import { Network } from '../../../utils/Network';
import Modal from '../Modal/Modal.vue';

import loginContent from '../../../routes/login/loginContent.vue';

export default {
name: 'LoginModal',
	components: {
		'modal': Modal,
		'login-content': loginContent,
	},
	methods: {
		login() {
			const loginCallback = (response: IResponse) => {
        		// pass error to modal or close the modal
			};
			Network.Post(Endpoints.LOGIN, {un: 'bob', pw: 'bob',}, loginCallback);
		},
	},
};