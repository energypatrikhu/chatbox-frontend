import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import api from '$lib/scripts/api';
import type {
	ApiLoginCheck,
	ApiUser,
	ApiUserContacts,
	ApiUserGroups,
} from '$lib/types/api/user';
import {
	userContactsStore,
	userGroupsStore,
	userLoginId,
	userStore,
} from '$lib/stores/user';
import socket from '../lib/stores/socket';
import { io } from 'socket.io-client';
import { get } from 'svelte/store';
import handleSocket from '../lib/scripts/socket';
import { goto } from '$app/navigation';

export const ssr = false;
// export const prerender = false;

export const load = (async ({ url }) => {
	if (url.pathname.startsWith('/user')) {
		return;
	}

	const loginId = localStorage.getItem('loginId');
	if (!loginId) {
		return redirect(302, '/user/login');
	}

	try {
		const checkLoginId = (await api.get(`/user/check/${loginId}`))
			.data as ApiLoginCheck;

		const getUser = (
			await api.get(
				`/user/data/${checkLoginId.data.id}?loginId=${loginId}`,
			)
		).data as ApiUser;

		const getUserContacts = (
			await api.get(
				`/user/contacts/${checkLoginId.data.id}?loginId=${loginId}`,
			)
		).data as ApiUserContacts;

		const getUserGroups = (
			await api.get(
				`/user/groups/${checkLoginId.data.id}?loginId=${loginId}`,
			)
		).data as ApiUserGroups;

		userLoginId.set(loginId);
		userStore.set(getUser.data);
		userContactsStore.set(getUserContacts.data);
		userGroupsStore.set(getUserGroups.data);

		if (getUser.data.lastOpened) {
			goto(`/${getUser.data.lastOpened}`);
		}
	} catch (error) {
		return redirect(302, '/user/login');
	}

	if (!get(socket)) {
		socket.set(
			io('http://localhost:3000/', {
				path: '/socket',
				auth: { userId: get(userStore).id },
			}),
		);

		handleSocket(socket);
	}

	return;
}) satisfies LayoutLoad;
