import { defineComponent } from 'vue';

const tooltipSides = ['top', 'left', 'right', 'bottom'];

const Tooltip = defineComponent({
	name: 'tooltip',
	props: {
		tooltipSide: {
			type: String,
			required: true,
			validator(value: string) {
				return tooltipSides.includes(value)
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
		tooltipClass() {
			return `tooltip-content-${(this as any).tooltipSide}`;
		},
	}
});

export {
	Tooltip,
	tooltipSides,
}
