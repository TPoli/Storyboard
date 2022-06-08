import { Collection } from "core"

class UserContext {
	private _collections: Collection[] = [];
	private _stack: any[] = [];
	private _selectedIndex: number = -1;

	constructor() {

	}

	private async updateCollections(): Promise<void> {
		// TODO : if memory usage gets high, drop some collections that are not in _stack or referenced by its contents
	}

	public openCollection(collection: Collection): void {
		this._selectedIndex += 1;
		if (this._selectedIndex <= 0) {
			this._stack = [collection];
		} else {
			this._stack.splice(this._selectedIndex, this._stack.length, collection);
		}

		if(!this._collections.find(c => c.id === collection.id)) {
			this._collections.push(collection);
		}

		this.updateCollections();
	}
}

export {
	UserContext,
}
