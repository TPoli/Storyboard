type Collumn = {
	name: string;
	type: 'bool' | 'string' | 'int';
	taintable: boolean;
	primary: boolean;
};

abstract class Model {
	public abstract table: string;
	public abstract version: number;
	public abstract collumns: Collumn[]
	protected isNew = true;

	public static find<Type>(): Type|null {
		return null;
	}

	save(): boolean {
		return false;
	};

	// use after save() if you need to access any auto generated data such as ID
	refresh(): void {

	};
}

export {Model};
export {Collumn};