import { Network } from '../../utils/Network';
import { Endpoints, Response, ILoginResponse } from 'core';

import Page from '../../components/Page/Page.vue';
import TextInput from '../../components/Forms/TextInput/TextInput.vue';
import BaseForm from '@/components/Forms/BaseForm/BaseForm.vue';
import { setState, StoreComponent } from '@/store';
import { setRoute } from '@/router';

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
		createAccount(params: { username: String, password: String, email: String, mobile: String}) {
			const accountCreatedCallback = (response: Response): void => {
				setState(this as unknown as StoreComponent).login((response as ILoginResponse).username);
				setRoute(this, '/dashboard');
			};
			Network.Post(Endpoints.CREATE_ACCOUNT, params, accountCreatedCallback);
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