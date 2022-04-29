import { Network } from '../../utils/Network';
import { Endpoints } from '../../../../Core/Api/Api';
import { ILoginResponse, Response } from '../../../../Core/types/Response';
import { getState, setState, StoreComponent } from '@/store';
import { setRoute } from '@/router';
import TextInput from '@/components/Forms/TextInput/TextInput';

export default {
	name: 'loginContent',
	components: {
		TextInput: TextInput,
	},
	data: function () {
		return {
			username: getState(this as unknown as StoreComponent).username,
			password: '',
			errors: {},
		};
	},
	methods: {
		login() {
			if (!this.validate()) {
				return;
			}
			const loginCallback = (response: Response): void => {
				setState(this as unknown as StoreComponent).login((response as ILoginResponse).username);

				const fullPath = (this as any).$route.fullPath;
				if (fullPath === '/login' || fullPath === '/')
				{
					setRoute(this, '/dashboard');
				}
			
			};
			Network.Post(Endpoints.LOGIN, { un: (this as any).username, pw: (this as any).password,}, loginCallback);
		},
		validate() {
			// check validation
			const username = (this as any).username ? '' : 'Username is required';
			const password = (this as any).password ? '' : 'Password is required';

			// save results
			(this as any).errors = {
				username,
				password,
			};

			// return result (should all be falsey)
			return !username && !password;
		},
	},
};