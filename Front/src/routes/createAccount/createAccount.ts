import { Network } from '../../utils/Network';
import { Endpoints } from '../../../../Core/Api/Api';
import { Response, ILoginResponse } from '../../../../Core/types/Response';

import Page from '../../components/Page/Page.vue';
import RequiredInput from '../../components/Forms/RequiredInput/RequiredInput.vue';
import { setState, StoreComponent } from '@/store';
import { setRoute } from '@/router';

export default {
	name: 'createAccount',
	components: {
		Page: Page,
		RequiredInput: RequiredInput,
	},
	data: () => ({
		username: '',
		password: '',
		email: null,
		mobile: null,
		errors: {},
	}),
	methods: {
		createAccount() {
			if (!this.validate()) {
				return;
			}
			const accountCreatedCallback = (response: Response): void => {
				setState(this as unknown as StoreComponent).login((response as ILoginResponse).username);
				setRoute(this, '/dashboard');
			};
			const params = {
				un: (this as any).username,
				pw: (this as any).password,
				email: (this as any).email,
				mobile: (this as any).mobile,
			};
			Network.Post(Endpoints.CREATE_ACCOUNT, params, accountCreatedCallback);
		},
		validate() {
			// check validation
			const username = (this as any).username ? '' : 'Username is required';
			console.log('username:', (this as any).username);

			// save results
			(this as any).errors = {
				username,
			};

			// return result (should all be falsey)
			return !username;
		},
	},
};