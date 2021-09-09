import Container from '../../components/Container.vue';

import Page from '../../components/Page/Page.vue';

export default {
	name: "dashboard",
	components: {
		Container: Container,
		'page': Page
	},
	methods: {
		getUsersName() {
			return (this as any).$store.state.username;
		}
	}
};