
export default {
name: 'Card',
	props: {
		title: String,
		content: String,
	},
	methods: {
		clicked() {
			console.log('clicked');
			//  this.$emit("name", data);
		},
	},
};