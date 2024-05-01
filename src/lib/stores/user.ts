import { type Writable, writable, get } from 'svelte/store';
import type { User, UserContact } from '$lib/types/user';
import api from '$lib/scripts/api';
import type { AxiosResponse } from 'axios';
import _ from 'lodash';

// User store
export const userStore: Writable<User> = writable();
let userStoreFirstChange = true;
let userStoreBounceTimer: number | null = null;
userStore.subscribe((value) => {
	if (userStoreBounceTimer) {
		clearTimeout(userStoreBounceTimer);
	}
	userStoreBounceTimer = setTimeout(() => {
		if (userStoreFirstChange) {
			userStoreFirstChange = false;
			return;
		}

		const userId = value.id;
		const oldUser = get(userStore);
		if (!_.isMatch(oldUser, value)) {
			api.post(`/user/${userId}`, value);
		}
	}, 1000);
});

// User contacts store
export const userContactsStore: Writable<UserContact[]> = writable();
let userContactsStoreFirstChange = true;
let userContactsStoreBounceTimer: number | null = null;
userContactsStore.subscribe(async (value) => {
	if (userContactsStoreBounceTimer) {
		clearTimeout(userContactsStoreBounceTimer);
	}
	userContactsStoreBounceTimer = setTimeout(async () => {
		if (userContactsStoreFirstChange) {
			userContactsStoreFirstChange = false;
			return;
		}

		const userId = get(userStore).id;
		const currentContacts = get(userContactsStore);
		if (currentContacts.length === value.length) {
			return;
		}

		const newContactsPost: Promise<AxiosResponse<any, any>>[] = [];
		for (const contact of value) {
			if (!currentContacts.find((c) => c.id === contact.id)) {
				newContactsPost.push(
					api.post(`/user/contacts/${userId}`, contact),
				);
			}
		}

		await Promise.all(newContactsPost);
	}, 1000);
});
