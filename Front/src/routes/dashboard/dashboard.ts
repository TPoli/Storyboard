import Container from '../../components/Container.vue';
import Collection from '../../components/Collection/Collection.vue';
import Card from '../../components/Card/Card.vue';
import Panel from '../../components/Panel/Panel.vue';

import Page from '../../components/Page/Page.vue';

import { defineComponent, ref } from 'vue';
import { Network } from '@/utils/Network';
import { Endpoints } from '../../../../Core/Api/Api';
import { ICollection } from '../../../../Core/types/Collection';
import { IGetCollectionsResponse } from '../../../../Core/types/Response';

interface DashboardData {
	myCollections: ICollection[],
	favourites: ICollection[],
	availableCollections: ICollection[],
}

const Dashboard = defineComponent({
	name: 'dashboard',
	components: {
		Container,
	  	Collection,
		Card,
		Page,
		Panel,
	},
	data(): DashboardData {
		return {
			// list of all top level collections owned by user
			myCollections: [],
			favourites: [],

			// list of all top level collections shared with user
			availableCollections: [],
		};
	},
	setup(props: any, context: any) {
		// 3 most recently modified collections (can be low level collections)
		const recentlyModified = ref([] as ICollection[]);

		const getCollectionsCallback: Network.Callback = (response) => {
			const collections = (response as IGetCollectionsResponse).collections;

			if (collections.recentlyModified) {
				recentlyModified.value = collections.recentlyModified;
			}
		};

		Network.Post(Endpoints.GET_COLLECTIONS, { collections: [
			'recentlyModified',
			'myCollections',
			'favourites',
			'availableCollections',
		],}, getCollectionsCallback);

		return {
			recentlyModified,
		};
	},
	methods: {
		getUsersName(): string {
			return (this as any).$store.state.username;
		},
		createNewCollection(): void {
			
		},
	},
});

export default Dashboard;