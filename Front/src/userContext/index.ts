type Breadcrumb = {
	title: string,
	id: string;
	type: 'Dashboard' | 'Collection',
};
interface IUserContext {
	currentIndex: number;
	history: Breadcrumb[];
}

class UserContext implements IUserContext {
	currentIndex: number;
	history: Breadcrumb[];

	constructor(data: IUserContext) {
		this.currentIndex = data?.currentIndex ?? 0;
		this.history = data?.history ?? [];
	}

	public openCollection(breadcrumb: Breadcrumb) {
		const breadcrumbIndex = this.history.findIndex(b => b.id === breadcrumb.id);
		if (breadcrumbIndex === -1) {
			this.history.splice(this.currentIndex, this.history.length - this.currentIndex, breadcrumb);
			this.currentIndex = this.history.length;
		} else {
			this.currentIndex = breadcrumbIndex + 1; // offset to account for dashboard
		}
	}
}

export {
	Breadcrumb,
	IUserContext,
	UserContext,
}
