import { defineComponent } from 'vue';

const Modal = defineComponent({
	name: 'Modal',
	props: {
		displayHeader: {
			type: Boolean,
			default: true,
		},
        displayBody: {
			type: Boolean,
			default: true,
		},
        displayFooter: {
			type: Boolean,
			default: true,
		},
	},
	methods: {
		close() {
            (this as any).$emit('close');
        },
	},
});

export default Modal;