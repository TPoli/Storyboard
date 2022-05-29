import FormModal from '@/components/Modals/FormModal/FormModal.vue';

import { Network } from '@/utils/Network';
import { Endpoints } from '../../../../../Core/Api/Api';

export default {
name: 'CreateCollectionModal',
	components: {
		FormModal: FormModal,
	},
	data: function (): any {
		return {
			formFields: [
				{
					name: 'Title',
					type: 'text',
				}, {
					name: 'Description',
					type: 'text',
				},
			],
		};
	},
	props: {
		onClose: {
			type: Function,
			required: true,
		},
		createCollectionCallback: {
			type: Function,
			required: true,
		},
		parentId: {
			type: String,
		},
	},
	methods: {
		createNewCollection(formData: any): void {
			Network.Post(Endpoints.CREATE_COLLECTION, {
				parentId: (this as any).parentId,
				name: formData.Title,
				description: formData.Description,
			}, (this as any).createCollectionCallback);
		},
	},
};