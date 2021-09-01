import Container from '../../components/Container.vue';

import Page from '../../components/Page/Page.vue';

export default {
	name: "dashboard",
	components: {
		Container: Container,
		'page': Page
	},
	methods: {
		createAccount() {
			(this as any).$router.push({path: '/createaccount'});
		},
		login() {
			(this as any).$router.push({path: '/login'});
		}
	}
};