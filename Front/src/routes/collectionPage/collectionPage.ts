import { getState } from '@/store';
import Page from '../../components/Page/Page.vue';

export default {
	name: 'collectionPage',
	components: {
		Page: Page,
	},
	data: function () {
		return {
			collection: getState(this).currentCollection,
		};
	},
	methods: {

	},
	computed: {
		
	},
};