import { createRouter, createWebHistory } from "vue-router";

import Login from "./routes/login/login.vue";
import CreateAccount from "./routes/createAccount/createAccount.vue";
import dashboard from "./routes/dashboard/dashboard.vue";

const routes = [
	{ path: "/", component: Login },
	{ path: "/login", component: Login },
	{ path: "/createaccount", component: CreateAccount },
	{ path: "/dashboard", component: dashboard },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;