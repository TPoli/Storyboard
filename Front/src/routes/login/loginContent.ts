import { Network } from '../../utils/Network';
import { Endpoints, ILoginResponse, Response } from 'core';
import { getState, setState, StoreComponent } from '@/store';
import { setRoute } from '@/router';
import TextInput from '@/components/Forms/TextInput/TextInput.vue';
import BaseForm from '@/components/Forms/BaseForm/BaseForm.vue';

type FormData = {
	username: String,
	password: String,
};

export default {
	name: 'loginContent',
	components: {
		TextInput: TextInput,
		BaseForm: BaseForm,
	},
	data: function () {
		return {
			username: getState(this as unknown as StoreComponent).username,
		};
	},
	methods: {
		login(formData: FormData) {
			const loginCallback = (response: Response): void => {
				setState(this as unknown as StoreComponent).login((response as ILoginResponse).username);

				const fullPath = (this as any).$route.fullPath;
				if (fullPath === '/login' || fullPath === '/')
				{
					setRoute(this, '/dashboard');
				}
			
			};
			Network.Post(Endpoints.LOGIN, { un: formData.username, pw: formData.password,}, loginCallback);
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