
export default {
name: 'panel',
	props: {
		title: String,
		subHeading: String,
		description: String,
		buttonContent: String,
		buttonCallback: () => {},
	},
	data: function () {
		return {
			selected: null,
		};
	},
	methods: {
		
	},
	computed: {
		hasSubHeading() {
			return !!(this as any).subHeading;
		},
	},
};