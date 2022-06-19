import { GenericObject } from 'core';
import { IResponse } from 'storyboard-networking';

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
