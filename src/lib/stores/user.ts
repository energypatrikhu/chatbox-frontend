import { type Writable, writable, get } from 'svelte/store';
import type { User, UserContact, UserGroup } from '$lib/types/user';
import api from '$lib/scripts/api';

export const userLoginId: Writable<string> = writable('');

// User store
export const userStore: Writable<User> = writable();
let userStoreFirstChange = true;
let userStoreBounceTimer: number | null = null;
userStore.subscribe((updatedUserData) => {
	if (userStoreBounceTimer) {
		clearTimeout(userStoreBounceTimer);
	}
	userStoreBounceTimer = setTimeout(() => {
		if (userStoreFirstChange) {
			userStoreFirstChange = false;
			return;
		}

		api.patch(
			`/user/data/${updatedUserData.id}?loginId=${get(userLoginId)}`,
			updatedUserData,
		);
	}, 1000);
});

// User contacts store
export const userContactsStore: Writable<UserContact[]> = writable();
let userContactsStoreFirstChange = true;
let userContactsStoreBounceTimer: number | null = null;
userContactsStore.subscribe(async (updatedContacts) => {
	if (userContactsStoreBounceTimer) {
		clearTimeout(userContactsStoreBounceTimer);
	}
	userContactsStoreBounceTimer = setTimeout(async () => {
		if (userContactsStoreFirstChange) {
			userContactsStoreFirstChange = false;
			return;
		}

		const userId = get(userStore).id;
		api.patch(`/user/contacts/${userId}?loginId=${get(userLoginId)}`, {
			groupIds: updatedContacts.map((contact) => contact.id),
		});
	}, 1000);
});

// User groups store
export const userGroupsStore: Writable<UserGroup[]> = writable();
let userGroupsStoreFirstChange = true;
let userGroupsStoreBounceTimer: number | null = null;
userGroupsStore.subscribe(async (updatedGroups) => {
	if (userGroupsStoreBounceTimer) {
		clearTimeout(userGroupsStoreBounceTimer);
	}
	userGroupsStoreBounceTimer = setTimeout(async () => {
		if (userGroupsStoreFirstChange) {
			userGroupsStoreFirstChange = false;
			return;
		}

		const userId = get(userStore).id;
		api.patch(`/user/groups/${userId}?loginId=${get(userLoginId)}`, {
			groupIds: updatedGroups.map((group) => group.id),
		});
	}, 1000);
});
