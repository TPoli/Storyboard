import { PermissionType } from 'core';

interface Columns {
	id: string;
	favourite: boolean;
	lastUpdated: Date;
	permissionType: PermissionType;
	collectionId: string;
	accountId: string;
}

type PermissionsParams = Partial<Columns>;

export {
	Columns,
	PermissionsParams,
};
