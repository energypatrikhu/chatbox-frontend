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

	$: ({ messages, id, users } = data);

	function messageListener() {
		$socket.off('message');
		$socket.on('message', (message: Message) => {
			if (message.Group.id !== parseInt(id)) {
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
				destinationId: id,
				senderId: $userStore.id,
				text: data.message,
			});

			(event.target as HTMLFormElement).reset();
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

<!-- <div
	class="container"
	style="width: 15rem;"
>
	<h1>Felhasználó hozzáadása</h1>
	<form on:submit="{handleAddUserSubmit}">
		<label class="w-50 p-2">
			Név
			<input
				type="text"
				name="name"
			/>
		</label>

		<button
			type="submit"
			class="w-50 p-1 btn btn-info">Hozzáadás</button
		>
	</form>
</div>
<div
	class="container"
	style="width: 15rem;"
>
	<h1>Felhasználó eltávolítása</h1>
	<form on:submit="{handleRemoveUserSubmit}">
		<label class="w-50 p-2">
			Felhasználó
			<select name="userId">
				{#each users as user}
					<option value="{user.id}">{user.name}</option>
				{/each}
			</select>
		</label>

		<button
			type="submit"
			class="w-60 p-1 btn btn-info">Eltávolítás</button
		>
	</form>
</div> -->
<div class="message-container">
	<div class="message-container-messages">
		{#each messages as message}
			<div
				class="message-container-message {message.User.id ===
				parseInt($userStore.id)
					? 'message-side-right'
					: 'message-side-left'}"
			>
				<div class="message-details">
					<span class="message-container-message-time"
						>{new Date(message.createdAt).toLocaleString()}</span
					>
					<span class="message-container-message-name"
						>{message.User.name}</span
					>
				</div>
				<span class="message-container-message-text"
					>{message.text}</span
				>
			</div>
		{/each}
	</div>

	<form
		class="message-sender-container"
		on:submit="{handleMessageSubmit}"
	>
		<label>
			<input
				type="text"
				name="message"
				placeholder="Üzenet..."
			/>
		</label>

		<button type="submit">Küldés</button>
	</form>
</div>

<style>
	.message-container {
		display: flex;
		flex-direction: column;
	}

	.message-container-messages {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		position: fixed;
		width: calc(100% - 256px);
		height: calc(100% - var(--header-height) - 38px);
	}

	.message-container-messages div {
		display: flex;
	}

	.message-sender-container {
		position: fixed;
		bottom: 0;
		display: flex;
		width: calc(100% - 256px);
	}

	.message-sender-container label {
		flex: 1;
		margin: 5px;
	}
	.message-sender-container input {
		width: 100%;
		border: 1px solid #ccc;
		border-radius: 4px;
	}
	.message-sender-container button {
		width: 100px;
		margin: 5px;
		outline: auto;
		border: none;
		border-radius: 4px;
		background-color: lightblue;
	}

	.message-container-message {
		display: flex;
		flex-direction: column;
		margin: 5px;
	}

	.message-side-right {
		align-items: flex-end;
	}

	.message-side-left .message-details {
		flex-direction: row-reverse;
	}

	.message-details {
		display: flex;
		font-size: 14px;
	}

	.message-container-message-time {
		margin-right: 5px;
	}

	.message-container-message-name {
		font-weight: bold;
	}
</style>
