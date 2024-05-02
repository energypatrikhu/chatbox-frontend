<script lang="ts">
	import '$lib/bootstrap/css/bootstrap.min.css';
	import '$lib/bootstrap/js/bootstrap.bundle.min.js';

	import {
		userStore,
		userContactsStore,
		userGroupsStore,
	} from '$lib/stores/user';
	import { page } from '$app/stores';

	let showRoomType: 'contacts' | 'groups' = 'contacts';
</script>

<header>
	<h1>ChatBox</h1>
	<nav>
		<a href="/">Főoldal</a>
		<a href="/about">Rólunk</a>
		<a href="/settings">Beállítások</a>
	</nav>
</header>

{#if !$page.url.pathname.startsWith('/user')}
	<div>
		<button on:click="{() => (showRoomType = 'contacts')}"
			>Kapcsolatok</button
		>
		<button on:click="{() => (showRoomType = 'groups')}">Csoportok</button>
	</div>
	<aside>
		{#if showRoomType === 'contacts'}
			{#each $userContactsStore as contact}
				<div>
					<a href="/contact/{contact.id}">
						<span>{contact.name}</span>
					</a>
				</div>
			{/each}
		{:else}
			{#each $userGroupsStore as group}
				<div>
					<a href="/group/{group.id}">
						<span>{group.name}</span>
					</a>
				</div>
			{/each}
		{/if}
	</aside>
{/if}

<main>
	<slot />
</main>
