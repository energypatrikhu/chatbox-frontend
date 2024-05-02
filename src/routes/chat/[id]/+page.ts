import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { userGroupsStore, userStore } from '$lib/stores/user';
import api from '$lib/scripts/api';
import type { ApiGroupUsers, ApiMessages } from '$lib/types/api/chat';
import { goto } from '$app/navigation';

export const load = (async ({ params, parent }) => {
	await parent();

	try {
		const group = get(userGroupsStore).find(
			(group) => group.id === parseInt(params.id),
		);

		if (!group) {
			goto('/');
			return {
				id: params.id,
				messages: [],
				users: [],
				group: { id: 0, name: '' },
			};
		}

		console.log('group', group);

		const getGroupMessages = (await api.get(`/chat/messages/${group.id}`))
			.data as ApiMessages;

		const getGroupUsers = (await api.get(`/chat/group/users/${group.id}`))
			.data as ApiGroupUsers;

		await api.post(`/chat/group/users/setLastOpened`, {
			userId: get(userStore).id,
			groupId: group.id,
		});

		return {
			id: params.id,
			messages: getGroupMessages.data.reverse(),
			users: getGroupUsers.data,
			group,
		};
	} catch (error) {
		goto('/');
	}

	return {
		id: params.id,
		messages: [],
		users: [],
		group: { id: 0, name: '' },
	};
}) satisfies PageLoad;
