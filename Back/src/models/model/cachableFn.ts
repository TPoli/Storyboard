import { Model } from './model';

function cachableFn<Type> (parent: Model, cacheName: string, implementation: () => Promise<Type>): () => Promise<Type> {
	return async () => {
		if  (typeof parent[cacheName] === 'undefined') {
			parent[cacheName] = await implementation();
		}

		return parent[cacheName];
	};
}

export { cachableFn };
