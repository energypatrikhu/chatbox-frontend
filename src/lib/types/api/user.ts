import type { User, UserContact } from '$lib/types/user';

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

export type ApiUserContacts = {
	success: boolean;
	data: UserContact[];
	error?: string;
};
