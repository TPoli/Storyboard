import { Network } from '../../utils/Network';
import LoginModal from '../Modals/LoginModal/LoginModal.vue';
import { getState, setState, StoreComponent } from '@/store';
import { setRoute } from '@/router';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs.vue';
import Silhouette from '@/branding/icons/silhouette/silhouette.vue';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import { defineComponent } from 'vue';
import { IResponse } from 'storyboard-networking';

const Page = defineComponent({
	name: 'Page',
	components: {
		'login-modal': LoginModal,
		Breadcrumbs,
		Silhouette,
		Dropdown,
	},
	props: {
		hideBreadcrumbs: {
			type: Boolean,
			default: false,
		}
	},
	setup() {
		return {
			
		};
	},
	methods: {
		navigateToLogin() {
			setRoute(this, '/login');
		},
		logout() {
			const logoutCallback = (response: IResponse) => {
				setState(this as unknown as StoreComponent).logOut();
				setRoute(this, '/login');
			};
			Network.Post('logout', {}, logoutCallback);
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
});

export default Page;