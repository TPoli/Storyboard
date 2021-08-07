import { Entity } from '../../../Core/types/Entity';
import { Network } from '../utils/Network'

export default {
name: "Container",
	props: {
		msg: String,
	},
	methods: {
		test() {
			const entity = new Entity('Location');
			entity.move(7);
			Network.Post('test', {});
			return 'test';
		}
	}
};