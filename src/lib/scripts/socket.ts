import type { Socket } from 'socket.io-client';
import { get, type Writable } from 'svelte/store';
import type { GroupChange } from '$lib/types/chat';
import { userGroupsStore, userStore } from '$lib/stores/user';
import { page } from '$app/stores';
import { goto } from '$app/navigation';

export default function handleSocket(_socket: Writable<Socket>) {
	const socket = get(_socket);

	socket.on('add-user', (data: GroupChange) => {
		if (parseInt(get(userStore).id) !== data.Users.id) return;

		userGroupsStore.update((groups) => {
			return [...groups, data];
		});
	});

	socket.on('remove-user', (data: GroupChange) => {
		if (parseInt(get(userStore).id) !== data.Users.id) return;

		userGroupsStore.update((groups) => {
			return groups.filter((group) => group.id !== data.id);
		});

		if (get(page).url.pathname === `/${data.type}/${data.id}`) {
			goto('/');
		}
	});
}
