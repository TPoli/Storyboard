import { Model } from './model';

function cachableFn<Type> (parent: Model, cacheName: string, implementation: () => Promise<Type>): () => Promise<Type> {
	return async () => {
		if  (typeof (parent as any)[cacheName] === 'undefined') {
			(parent as any)[cacheName] = await implementation();
		}

		return (parent as any)[cacheName];
	};
}

export { cachableFn };
