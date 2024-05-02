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
	};
}

export interface GroupChange {
	id: number;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	Users: {
		id: number;
		name: string;
	};
}
