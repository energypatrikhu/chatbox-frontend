<script lang="ts">
	import api from '$lib/scripts/api';
	import type { AxiosError } from 'axios';

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
				alert(loginResponse.error);
			}
		} catch (_error: any) {
			const error = _error as AxiosError;
			alert((error.response?.data as any).error || error.message);
		}
	}
</script>

<div
	class="container"
	style="width: 15rem;"
>
	<div class="card card-3">
		<div class="card-heading"></div>
		<div class="card-body">
			<h2 class="title">Bejelentkezés</h2>
			<form on:submit="{handleSubmit}">
				
				<label class="w-50 p-2">
					Email
					<input
						type="email"
						name="email"
						placeholder="Email cím"
					/>
				</label>
				<label class="w-50 p-2">
					Jelszó
					<input
						type="password"
						name="password"
						placeholder="Jelszó"
					/>
				</label>
				<button
					type="submit"
					class="btn btn-info">Bejelentkezés</button
				>
			</form>

			<a
				class="nav-link"
				href="/user/register">Regisztráció</a
			>
		
		</div>
	</div>
</div>

<style>
	a {
		color: black;
	}
	.card {
		overflow: hidden;
		-webkit-border-radius: 3px;
		-moz-border-radius: 3px;
		border-radius: 3px;
		background: #fff;
	}
	.card-3 {
		background: #000;
		-webkit-border-radius: 10px;
		-moz-border-radius: 10px;
		border-radius: 10px;
		-webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
		-moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
		box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
		width: 100%;
		display: table;
	}
</style>
