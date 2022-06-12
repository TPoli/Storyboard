import Modal from '../Modal/Modal.vue';
import BaseForm from '@/components/Forms/BaseForm/BaseForm.vue';

import TextInput from '@/components/Forms/TextInput/TextInput.vue';

import { defineComponent } from 'vue';

const FormModal = defineComponent({
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
	setup() {

	},
	methods: {
		onClose() {
			(this as any).handleClose();
		},
	},
});

export default FormModal;