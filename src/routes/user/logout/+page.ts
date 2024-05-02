import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import api from '$lib/scripts/api';

export const load = (async () => {
	const loginId = localStorage.getItem('loginId');
	if (!loginId) {
		return redirect(302, '/user/login');
	}

	localStorage.removeItem('loginId');
	try {
		await api.delete(`/user/logout/${loginId}`);
	} catch (error) {
		console.error(error);
	}

	return redirect(302, '/user/login');
}) satisfies PageLoad;
