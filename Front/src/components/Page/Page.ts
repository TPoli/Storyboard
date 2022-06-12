import { Entity, Endpoints, IResponse } from 'core';
import { Network } from '../../utils/Network';
import LoginModal from '../Modals/LoginModal/LoginModal.vue';
import { getState, setState, StoreComponent } from '@/store';
import { setRoute } from '@/router';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs.vue';

export default {
name: 'Page',
	components: {
		'login-modal': LoginModal,
		Breadcrumbs,
	},
	data: function () {
		return {
			
		};
	},
	props: {
		hideBreadcrumbs: {
			type: Boolean,
			default: false,
		}
	},
	methods: {
		navigateToLogin() {
			setRoute(this, '/login');
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
			Network.Post(Endpoints.LOGIN, {un: 'bob', pw: 'bob',}, loginCallback);
		},
		logout() {
			const logoutCallback = (response: IResponse) => {
				setState(this as unknown as StoreComponent).logOut();
				setRoute(this, '/login');
			};
			Network.Post(Endpoints.LOGOUT, {}, logoutCallback);
		},
		loggedIn() {
			return getState(this as unknown as StoreComponent).loggedIn;
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
		},
	},
};