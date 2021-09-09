import { Network } from '../../utils/Network';
import { Endpoints } from '../../../../Core/Api/Api';
import { ILoginResponse, Response } from '../../../../Core/types/Response';

export default {
	name: "loginContent",
	components: {
		
	},
	data: function () {
		return {
			username: (this as any).$store.state.username,
			password: ''
		};
	},
	methods: {
		login() {
			const loginCallback = (response: Response): void => {
				(this as any).$store.commit('login', (response as ILoginResponse).username);

				if((this as any).$route.fullPath === '/login')
				{
					(this as any).$router.push({path: '/dashboard'});
				}
			
			};
			Network.Post(Endpoints.LOGIN, { un: (this as any).username, pw: (this as any).password}, loginCallback);
		}
	}
};