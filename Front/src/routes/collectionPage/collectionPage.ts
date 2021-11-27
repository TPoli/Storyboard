import { getState, setState } from '@/store';
import { Network } from '@/utils/Network';
import { Endpoints } from '../../../../Core/Api/Api';
import { ICollection } from '../../../../Core/types/Collection';
import Page from '../../components/Page/Page.vue';

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

export default {
	name: 'collectionPage',
	components: {
		Page: Page,
	},
	data: function (): CollectionPageData {
		return {
			collection: cloneCollection(getState(this).currentCollection),
			originalCollection: cloneCollection(getState(this).currentCollection),
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
					setState(this).openCollection(savedCollection);
				}
			};

			asyncSave((this as unknown as CollectionPageData).collection ?? {});
		},
	},
	computed: {
		allowSave() {
			return (this as any).valid() && (this as any).modified();
		},
	},
};