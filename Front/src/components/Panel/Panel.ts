import { defineComponent } from 'vue';

const Panel = defineComponent({
	name: 'panel',
	props: {
		title: String,
		subHeading: String,
		description: String,
		buttonContent: String,
		buttonCallback: Function,
	},
	setup() {
		return {
			selected: null,
		};
	},
	computed: {
		hasSubHeading() {
			return !!(this as any).subHeading;
		},
	},
});

export default Panel;