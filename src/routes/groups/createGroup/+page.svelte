<script lang="ts">
	import { goto } from '$app/navigation';
	import api from '$lib/scripts/api';
	import socket from '$lib/stores/socket';
	import { userGroupsStore, userStore } from '$lib/stores/user';
	import type { ApiCreateGroup } from '$lib/types/api/chat';

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

				$socket.emit(
					'join',
					`${createGroupResponse.data.type}:${createGroupResponse.data.id}`,
				);

				goto(`/group/${createGroupResponse.data.id}`);
			} else {
				alert(createGroupResponse.error);
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

<h1>Csoport létrehozása</h1>

<div>
	<form on:submit="{handleSubmit}">
		<label>
			Csoport név
			<input
				type="text"
				name="name"
			/>
		</label>

		<button type="submit">Létrehozás</button>
	</form>
</div>
