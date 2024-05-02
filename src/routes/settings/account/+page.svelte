<script lang="ts">
	import { userStore } from '$lib/stores/user';
</script>

<h1>Account</h1>

<label>
	Email
	<input
		type="email"
		bind:value="{$userStore.email}"
	/>
</label>

<button type="submit">Mentés</button>
