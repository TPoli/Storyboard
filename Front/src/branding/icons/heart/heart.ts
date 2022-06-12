import { defineComponent } from 'vue';

import Tooltip from '@/components/tooltip/tooltip.vue';
import { tooltipSides } from '@/components/tooltip/tooltip';
import { supportedIconColours } from '..';

const Heart = defineComponent({
	name: 'heart',
	components: {
		Tooltip: Tooltip,
	},
	props: {
		onClick: {
			type: Function,
			required: true,
		},
		tooltipSide: {
			type: String,
			required: true,
			validator(value: string) {
				return tooltipSides.includes(value)
			}
		},
		colour: {
			type: String,
			required: true,
			validator(value: string) {
				return supportedIconColours.includes(value)
			}
		},
		tooltip: {
			type: String,
			required: true,
		},
	},
	setup() {

	},
	methods: {
		
	},
	computed: {
		
	}
});

export default Heart;
