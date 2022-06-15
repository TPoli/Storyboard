import FormModal from '@/components/Modals/FormModal/FormModal.vue';

import { Network } from '@/utils/Network';

import { defineComponent } from 'vue';

const CreateCollectionModal = defineComponent({
	name: 'CreateCollectionModal',
	components: {
		FormModal: FormModal,
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
	setup() {
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
	methods: {
		createNewCollection(formData: any): void {
			Network.Post('createCollection', {
				parentId: (this as any).parentId,
				name: formData.Title,
				description: formData.Description,
			}, (this as any).createCollectionCallback);
		},
	},
});

export default CreateCollectionModal;