import type { User, UserGroup } from '$lib/types/user';

export type ApiLoginCheck = {
	success: boolean;
	data: {
		id: string;
	};
	error?: string;
};

export type ApiUser = {
	success: boolean;
	data: User;
	error?: string;
};

export type ApiUserGroups = {
	success: boolean;
	data: UserGroup[];
	error?: string;
};
