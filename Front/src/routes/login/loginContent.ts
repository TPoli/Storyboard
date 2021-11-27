import { Network } from '../../utils/Network';
import { Endpoints } from '../../../../Core/Api/Api';
import { ILoginResponse, Response } from '../../../../Core/types/Response';
import { getState, setState, StoreComponent } from '@/store';
import { setRoute } from '@/router';

export default {
	name: 'loginContent',
	components: {
		
	},
	data: function () {
		return {
			username: getState(this as unknown as StoreComponent).username,
			password: '',
		};
	},
	methods: {
		login() {
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
	},
};