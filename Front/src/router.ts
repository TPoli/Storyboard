import { createRouter, createWebHistory, Router } from 'vue-router';

import loginPage from './routes/login/loginPage.vue';
import CreateAccount from './routes/createAccount/createAccount.vue';
import dashboard from './routes/dashboard/dashboard.vue';
import collectionPage from './routes/collectionPage/collectionPage.vue';

type paths = '/' | '/login' | '/createaccount' | '/dashboard' | '/collection';

interface routeMap {
	path: paths;
	component: any;
}

const routes: routeMap[] = [
	{ path: '/', component: loginPage, },
	{ path: '/login', component: loginPage, },
	{ path: '/createaccount', component: CreateAccount, },
	{ path: '/dashboard', component: dashboard, },
	{ path: '/collection', component: collectionPage, },
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