import { defineComponent, ref } from 'vue';

import { getState, setState, StoreComponent } from '@/store';
import { paths, setRoute } from '@/router';
import { Network } from '@/utils/Network';

import { ICollection } from 'core';

import Page from '@/components/Page/Page.vue';
import Panel from '@/components/Panel/Panel.vue';
import Card from '@/components/Card/Card.vue';
import CreateCollectionModal from '@/components/Modals/CreateCollectionModal/createCollectionModal.vue';
import Heart from '@/branding/icons/heart/heart.vue';
import { CreateCollection, FavouriteCollection, GetCollection, GetCollections, SaveCollection } from 'storyboard-networking';

type CollectionPageData = {
	collection: ICollection | null;
	originalCollection: ICollection | null;
	createNewCollectionModalOpen: Boolean;
};

const cloneCollection = (collection: ICollection | null): ICollection | null => {
	if(!collection) {
		return null;
	}
	return {...collection,};
}

const childCollections = ref([] as ICollection[]);

const getCollectionsCallback = (response: GetCollections.Response) => {
	const collections = response.collections;

	if (collections.childCollections) {
		childCollections.value = collections.childCollections;
	}
};

const CollectionPage = defineComponent({
	name: 'collectionPage',
	components: {
		Page: Page,
		Panel: Panel,
		Card: Card,
		CreateCollectionModal: CreateCollectionModal,
		Heart: Heart,
	},
	setup(props: any, context: any) {
		Network.Post<GetCollections.Body, GetCollections.Response>('getCollections', { parentId: context.attrs?.id ?? ''}, getCollectionsCallback);

		return {
			childCollections,
		};
	},
	data: function (): CollectionPageData {
		return {
			collection: null,
			originalCollection: null,
			createNewCollectionModalOpen: false,
		};
	},
	methods: {
		valid() {
			const data = this as unknown as CollectionPageData;

			if (!data.collection) {
				return false
			}
			if (data.collection.title.length === 0) {
				return false;
			}

			return true;
		},
		modified() {
			const data = this as unknown as CollectionPageData;
			
			if (!data.collection || ! data.originalCollection) {
				return false;
			}
			if (data.collection.title != data.originalCollection.title) {
				return true;
			}

			if (data.collection.content != data.originalCollection.content) {
				return true;
			}

			return false;
		},
		save() {
			const asyncSave = async (params: any) => {
				const result = await Network.Post<SaveCollection.Body, SaveCollection.Response>('saveCollection', params, () => {});
				if (!result) {
					return;
				}

				const savedCollection = cloneCollection((this as unknown as CollectionPageData).collection);
				(this as unknown as CollectionPageData).originalCollection = savedCollection;

				if (savedCollection) {
					setState(this as unknown as StoreComponent).openCollection(savedCollection);
				}
			};

			asyncSave((this as unknown as CollectionPageData).collection ?? {});
		},
		openCreateCollectionModal(): void {
			this.createNewCollectionModalOpen = true;
		},
		closeCreateCollectionModal(): void {
			this.createNewCollectionModalOpen = false;
		},
		createCollectionCallback(response: CreateCollection.Response) {
			const newCollection = response.newCollection;
			this.childCollections.push(newCollection);
			this.createNewCollectionModalOpen = false;
		},
		openCollection(collectionId: string): void {
			const collection = this.childCollections.find(((collection) => {
				return collection.uuid === collectionId;
			}));
			if (!collection) {
				return;
			}
			setState(this as unknown as StoreComponent).openCollection(collection);
			setRoute(this, '/collection/' + collection.uuid as unknown as paths);
			Network.Post('getCollections', { parentId: collection.uuid}, getCollectionsCallback);

			this.collection = {...collection};
			this.originalCollection = {...collection};
		},
		toggleFavourite() {
			if (!this.collection) {
				return;
			}

			const favouriteCollectionCallback = (response: FavouriteCollection.Response) => {
				const favouriteResponse = (response as FavouriteCollection.Response);
				if (!this.collection || !favouriteResponse.success || favouriteResponse.collectionId !== this.collection?.uuid) {
					return; // TODO - handle issue
				}

				this.collection.favourite = favouriteResponse.favourite;
			};
			const payload: FavouriteCollection.Body = {
				uuid: this.collection.uuid,
				favourite: !this.collection.favourite,
			};

			Network.Post<FavouriteCollection.Body, FavouriteCollection.Response>('favouriteCollection', payload, favouriteCollectionCallback);
		},
		async loadCollectionBase() {
			const state = getState(this as unknown as StoreComponent);

			const collection = state.collectionCache.find(collection => collection.uuid === state.currentCollection);
			if (collection) {
				this.collection = {...collection};
				this.originalCollection = {...collection};

				return;
			}
			
			const getCollectionCallback = (response: GetCollection.Response) => {
				const loadedCollection = response.collection;

				this.collection = {...loadedCollection};
				this.originalCollection = {...loadedCollection};
				setState(this as unknown as StoreComponent).openCollection({...loadedCollection});
			};

			Network.Post<GetCollection.Body, GetCollection.Response>('getCollection', { collectionId: state.currentCollection }, getCollectionCallback);
		},
		async loadCollection() {
			const state = getState(this as unknown as StoreComponent);
			const paramsId = this.$route.params.id as string;
			if (state.currentCollection !== paramsId) {
				setState(this as unknown as StoreComponent).setCurrentCollection(paramsId);
				return;
			}
			
			this.loadCollectionBase();
		},
	},
	computed: {
		allowSave() {
			return (this as any).valid() && (this as any).modified();
		},
	},
	beforeMount(){
		this.loadCollection();
	},
	watch: {
		'$store.state.currentCollection': function() {
			this.loadCollectionBase();
		}
	  }
});

export default CollectionPage;