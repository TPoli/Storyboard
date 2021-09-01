import { Entity } from '../../../../Core/types/Entity';
import { Endpoints } from '../../../../Core/Api/Api';
import { Network } from '../../utils/Network';
import { IResponse } from '../../../../Core/types/Response';
import Modal from '../Modals/Modal/Modal.vue';


export default {
name: "Page",
	components: {
		'Modal': Modal
	},
	data: function () {
		return {
			showLoginModal: true
		};
	},
	props: {
		
	},
	methods: {
		test() {
			const entity = new Entity('Location');
			entity.move(7);
			Network.Post(Endpoints.TEST, {}, (response: IResponse) => {
				
			});
			return 'test';
		},
		login() {
			const loginCallback = (response: IResponse) => {

			};
			Network.Post(Endpoints.LOGIN, {un: 'bob', pw: 'bob'}, loginCallback);
		},
		closeModal() {
			(this as any).showLoginModal = false;
		}
	}
};