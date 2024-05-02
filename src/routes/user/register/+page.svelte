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

<h1>Regisztráció</h1>

<form on:submit="{handleSubmit}">
	<label>
		Email
		<input
			type="email"
			name="email"
		/>
	</label>

	<label>
		Név
		<input
			type="text"
			name="name"
		/>
	</label>

	<label>
		Jelszó
		<input
			type="password"
			name="password"
		/>
	</label>

	<button type="submit">Regisztráció</button>
</form>

<a href="/user/login">Bejelentkezés</a>
