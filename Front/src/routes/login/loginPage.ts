import Page from '../../components/Page/Page.vue';
import loginContent from './loginContent.vue';

export default {
	name: 'loginPage',
	components: {
		Page: Page,
		'login-content': loginContent,
	},
	data: function () {
		return {
			username: '',
			password: '',
		};
	},
	methods: {
		createAccount() {
			(this as any).$router.push({path: '/createaccount',});
		},
		dashboard() {
			(this as any).$router.push({path: '/dashboard',});
		},
	},
};