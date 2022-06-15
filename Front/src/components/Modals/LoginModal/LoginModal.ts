import Modal from '../Modal/Modal.vue';

import loginContent from '../../../routes/login/loginContent.vue';

import { defineComponent } from 'vue';

const LoginModal = defineComponent({
	name: 'LoginModal',
	components: {
		'modal': Modal,
		'login-content': loginContent,
	},
	methods: {
		
	},
});

export default LoginModal;