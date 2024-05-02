<script lang="ts">
	import { goto } from '$app/navigation';
	import api from '$lib/scripts/api';
	import socket from '$lib/stores/socket';
	import { userGroupsStore, userStore } from '$lib/stores/user';
	import type { ApiCreateGroup } from '$lib/types/api/chat';
	import type { AxiosError } from 'axios';

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());

		try {
			const createGroupResponse = (
				await api.put('/chat/groups/createGroup', {
					userId: $userStore.id,
					groupName: data.name,
				})
			).data as ApiCreateGroup;

			if (createGroupResponse.success) {
				userGroupsStore.update((groups) => [
					...groups,
					createGroupResponse.data,
				]);

				$socket.emit('join', createGroupResponse.data.id);

				await api.post(`/chat/group/users/setLastOpened`, {
					userId: $userStore.id,
					groupId: createGroupResponse.data.id,
				});

				location.href = `/chat/${createGroupResponse.data.id}`;
			} else {
				alert(createGroupResponse.error);
			}
		} catch (_error: any) {
			const error = _error as AxiosError;
			alert((error.response?.data as any).error || error.message);
		}
	}
</script>

<div
	class="container"
	style="width: 15rem;"
>
	<h1>Csoport létrehozása</h1>
	<form on:submit="{handleSubmit}">
		<label class="w-50 p-2">
			Csoport név
			<input
				type="text"
				name="name"
			/>
		</label>

		<button
			type="submit"
			class="w-50 p-1 btn btn-info">Létrehozás</button
		>
	</form>
</div>
