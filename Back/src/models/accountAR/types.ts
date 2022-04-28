interface Columns {
	id?: string;
	username?: string;
	password?: string;
	salt?: string;
	pepper?: string;
	mobile?: string;
	email?: string;
}

type AccountProps = Partial<Columns>;

export {
	AccountProps,
	Columns,
};
