import { defineComponent } from 'vue';
import { supportedIconColours } from '..';

const Bookmark = defineComponent({
	name: 'Bookmark',
	props: {
		colour: {
			type: String,
			default: 'black',
			validator(value: string) {
				return supportedIconColours.includes(value);
			}
		},
	},
});

export default Bookmark;
