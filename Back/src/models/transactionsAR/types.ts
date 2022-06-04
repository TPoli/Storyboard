import { GenericObject } from 'core';

interface Columns {
	id: string;
	accountId: string;
	route: string;
	ipAddress: string;
	params: GenericObject;
	response: GenericObject;
}

type TransactionsParams = Partial<Columns>;

export {
	Columns,
	TransactionsParams,
};
