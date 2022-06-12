import { setRoute } from '@/router';
import Page from '../../components/Page/Page.vue';
import loginContent from './loginContent.vue';

import { defineComponent } from 'vue';

const LoginPage = defineComponent({
	name: 'loginPage',
	components: {
		Page: Page,
		'login-content': loginContent,
	},
	setup() {
		return {
			username: '',
			password: '',
		};
	},
	methods: {
		createAccount() {
			setRoute(this, '/createaccount');
		},
		dashboard() {
			setRoute(this, '/dashboard');
		},
	},
});

export default LoginPage;