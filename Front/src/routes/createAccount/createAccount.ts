import { Network } from '../../utils/Network';

import Page from '../../components/Page/Page.vue';
import TextInput from '../../components/Forms/TextInput/TextInput.vue';
import BaseForm from '@/components/Forms/BaseForm/BaseForm.vue';
import { setState, StoreComponent } from '@/store';
import { setRoute } from '@/router';
import { CreateAccount } from 'storyboard-networking';

export default {
	name: 'createAccount',
	components: {
		Page: Page,
		TextInput: TextInput,
		BaseForm: BaseForm,
	},
	data: () => ({

	}),
	methods: {
		createAccount(params: { username: string, password: string, email: string, mobile: string}) {
			const accountCreatedCallback = (response: CreateAccount.Response): void => {
				setState(this as unknown as StoreComponent).login(response.username);
				setRoute(this, '/dashboard');
			};
			Network.Post<CreateAccount.Body, CreateAccount.Response>('createAccount', params, accountCreatedCallback);
		},
		validateUsername(value: String) {
			return this.lengthCheck(value, 'Username', 4, 35);
		},
		validatePassword(value: String) {
			return this.lengthCheck(value, 'Password', 4, 35);
		},
		lengthCheck(value: String, fieldName: String, minLength: number, maxLength: number) {
			if (value.length < minLength) {
				return `${fieldName} must be at least ${minLength} characters.`;
			}
			if ( value.length > maxLength) {
				return `${fieldName} cannot exceed ${maxLength} characters.`;
			}
			return '';
		},
	},
};