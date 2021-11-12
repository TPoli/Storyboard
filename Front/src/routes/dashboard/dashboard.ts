import Container from '../../components/Container.vue';
import Collection from '../../components/Collection/Collection.vue';
import Card from '../../components/Card/Card.vue';
import Panel from '../../components/Panel/Panel.vue';

import Page from '../../components/Page/Page.vue';

import { defineComponent, ref } from 'vue';
import { Network } from '@/utils/Network';
import { Endpoints } from '../../../../Core/Api/Api';
import { ICollection } from '../../../../Core/types/Collection';
import { ICreateCollectionResponse, IGetCollectionsResponse } from '../../../../Core/types/Response';
import { getState, setState } from '@/store';

const Dashboard = defineComponent({
	name: 'dashboard',
	components: {
		Container,
	  	Collection,
		Card,
		Page,
		Panel,
	},
	setup(props: any, context: any) {
		// 3 most recently modified collections (can be low level collections)
		const recentlyModified = ref([] as ICollection[]);

		// list of all top level collections owned by user
		const myCollections = ref([] as ICollection[]);

		// list of all top level collections shared with user
		const availableCollections = ref([] as ICollection[]);

		const favourites = ref([] as ICollection[]);

		const getCollectionsCallback: Network.Callback = (response) => {
			const collections = (response as IGetCollectionsResponse).collections;

			if (collections.recentlyModified) {
				recentlyModified.value = collections.recentlyModified;
			}
			if (collections.myCollections) {
				myCollections.value = collections.myCollections;
			}
			if (collections.availableCollections) {
				availableCollections.value = collections.availableCollections;
			}
			if (collections.favourites) {
				favourites.value = collections.favourites;
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
			favourites,
			myCollections,
			availableCollections,
		};
	},
	methods: {
		getUsersName(): string {
			return getState(this).username;
		},
		createNewCollection(): void {
			const createCollectionCallback: Network.Callback = (response) => {
				const newCollection = (response as ICreateCollectionResponse).newCollection;
				this.myCollections.push(newCollection);
			};
			Network.Post(Endpoints.CREATE_COLLECTION, {}, createCollectionCallback);
		},
		openCollection(collectionId: string): void {
			const collection = [
				...this.myCollections,
				...this.recentlyModified,
				...this.favourites,
				...this.availableCollections,
			].find(((collection) => {
				return collection.uuid === collectionId;
			}));
			if (!collection) {
				return;
			}
			setState(this).openCollection(collection);
			(this as any).$router.push({path: '/collection',});
		},
	},
});

export default Dashboard;