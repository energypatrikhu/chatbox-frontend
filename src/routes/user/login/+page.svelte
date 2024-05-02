<script lang="ts">
	import api from '$lib/scripts/api';
	import { List } from 'svelte-bootstrap-icons';

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(formData.entries());

		try {
			const loginResponse = (await api.patch('user/login', data)).data;

			if (loginResponse.success) {
				localStorage.setItem('loginId', loginResponse.data.loginId);
				location.href = '/';
			} else {
				alert(loginResponse.message);
			}
		} catch (error) {
			console.log(error);
		}
	}
</script>

<div class="container" style="width: 15rem;">
	<h1>Bejelentkezés</h1>

	<form on:submit="{handleSubmit}">
		<label class="w-50 p-2">
			Email
			<input
				type="email"
				name="email"
			/>
		</label>
		<label class="w-50 p-2">
			Jelszó
			<input
				type="password"
				name="password"
			/>
		</label>
		<button type="submit" class="btn btn-info">Bejelentkezés</button>
	</form>

	<a class="nav-link" href="/user/register">Regisztráció</a>
</div>
<style>
	a{
		color: black;
	}
</style>