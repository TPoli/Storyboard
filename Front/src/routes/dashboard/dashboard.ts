import Card from '../../components/Card/Card.vue';
import Panel from '../../components/Panel/Panel.vue';

import Page from '../../components/Page/Page.vue';

import { defineComponent, ref } from 'vue';
import { Network } from '@/utils/Network';
import { ICollection } from 'core';
import { getState, setState, StoreComponent } from '@/store';
import { paths, setRoute } from '@/router';
import CreateCollectionModal from '@/components/Modals/CreateCollectionModal/createCollectionModal.vue';
import { CreateCollection, GetCollections } from 'storyboard-networking';

const Dashboard = defineComponent({
	name: 'dashboard',
	components: {
		Card,
		Page,
		Panel,
		CreateCollectionModal,
	},
	setup(props: any, context: any) {
		// 3 most recently modified collections (can be low level collections)
		const recentlyModified = ref([] as ICollection[]);

		// list of all top level collections owned by user
		const myCollections = ref([] as ICollection[]);

		// list of all top level collections shared with user
		const availableCollections = ref([] as ICollection[]);

		const favourites = ref([] as ICollection[]);

		const getCollectionsCallback = (response: GetCollections.Response) => {
			const collections = response.collections;

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

		const collections = [
			'recentlyModified',
			'myCollections',
			'favourites',
			'availableCollections',
		];

		Network.Post<GetCollections.Body, GetCollections.Response>('getCollections', {
			collections,			
		}, getCollectionsCallback);

		return {
			recentlyModified,
			favourites,
			myCollections,
			availableCollections,
			createNewCollectionModalOpen: ref(false),
		};
	},
	methods: {
		getUsersName(): string {
			return getState(this as unknown as StoreComponent).username;
		},
		createCollectionCallback(response: CreateCollection.Response) {
			const newCollection = response.newCollection;
			this.myCollections.push(newCollection);
			this.createNewCollectionModalOpen = false;
		},
		openCreateCollectionModal(): void {
			this.createNewCollectionModalOpen = true;
		},
		closeCreateCollectionModal(): void {
			console.log('closeCreateCollectionModal')
			this.createNewCollectionModalOpen = false;
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

			setState(this as unknown as StoreComponent).openCollection(collection);
			setRoute(this, '/collection/' + collectionId  as unknown as paths);
		},
	},
});

export default Dashboard;