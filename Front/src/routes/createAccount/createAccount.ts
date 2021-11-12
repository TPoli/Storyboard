import { Network } from '../../utils/Network';
import { Endpoints } from '../../../../Core/Api/Api';
import { Response, ILoginResponse } from '../../../../Core/types/Response';

import Page from '../../components/Page/Page.vue';
import { setState } from '@/store';

export default {
	name: 'createAccount',
	components: {
		Page: Page,
	},
	data: function () {
		return {
			username: '',
			password: '',
			email: null,
			mobile: null,
		};
	},
	methods: {
		createAccount() {
			const accountCreatedCallback = (response: Response): void => {
				setState(this).login((response as ILoginResponse).username);
				(this as any).$router.push({path: '/dashboard',});
			};
			const params = {
				un: (this as any).username,
				pw: (this as any).password,
				email: (this as any).email,
				mobile: (this as any).mobile,
			};
			Network.Post(Endpoints.CREATE_ACCOUNT, params, accountCreatedCallback);
		},
	},
};