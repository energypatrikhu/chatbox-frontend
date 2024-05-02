export interface User {
	id: string;
	name: string;
	email: string;
	lastOpened: string; // group/1 | contact/2
}

export interface UserContact {
	id: string;
	name: string;
}

export interface UserGroup {
	id: number;
	type: string;
	name: string;
}
