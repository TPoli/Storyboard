import { defineComponent, ref } from 'vue';

import { getState, setState, StoreComponent } from '@/store';
import { paths, setRoute } from '@/router';
import { Network } from '@/utils/Network';

import { Endpoints } from '@/../../Core/Api/Api';
import { ICollection } from '@/../../Core/types/Collection';
import { ICreateCollectionResponse, IGetCollectionsResponse } from '@/../../Core/types/Response';

import Page from '@/components/Page/Page.vue';
import Panel from '@/components/Panel/Panel.vue';
import Card from '@/components/Card/Card.vue';


type CollectionPageData = {
	collection: ICollection | null;
	originalCollection: ICollection | null;
};

const cloneCollection = (collection: ICollection | null): ICollection | null => {
	if(!collection) {
		return null;
	}
	return {...collection,};
}

const CollectionPage = defineComponent({
	name: 'collectionPage',
	components: {
		Page: Page,
		Panel: Panel,
		Card: Card,
	},
	setup(props: any, context: any) {
		const childCollections = ref([] as ICollection[]);

		const getCollectionsCallback: Network.Callback = (response) => {
			const collections = (response as IGetCollectionsResponse).collections;

			if (collections.childCollections) {
				childCollections.value = collections.childCollections;
			}
		};

		Network.Post(Endpoints.GET_COLLECTIONS, { parentId: context.attrs?.id ?? ''}, getCollectionsCallback);

		return {
			childCollections,
		};
	},
	data: function (): CollectionPageData {
		return {
			collection: cloneCollection(getState(this as unknown as StoreComponent).currentCollection),
			originalCollection: cloneCollection(getState(this as unknown as StoreComponent).currentCollection),
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
				const result = await Network.Post(Endpoints.SAVE_COLLECTION, params);
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
		createNewCollection(): void {
			const createCollectionCallback: Network.Callback = (response) => {
				const newCollection = (response as ICreateCollectionResponse).newCollection;
				this.childCollections.push(newCollection);
			};
			Network.Post(Endpoints.CREATE_COLLECTION, {
				parentId: this.collection?.uuid,
			}, createCollectionCallback);
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
		},
	},
	computed: {
		allowSave() {
			return (this as any).valid() && (this as any).modified();
		},
	},
});

export default CollectionPage;