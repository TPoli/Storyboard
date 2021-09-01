import { Network } from '../../utils/Network';
import { Endpoints } from '../../../../Core/Api/Api';
import { Response } from '../../../../Core/types/Response';

import Page from '../../components/Page/Page.vue';
import loginContent from './loginContent.vue';

export default {
	name: "loginPage",
	components: {
		Page: Page,
		'login-content': loginContent
	},
	data: function () {
		return {
			username: '',
			password: ''
		};
	},
	methods: {
		createAccount() {
			(this as any).$router.push({path: '/createaccount'});
		},
		dashboard() {
			(this as any).$router.push({path: '/dashboard'});
		},
		login() {
			const loginCallback = (response: Response): void => {
				(this as any).$store.commit('login', 'usernameHere')
			};
			Network.Post(Endpoints.LOGIN, { un: (this as any).username, pw: (this as any).password}, loginCallback);
		}
	}
};