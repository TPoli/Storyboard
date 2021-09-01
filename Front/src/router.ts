import { createRouter, createWebHistory } from "vue-router";

import loginPage from "./routes/login/loginPage.vue";
import CreateAccount from "./routes/createAccount/createAccount.vue";
import dashboard from "./routes/dashboard/dashboard.vue";

const routes = [
	{ path: "/", component: loginPage },
	{ path: "/login", component: loginPage },
	{ path: "/createaccount", component: CreateAccount },
	{ path: "/dashboard", component: dashboard },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;