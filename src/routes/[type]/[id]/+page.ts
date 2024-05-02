import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { userGroupsStore, userStore } from '$lib/stores/user';
import api from '../../../lib/scripts/api';
import type { ApiGroupUsers, ApiMessages } from '../../../lib/types/api/chat';
import { goto } from '$app/navigation';

export const load = (async ({ params, parent }) => {
	await parent();

	if (!['group', 'contact'].includes(params.type)) {
		return redirect(302, '/');
	}

	try {
		const group = get(userGroupsStore).find(
			(group) =>
				group.id === parseInt(params.id) && group.type === params.type,
		);

		if (!group) {
			goto('/');
			return {
				type: params.type,
				id: params.id,
				messages: [],
				users: [],
			};
		}

		console.log('group', group);

		const getGroupMessages = (
			await api.get(`/chat/messages/${group.type}/${group.id}`)
		).data as ApiMessages;

		const getGroupUsers = (
			await api.get(`/chat/group/users/${group.type}/${group.id}`)
		).data as ApiGroupUsers;

		await api.post(`/chat/group/user/setLastOpened`, {
			userId: get(userStore).id,
			groupId: group.id,
			groupType: group.type,
		});

		return {
			type: params.type,
			id: params.id,
			messages: getGroupMessages.data.reverse(),
			users: getGroupUsers.data,
		};
	} catch (error) {
		goto('/');
	}

	return {
		type: params.type,
		id: params.id,
		messages: [],
		users: [],
	};
}) satisfies PageLoad;
