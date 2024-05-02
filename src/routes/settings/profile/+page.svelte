<script lang="ts">
	import { userStore } from '$lib/stores/user';
</script>

<h1>Profil</h1>

<label>
	Név
	<input
		type="text"
		bind:value="{$userStore.name}"
	/>
</label>

<button type="submit">Mentés</button>
