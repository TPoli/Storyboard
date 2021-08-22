import { Entity } from '../../../Core/types/Entity';
import { Endpoints } from '../../../Core/Api/Api';
import { Network } from '../utils/Network';

export default {
name: "Container",
	props: {
		msg: String,
	},
	methods: {
		test() {
			const entity = new Entity('Location');
			entity.move(7);
			Network.Post(Endpoints.TEST, {});
			return 'test';
		},
		login() {
			Network.Post(Endpoints.LOGIN, {un: 'bob', pw: 'bob'});
		}
	}
};