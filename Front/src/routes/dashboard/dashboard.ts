import Container from '../../components/Container.vue';
import Collection from '../../components/Collection/Collection.vue';

import Page from '../../components/Page/Page.vue';

export default {
	name: "dashboard",
	components: {
		Container: Container,
		Collection: Collection,
		'page': Page
	},
	methods: {
		getUsersName() {
			return (this as any).$store.state.username;
		}
	}
};