
export default {
	name: "login",
	methods: {
		createAccount() {
			(this as any).$router.push({path: '/createaccount'});
		},
		dashboard() {
			(this as any).$router.push({path: '/dashboard'});
		}
	}
};