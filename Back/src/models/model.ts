import { table } from "console";

type Collumn = {
	name: string;
	type: 'bool' | 'string' | 'int' | 'json';
	taintable: boolean;
	primary: boolean;
	nullable: boolean;
	autoIncrement: boolean;
};

abstract class Model {
	public static table: string;
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

	public getTable = () => {
		return table;
	};
}

export {Model};
export {Collumn};