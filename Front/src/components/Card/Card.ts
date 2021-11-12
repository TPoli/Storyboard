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
			if (this.clickedCallback) {
				this.clickedCallback(this.contentId);
			}
		},
	},
});

export default Card;