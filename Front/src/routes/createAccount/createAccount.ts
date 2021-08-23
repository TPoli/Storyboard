import { Network } from '../../utils/Network';
import { Endpoints } from '../../../../Core/Api/Api';
import { Response } from '../../../../Core/types/Response';

import Page from '../../components/Page/Page.vue';

export default {
	name: "createAccount",
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
		login() {
			(this as any).$router.push({path: '/login'});
		},
		createAccount() {
			const accountCreatedCallback = (response: Response): void => {

			};
			Network.Post(Endpoints.CREATE_ACCOUNT, { un: (this as any).username, pw: (this as any).password}, accountCreatedCallback);
		}
	}
};