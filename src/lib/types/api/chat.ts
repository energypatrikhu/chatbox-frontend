import type { Message } from '$lib/types/chat';
import type { UserGroup } from '$lib/types/user';

export type ApiMessages = {
	success: boolean;
	data: Message[];
	error?: string;
};

export type ApiCreateGroup = {
	success: boolean;
	data: UserGroup;
	error?: string;
};

export type ApiAddUser = {
	success: boolean;
	data: {
		Users: {
			id: number;
			name: string;
		};
		id: number;
		name: string;
		createdAt: Date;
		updatedAt: Date;
	};
	error?: string;
};

export type ApiRemoveUser = ApiAddUser;

export type ApiGroupUsers = {
	success: boolean;
	data: {
		id: number;
		name: string;
	}[];
	error?: string;
};
