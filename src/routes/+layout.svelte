<script lang="ts">
	import '$lib/bootstrap/css/bootstrap.min.css';
	import '$lib/bootstrap/js/bootstrap.bundle.min.js';
	import { List } from 'svelte-bootstrap-icons';

	import { userGroupsStore } from '$lib/stores/user';
	import { page } from '$app/stores';
	import { startsWith } from 'lodash';

	let headerHeight: number = 0;
</script>

<header bind:offsetHeight="{headerHeight}">
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
					{#if !$page.url.pathname.startsWith('/user') && !$page.url.pathname.startsWith('/about')}
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
					{:else}
						<li class="nav-item">
							<a
								class="nav-link"
								href="/about">Rólunk</a
							>
						</li>
						<li class="nav-item">
							<a
								class="nav-link"
								href="/user/login">Bejelentkezés</a
							>
						</li>
					{/if}
				</ul>
			</div>
		</div>
	</nav>
</header>

{#if !$page.url.pathname.startsWith('/user') && !$page.url.pathname.startsWith('/about')}
	<aside>
		{#each $userGroupsStore as group}
			<a
				style="{parseInt($page.params.id) === group.id
					? 'background-color: lightblue;'
					: ''}"
				class="card card-body"
				href="/chat/{group.id}"
			>
				<span>{group.name}</span>
			</a>
		{/each}
	</aside>
{/if}

<main
	class="{$page.url.pathname.startsWith('/user') ||
	$page.url.pathname.startsWith('/about')
		? 'main-full'
		: 'main-min'}"
	style="--header-height: {headerHeight}px"
>
	<slot />
</main>

<style>
	aside {
		background-color: whitesmoke;
		position: fixed;
		width: 256px;
		height: calc(100% - var(--header-height));
		overflow-x: hidden;
		overflow-y: auto;
	}

	main {
		overflow: hidden;
		border-left: 1px solid #ccc;
		box-sizing: border-box;
	}

	.main-full {
		width: 100vw;
	}

	.main-min {
		position: fixed;
		height: calc(100% - var(--header-height));
		width: calc(100vw - 256px);
		left: 256px;
	}

	a {
		color: black;
	}
</style>
