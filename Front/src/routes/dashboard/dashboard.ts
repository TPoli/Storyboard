import Container from '../../components/Container.vue';

export default {
	name: "dashboard",
	components: {
		Container: Container
	},
	methods: {
		createAccount() {
			(this as any).$router.push({path: '/createaccount'});
		},
		login() {
			(this as any).$router.push({path: '/login'});
		}
	}
};