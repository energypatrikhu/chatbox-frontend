<script lang="ts">
	import type { PageData } from './$types';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import socket from '$lib/stores/socket';
	import { userStore } from '$lib/stores/user';
	import type { Message } from '$lib/types/chat';
	import api from '../../../lib/scripts/api';
	import type {
		ApiAddUser,
		ApiRemoveUser,
	} from '../../../lib/types/api/chat';
	import { onMount } from 'svelte';

	export let data: PageData;
	let pageLoaded = false;

	$: ({ messages, type, id, users } = data);

	function messageListener() {
		$socket.off('message');
		$socket.on('message', (message: Message) => {
			if (
				message.Group.id !== parseInt(id) ||
				message.Group.type !== type
			) {
				return;
			}

			messages = [...messages, message];

			console.log('message', message);
		});
	}

	onMount(() => {
		messageListener();

		return () => {
			$socket.off('message');
		};
	});

	afterNavigate(() => {
		if (!pageLoaded) {
			pageLoaded = true;
			return;
		}

		console.log(users);

		messageListener();
	});

	beforeNavigate(() => {
		$socket.off('message');
	});

	async function handleMessageSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());

		try {
			$socket.emit('message', {
				destinationType: type,
				destinationId: id,
				senderId: $userStore.id,
				text: data.message,
			});
		} catch (error) {
			console.error(error);
		}
	}

	async function handleAddUserSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());

		try {
			const addUser = (
				await api.put('/chat/groups/addUser', {
					groupId: id,
					userName: data.name,
				})
			).data as ApiAddUser;

			if (addUser.success) {
				users = [...users, addUser.data.Users];

				console.log('addUser', addUser);
			} else {
				alert(addUser.error);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function handleRemoveUserSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());

		try {
			const removeUser = (
				await api.delete(`/chat/groups/removeUser/${id}/${data.userId}`)
			).data as ApiRemoveUser;

			if (removeUser.success) {
				users = users.filter(
					(user) => user.id !== removeUser.data.Users.id,
				);

				console.log('removeUser', removeUser);
			} else {
				alert(removeUser.error);
			}
		} catch (error) {
			console.error(error);
		}
	}
</script>

<h1>Felhasználó hozzáadása</h1>
<form on:submit="{handleAddUserSubmit}">
	<label>
		Név
		<input
			type="text"
			name="name"
		/>
	</label>

	<button type="submit">Hozzáadás</button>
</form>

<h1>Felhasználó eltávolítása</h1>
<form on:submit="{handleRemoveUserSubmit}">
	<label>
		Felhasználó
		<select name="userId">
			{#each users as user}
				<option value="{user.id}">{user.name}</option>
			{/each}
		</select>
	</label>

	<button type="submit">Eltávolítás</button>
</form>

<h1>Messages</h1>

{#each messages as message}
	<div>
		<span>[{message.groupId}|{message.userId}]</span>
		<span>[{message.createdAt}]</span>
		<span>[{message.User.name}]</span>
		<span>{message.text}</span>
	</div>
{/each}

<form on:submit="{handleMessageSubmit}">
	<label>
		Üzenet
		<input
			type="text"
			name="message"
		/>
	</label>

	<button type="submit">Küldés</button>
</form>

<style>
	div {
		display: flex;
	}
</style>
