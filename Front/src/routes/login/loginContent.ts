import { Network } from '../../utils/Network';
import { Endpoints } from '../../../../Core/Api/Api';
import { Response } from '../../../../Core/types/Response';

export default {
	name: "loginContent",
	components: {
		
	},
	data: function () {
		return {
			username: '',
			password: ''
		};
	},
	methods: {
		login() {
			const loginCallback = (response: Response): void => {

			};
			Network.Post(Endpoints.LOGIN, { un: (this as any).username, pw: (this as any).password}, loginCallback);
		}
	}
};