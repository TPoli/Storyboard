export default {
	props: {
		modelValue: {
			type: String,
			required: true
		},
		placeholder: {
			type: String,
			required: false
		},
		label: {
			type: String,
			required: false
		},
		error: {
			type: String,
			required: false
		},
	},
	emits: ['update:modelValue'],
	computed: {
		model: {
			get(): string {
				return (this as any).modelValue;
			},
			set(value: string) {
				(this as any).$emit('update:modelValue', value);
			},
		},
	},
}
