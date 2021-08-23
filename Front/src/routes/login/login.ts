import { Network } from '../../utils/Network';
import { Endpoints } from '../../../../Core/Api/Api';
import { Response } from '../../../../Core/types/Response';

import Page from '../../components/Page/Page.vue';

export default {
	name: "login",
	components: {
		Page: Page
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

			};
			Network.Post(Endpoints.LOGIN, { un: (this as any).username, pw: (this as any).password}, loginCallback);
		}
	}
};