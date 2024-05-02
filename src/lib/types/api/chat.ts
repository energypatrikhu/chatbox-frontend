import type { Message } from '../chat';
import type { UserGroup } from '../user';

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
		type: string;
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
