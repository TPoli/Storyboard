import { defineComponent } from 'vue';
import { supportedIconColours } from '..';

const Home = defineComponent({
	name: 'home',
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

export default Home;
