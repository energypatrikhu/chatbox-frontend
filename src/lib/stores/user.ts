import { type Writable, writable, get } from 'svelte/store';
import type { User, UserGroup } from '$lib/types/user';
import api from '$lib/scripts/api';
import type { AxiosError } from 'axios';

export const userLoginId: Writable<string> = writable();

// User store
export const userStore: Writable<User> = writable();
let userStoreFirstChange = true;
let userStoreBounceTimer: number | null = null;
userStore.subscribe((updatedUserData) => {
	if (userStoreBounceTimer) {
		clearTimeout(userStoreBounceTimer);
	}
	userStoreBounceTimer = setTimeout(async () => {
		if (userStoreFirstChange) {
			userStoreFirstChange = false;
			return;
		}

		try {
			await api.patch(
				`/user/data/${updatedUserData.id}?loginId=${get(userLoginId)}`,
				updatedUserData,
			);
		} catch (_error: any) {
			const error = _error as AxiosError;
			alert((error.response?.data as any).error || error.message);
		}
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

		try {
			await api.patch(
				`/user/groups/${userId}?loginId=${get(userLoginId)}`,
				{
					groupIds: updatedGroups.map((group) => group.id),
				},
			);
		} catch (_error: any) {
			const error = _error as AxiosError;
			alert((error.response?.data as any).error || error.message);
		}
	}, 1000);
});
