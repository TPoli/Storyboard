import Container from '../../components/Container.vue';
import Collection from '../../components/Collection/Collection.vue';
import Card from '../../components/Card/Card.vue';
import Panel from '../../components/Panel/Panel.vue';

import Page from '../../components/Page/Page.vue';

export default {
	name: 'dashboard',
	components: {
		Container: Container,
		Collection: Collection,
		'card': Card,
		'page': Page,
		'panel': Panel,
	},
	methods: {
		getUsersName(): string {
			return (this as any).$store.state.username;
		},
		createNewCollection(): void {
			console.log('createNewCollection');
		},
	},
	computed: {
		// 3 most recently modified collections (can be low level collections)
		recentlyModified(): any[] {
			return [
				{
					title: 'C1',
					content: 'c1',
				}, {
					title: 'C2',
					content: 'c2',
				}, {
					title: 'C3',
					content: 'c3',
				},
			];
		},
		favourites(): any[] {
			return [
				{
					title: 'C1',
					content: 'c1',
				},
			];
		},
		// list of all top level collections owned by user
		myCollections(): any[] {
			return [
				{
					title: 'C1',
					content: 'c1',
				},
			];
		},
		// list of all top level collections shared with user
		availableCollections(): any[] {
			return [
				{
					title: 'C1',
					content: 'c1',
				},
			];
		},
	},
};