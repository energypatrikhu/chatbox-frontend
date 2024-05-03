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
	class="container-fluid card-3"
	style="width: 15rem;"
>
	<div class="card card-3">
		<div class="card-heading"><h2 class="title">Bejelentkezés</h2></div>
		<div class="card-body">
			<form on:submit="{handleSubmit}">
				<div class="input-group">
					<label class="w-50 p-2">
						Email
						<input
							class="input--style-3"
							type="email"
							name="email"
							placeholder="Email cím"
						/>
					</label>
				</div>
				<div class="input-group">
					<label class="w-50 p-2">
						Jelszó
						<input
							class="input--style-3"
							type="password"
							name="password"
							placeholder="Jelszó"
						/>
					</label>
				</div>
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
		color: darkturquoise;
		margin-top: 20px;
	}
	label {
		color: #fff;
	}
	/* BUTTON */
	.btn {
		display: inline-block;
		line-height: 35px;
		padding: 0 33px;
		margin-top: 30px;
		font-family: Poppins, Arial, 'Helvetica', sans-serif;
		cursor: pointer;
		color: #fff;
	}
	.btn-info {
		background: #5bc0de;
		border: 1px solid #5bc0de;
	}
	/* TITLE */
	.title {
		font-size: 30px;
		color: #fff;
		font-weight: 400;
		margin-bottom: 20px;
	}
	/* CARD */
	.card {
		overflow: hidden;
		-webkit-border-radius: 3px;
		-moz-border-radius: 3px;
		border-radius: 3px;
		margin-top: 30px;
		background: #fff;
		margin-top: 10px;
	}
	.card .card-heading {
		padding: 20px 0;
		background: #333;
		text-align: center;
	}
	.card-3 {
		background: #000;
		-webkit-border-radius: 10px;
		-moz-border-radius: 10px;
		border-radius: 10px;
		-webkit-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
		-moz-box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
		box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
		display: table;
	}
	.card-3 .card-body {
		padding: 150px 150px;
		padding-bottom: 65px;
		padding-top: 45px;
	}
	@media (max-width: 767px) {
		.card-3 {
			display: block;
		}
		.card-3 .card-heading {
			padding-top: 200px;
			background-position: center center;
		}
		.card-3 .card-body {
			display: block;
			padding: 30px 30px;
			padding-bottom: 45px;
		}
	}
	/* INPUT */
	input {
		outline: none;
		border: none;
		-webkit-box-shadow: none;
		-moz-box-shadow: none;
		box-shadow: none;
		font-family: inherit;
		width: 300px;
	}
	.input-group {
		position: relative;
		margin-bottom: 33px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
	}
	.input--style-3 {
		padding: 5px 0;
		font-size: 16px;
		color: #ccc;
		background: transparent;
	}
</style>
