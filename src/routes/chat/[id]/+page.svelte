<script lang="ts">
	import type { PageData } from './$types';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import socket from '$lib/stores/socket';
	import { userStore } from '$lib/stores/user';
	import type { Message } from '$lib/types/chat';
	import api from '$lib/scripts/api';
	import type { ApiAddUser, ApiRemoveUser } from '$lib/types/api/chat';
	import { onMount } from 'svelte';
	import { PersonAdd, PersonDash } from 'svelte-bootstrap-icons';
	import type { AxiosError } from 'axios';

	export let data: PageData;

	let modelOpen: 'addUser' | 'removeUser' | null = null;

	let messageContainerMessages: HTMLDivElement;

	$: ({ messages, id, users, group } = data);

	function messageListener() {
		messageContainerMessages.scrollTop =
			messageContainerMessages.scrollHeight;

		$socket.off('message');
		$socket.on('message', (message: Message) => {
			// console.log('message', message);

			if (message.Group.id !== parseInt(id)) {
				return;
			}

			messages = [...messages, message];

			setTimeout(() => {
				messageContainerMessages.scrollTop =
					messageContainerMessages.scrollHeight;
			}, 0);

			// console.log('message', message);
		});
	}

	onMount(() => {
		messageListener();

		return () => {
			$socket.off('message');
		};
	});

	afterNavigate(() => {
		messageListener();

		return () => {
			$socket.off('message');
		};
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
		} catch (_error: any) {
			const error = _error as AxiosError;
			alert((error.response?.data as any).error || error.message);
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

				// console.log('addUser', addUser);
			} else {
				alert(addUser.error);
			}
		} catch (_error: any) {
			const error = _error as AxiosError;
			alert((error.response?.data as any).error || error.message);
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

				// console.log('removeUser', removeUser);
			} else {
				alert(removeUser.error);
			}
		} catch (_error: any) {
			const error = _error as AxiosError;
			alert((error.response?.data as any).error || error.message);
		}
	}
</script>

{#if modelOpen === 'addUser'}
	<div class="user-modal">
		<h1>Felhasználó hozzáadása</h1>
		<form on:submit="{handleAddUserSubmit}">
			<div class="user-modal-body">
				<label class="user-modal-label">
					Név
					<input
						type="text"
						name="name"
					/>
				</label>
			</div>

			<div class="user-modal-actions">
				<button
					type="submit"
					class="user-modal-button">Hozzáadás</button
				>
				<button
					on:click="{() => (modelOpen = null)}"
					type="button"
					class="user-modal-button">Mégsem</button
				>
			</div>
		</form>
	</div>
{:else if modelOpen === 'removeUser'}
	<div class="user-modal">
		<h1>Felhasználó eltávolítása</h1>
		<form on:submit="{handleRemoveUserSubmit}">
			<div class="user-modal-body">
				<label class="user-modal-label">
					Felhasználó
					<select name="userId">
						{#each users as user}
							<option value="{user.id}">{user.name}</option>
						{/each}
					</select>
				</label>
			</div>

			<div class="user-modal-actions">
				<button
					type="submit"
					class="user-modal-button">Eltávolítás</button
				>
				<button
					on:click="{() => (modelOpen = null)}"
					type="button"
					class="user-modal-button">Mégsem</button
				>
			</div>
		</form>
	</div>
{/if}

<div class="message-header">
	<h3>{group.name}</h3>
	<div class="chat-info-actions">
		<span class="message-header-users">
			<strong>{users.length}</strong> felhasználó
		</span>

		<div class="chat-actions">
			<button on:click="{() => (modelOpen = 'addUser')}">
				<PersonAdd
					width="30"
					height="30"
				/>
			</button>
			<button on:click="{() => (modelOpen = 'removeUser')}">
				<PersonDash
					width="30"
					height="30"
				/>
			</button>
		</div>
	</div>
</div>
<div class="message-container">
	<div
		class="message-container-messages"
		bind:this="{messageContainerMessages}"
	>
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
	.message-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 5px;
		border-bottom: 1px solid #ccc;
	}

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
		height: calc(100% - var(--header-height) - 39px - 50px);
		border-bottom: 1px solid #ccc;
		padding: 5px;
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
		color: gray;
	}

	.message-container-message-name {
		font-weight: bold;
	}

	.message-container-message-text {
		background-color: lightblue;
		padding: 5px 10px;
		border-radius: 4px;
	}

	.chat-info-actions {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.chat-actions {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.chat-actions button {
		background-color: transparent;
		border: none;
		cursor: pointer;
	}

	.user-modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: white;
		padding: 20px;
		border-radius: 4px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		z-index: 1000;
	}

	.user-modal-body {
		display: flex;
		flex-direction: column;
	}

	.user-modal-actions {
		display: flex;
		justify-content: space-evenly;
	}

	.user-modal-label {
		display: flex;
		flex-direction: column;
	}

	.user-modal-button {
		margin-top: 10px;
		border-radius: 4px;
	}
</style>
