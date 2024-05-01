<script lang="ts">
	import { userStore, userContactsStore } from '$lib/stores/user';
	import { page } from '$app/stores';
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
	<aside>
		{#each $userContactsStore as contact}
			<div>
				<span>{contact}</span>
			</div>
		{/each}
	</aside>
{/if}

<main>
	<slot />
</main>
