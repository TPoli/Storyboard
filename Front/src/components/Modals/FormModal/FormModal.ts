import Modal from '../Modal/Modal.vue';
import BaseForm from '@/components/Forms/BaseForm/BaseForm.vue';

import TextInput from '@/components/Forms/TextInput/TextInput.vue';

export default {
name: 'FormModal',
	components: {
		'modal': Modal,
		TextInput: TextInput,
		BaseForm: BaseForm,
	},
	props: {
		title: {
			type: String,
			required: true,
		},
		handleClose: {
			type: Function,
			required: true,
		},
		onSubmit: {
			type: Function,
			required: true,
		},
		submitLabel: {
			type: String,
			default: 'Submit',
		},
		formFields: {
			type: Array,
			required: true,
		},
	},
	methods: {
		onClose() {
			(this as any).handleClose();
		},
	},
};