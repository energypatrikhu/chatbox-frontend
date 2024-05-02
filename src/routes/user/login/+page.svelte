<script lang="ts">
	import api from '$lib/scripts/api';

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

<h1>Bejelentkezés</h1>

<form on:submit="{handleSubmit}">
	<label>
		Email
		<input
			type="email"
			name="email"
		/>
	</label>

	<label>
		Jelszó
		<input
			type="password"
			name="password"
		/>
	</label>

	<button type="submit">Bejelentkezés</button>
</form>

<a href="/user/register">Regisztráció</a>
