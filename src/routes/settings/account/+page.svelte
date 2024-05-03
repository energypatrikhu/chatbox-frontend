<script lang="ts">
	import { userStore } from '$lib/stores/user';

	let email = $userStore.email;
</script>

<div class="settings-container">
	<div class="settings-header">
		<h1>Account</h1>
		<a href="/settings/profile">Profil</a>
	</div>

	<div class="settings-body">
		<div class="settings-body-setting">
			<label class="setting-label">
				E-Mail
				<input
					type="email"
					bind:value="{email}"
				/>
			</label>

			<button
				class="setting-button"
				on:click="{() => ($userStore.email = email)}">Mentés</button
			>
		</div>
	</div>
</div>

<style>
	.settings-container {
		margin: 20px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.settings-header {
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid #ccc;
		padding-bottom: 10px;
	}
	.settings-body {
		display: flex;
		flex-direction: column;
		width: 15rem;
	}
	.settings-body-setting {
		display: flex;
		flex-direction: column;
	}
	.setting-label {
		display: flex;
		flex-direction: column;
	}
	.setting-button {
		width: 50%;
		padding: 0.5rem;
		margin-top: 1rem;
	}
</style>
