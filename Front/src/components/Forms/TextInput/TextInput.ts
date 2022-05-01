import { defineComponent, ref } from 'vue';

const TextInput = defineComponent({
	name: 'TextInput',
	props: {
		default: {
			type: String,
			required: false,
		},
		placeholder: {
			type: String,
			required: false
		},
		label: {
			type: String,
			required: false
		},
		name: {
			type: String,
			required: true,
		},
		register: {
			type: Function,
			required: false,
		},
		required: {
			type: String,
			required: false,
		},
		validation: {
			type: Array,
			required: false,
		},
	},
	setup() {
		const errors = ref([] as string[]);
		const value = ref('');

		return {
			errors,
			value,
		};
	},
	methods: {
		getValue() {
			return this.value;
		},
		validate() {
			this.errors = [];
			if (!!this.required && !this.value) {
				this.errors.push(this.required!);
			}

			if(this.validation) {
				const validationResults = (this.validation as Function[]).map(validator => {
					return validator(this.value);
				}).filter(value => !! value);

				this.errors = this.errors.concat(validationResults);
			}

			return this.errors.length === 0;
		},
	},
	mounted() {
		this.value = this.default ?? '';
		(this as any).register({
			fieldName: (this as any).name,
			value: (this as any).getValue,
			validate: (this as any).validate,
		});
	},
});

export default TextInput;
