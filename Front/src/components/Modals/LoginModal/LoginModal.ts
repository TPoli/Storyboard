import { Endpoints } from '../../../../../Core/Api/Api';
import { Network } from '../../../utils/Network';
import { IResponse } from '../../../../../Core/types/Response';
import Modal from '../Modal/Modal.vue';

export default {
name: "LoginModal",
	props: {
		'modal': Modal
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