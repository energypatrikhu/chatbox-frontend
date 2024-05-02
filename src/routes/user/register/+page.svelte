<script lang="ts">
	import api from '$lib/scripts/api';
	import { ArrowUpRightSquare } from 'svelte-bootstrap-icons';

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());

		try {
			const registerResponse = (await api.put('user/register', data))
				.data;

			if (registerResponse.success) {
				location.href = '/';
			} else {
				alert(registerResponse.message);
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div class="container " style="width: 15rem;">
	<h1>Regisztráció</h1>

	<form on:submit="{handleSubmit}">
		<label class="w-50 p-2">
			Email
			<input
				type="email"
				name="email"
			/>
		</label>
		<label class="w-50 p-2">
			Név
			<input
				type="text"
				name="name"
			/>
		</label>
		<label class="w-50 p-2">
			Jelszó
			<input
				type="password"
				name="password"
			/>
		</label>
		<button type="submit" class="w-50 p-1 btn btn-info">Regisztráció</button>
	</form>

	<a class="nav-link"  href="/user/login">Bejelentkezés</a>
</div>
<style>
	a{
		color: black;
	}
</style>