import { createRouter, createWebHistory, Router } from 'vue-router';

import loginPage from './routes/login/loginPage.vue';
import CreateAccount from './routes/createAccount/createAccount.vue';
import dashboard from './routes/dashboard/dashboard.vue';
import collectionPage from './routes/collectionPage/collectionPage.vue';

export type paths = '/' | '/login' | '/createaccount' | '/dashboard' | '/collection/:id';

interface routeMap {
	path: paths;
	component: any;
	props?: true;
}

const routes: routeMap[] = [
	{ path: '/', component: loginPage, },
	{ path: '/login', component: loginPage, },
	{ path: '/createaccount', component: CreateAccount, },
	{ path: '/dashboard', component: dashboard, },
	{ path: '/collection/:id', component: collectionPage, props: true},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

const setRoute = (component: any, path: paths) => {
	const componentRouter = component.$router as Router;
	componentRouter.push({path,});
}

export {
	router,
	setRoute
};