
export enum PermissionType {
	OWNER = 'owner',
	READ_ONLY = 'read_only',
	FULL = 'full',
}

export interface IPermissions {
	
	// metadata

	// columns
	id: string;
	favourite: boolean;
	lastUpdated: Date;
	permissionType: PermissionType;
	collectionId: string;
}