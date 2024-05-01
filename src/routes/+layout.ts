import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import api from '$lib/scripts/api';
import type {
	ApiLoginCheck,
	ApiUser,
	ApiUserContacts,
} from '$lib/types/api/user';
import { userContactsStore, userStore } from '$lib/stores/user';

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

		userStore.set(getUser.data);
		userContactsStore.set(getUserContacts.data);
	} catch (error) {
		return redirect(302, '/user/login');
	}
}) satisfies LayoutLoad;
