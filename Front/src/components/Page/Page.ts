import { Entity } from '../../../../Core/types/Entity';
import { Endpoints } from '../../../../Core/Api/Api';
import { Network } from '../../utils/Network';
import { IResponse } from '../../../../Core/types/Response';
import LoginModal from '../Modals/LoginModal/LoginModal.vue';


export default {
name: "Page",
	components: {
		'login-modal': LoginModal
	},
	data: function () {
		return {
			
		};
	},
	props: {
		
	},
	methods: {
		navigateToLogin() {
			(this as any).$router.push({path: '/login'});
		},
		test() {
			const entity = new Entity('Location');
			entity.move(7);
			Network.Post(Endpoints.TEST, {}, (response: IResponse) => {
				
			});
			return 'test';
		},
		login() {
			const loginCallback = (response: IResponse) => {

			};
			Network.Post(Endpoints.LOGIN, {un: 'bob', pw: 'bob'}, loginCallback);
		},
		logout() {
			const logoutCallback = (response: IResponse) => {
				(this as any).$store.commit('logOut');
				(this as any).$router.push({path: '/login'});
			};
			Network.Post(Endpoints.LOGOUT, {}, logoutCallback);
		},
		loggedIn() {
			return (this as any).$store.state.loggedIn;
		},
		shouldDisplayLogin() {
			if ((this as any).loggedIn()) {
				return false;
			}
			const route = (this as any).$route.fullPath;

			return route !== '/login' && route !== '/createaccount' && route !== '/';
		},
		isActiveRoute(route: string): boolean {
			return route === (this as any).$route.fullPath;
		}
	}
};