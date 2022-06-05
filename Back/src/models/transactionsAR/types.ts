import { GenericObject, IResponse } from 'core';

interface Columns {
	id: string;
	accountId: string;
	route: string;
	ipAddress: string;
	params: GenericObject;
	response: IResponse;
}

type TransactionsParams = Partial<Columns>;

export {
	Columns,
	TransactionsParams,
};
