import { Endpoints } from '../../../../../Core/Api/Api';
import { Network } from '../../../utils/Network';
import { IResponse } from '../../../../../Core/types/Response';
import Modal from '../Modal/Modal.vue';

import loginContent from '../../../routes/login/loginContent.vue';

export default {
name: "LoginModal",
	components: {
		'modal': Modal,
		'login-content': loginContent
	},
	methods: {
		login() {
			const loginCallback = (response: IResponse) => {
        		// pass error to modal or close the modal
			};
			Network.Post(Endpoints.LOGIN, {un: 'bob', pw: 'bob'}, loginCallback);
		},
		closeModal() {
			// this.$emit('closeModal');
		}
	}
};