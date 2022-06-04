import { GenericObject } from 'core';
import { defineComponent } from 'vue';

interface IIndexable {
	[key: string]: any;
}

type RegisteredInput = {
	fieldName: String;
	value: () => string | number | boolean;
	validate: () => boolean;
};

const BaseForm = defineComponent({
	name: 'baseForm',
	props: {
		onSubmit: {
			type: Function,
			required: true,
		},
	},
	setup() {
		const registeredInputs: RegisteredInput[] = [];

		return {
			registeredInputs,
		};
	},
	methods: {
		register({fieldName, value, validate}: RegisteredInput) {
			this.registeredInputs.push({
				fieldName,
				value,
				validate,
			});
		},
		FormSubmit() {
			const isValid = this.registeredInputs.every(registered => registered.validate());

			if(!isValid) {
				return;
			}

			const data: GenericObject = {};

			this.registeredInputs.map(registered => {
				(data as IIndexable)[registered.fieldName as string] = registered.value();
			});

			this.onSubmit(data);
		},
	},
});

export default BaseForm;
