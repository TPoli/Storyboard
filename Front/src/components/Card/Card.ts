import { defineComponent } from 'vue';

const Card = defineComponent({
	name: 'card',
	props: {
		contentId: String,
		title: String,
		content: String,
		clickedCallback: Function,
	},
	methods: {
		clicked() {
			console.log(this.contentId)
			if (this.clickedCallback) {
				this.clickedCallback(this.contentId);
			}
		},
	},
});

export default Card;