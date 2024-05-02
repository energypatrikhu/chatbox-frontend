<script lang="ts">
	import api from '$lib/scripts/api';

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

<div class="container ">
	<h1>Regisztráció</h1>

	<form on:submit="{handleSubmit}">
		<label class="w-50 p-2">
			Email
			<input
				type="email"
				name="email"
			/>
		</label>

		<br>

		<label class="w-50 p-2">
			Név
			<input
				type="text"
				name="name"
			/>
		</label>
		<br>
		<label class="w-50 p-2">
			Jelszó
			<input
				type="password"
				name="password"
			/>
		</label>
		<br>
		<button type="submit">Regisztráció</button>
	</form>

	<a class="nav-link"  href="/user/login">Bejelentkezés</a>
</div>
<style>
	a{
		color: black;
	}
</style>