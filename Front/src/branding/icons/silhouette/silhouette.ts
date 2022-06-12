import { defineComponent } from 'vue';
import { supportedIconColours } from '..';

const Silhouette = defineComponent({
	name: 'Silhouette',
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

export default Silhouette;
