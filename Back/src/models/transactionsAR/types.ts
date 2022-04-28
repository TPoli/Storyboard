interface Columns {
	id: string;
	accountId: string;
	route: string;
	ipAddress: string;
	params: Object;
	response: Object;
}

type TransactionsParams = Partial<Columns>;

export {
	Columns,
	TransactionsParams,
};
