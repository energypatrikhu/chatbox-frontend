<script lang="ts">
	import '$lib/bootstrap/css/bootstrap.min.css';
	import '$lib/bootstrap/js/bootstrap.bundle.min.js';
	import { List } from 'svelte-bootstrap-icons';

	import { userGroupsStore } from '$lib/stores/user';
	import { page } from '$app/stores';
</script>

<header>
	<nav
		class="navbar navbar-expand-lg bg-body-tertiary"
		style="background-color:deepskyblue"
	>
		<div class="container-fluid">
			<h1>ChatBox</h1>
			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarNav"
			>
				<List
					width="30"
					height="30"
				/>
			</button>
			<div
				class="collapse navbar-collapse"
				id="navbarNav"
			>
				<ul class="navbar-nav">
					<li class="nav-item">
						<a
							class="nav-link"
							href="/">Főoldal</a
						>
					</li>
					<li class="nav-item">
						<a
							class="nav-link"
							href="/about">Rólunk</a
						>
					</li>
					{#if !$page.url.pathname.startsWith('/user')}
						<li class="nav-item">
							<a
								class="nav-link"
								href="/settings">Beállítások</a
							>
						</li>
						<li class="nav-item">
							<a
								class="nav-link"
								href="/chat/createGroup">Csoport létrehozás</a
							>
						</li>
					{/if}
				</ul>
			</div>
		</div>
	</nav>
</header>

{#if !$page.url.pathname.startsWith('/user')}
	<aside>
		{#each $userGroupsStore as group}
			<div>
				<a href="/group/{group.id}">
					<span>{group.name}</span>
				</a>
			</div>
		{/each}
	</aside>
{/if}

<main>
	<slot />
</main>

<style>
	a {
		color: black;
	}
</style>
