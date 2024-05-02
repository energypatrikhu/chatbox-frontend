export interface Message {
	id: number;
	text: string;
	createdAt: Date;
	updatedAt: Date;
	userId: number;
	groupId: number;
	User: {
		id: number;
		name: string;
	};
	Group: {
		id: number;
		type: string;
	};
}

export interface GroupChange {
	id: number;
	type: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	Users: {
		id: number;
		name: string;
	};
}
