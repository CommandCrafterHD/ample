<script>
    import Lister2 from '../components/lister/lister.svelte';

    export let loadedTime;
    export let loading;
    export let results = [];
    export let type;
    export let showCheckboxes = false;

    $: {
        // reset results if type changes
        if (type) {
            results = [];
        }
    }
</script>

{#if loading}
    <p>Searching for items</p>
{:else}
    {#if results.length > 0}
        <p>Total: {results.length}</p>
        {#key loadedTime}
            {#if type === "song"}
                <Lister2
                    bind:data={results}
                    type="{type}"
                    showCheckboxes={showCheckboxes}
                    actionData={{
                        type: "",
                        mode: "fullButtons",
                        data: Object.create({songs: results})
                    }}
                />
            {/if}

            {#if type === "album"}
                <Lister2
                    bind:data={results}
                    type="{type}"
                    showCheckboxes={showCheckboxes}
                    actionData={{
                        type: "albums",
                        mode: "fullButtons",
                        data: Object.create({albums: results})
                    }}
                />
            {/if}

            {#if type === "artist"}
                <Lister2
                    bind:data={results}
                    type="{type}"
                    showCheckboxes={showCheckboxes}
                    actionData={{
                        type: "artists",
                        mode: "fullButtons",
                        data: Object.create({artists: results})
                    }}
                />
            {/if}

            {#if type === "playlist"}
                <Lister2
                    bind:data={results}
                    type="{type}"
                    showCheckboxes={showCheckboxes}
                    actionData={{
                        type: "playlists",
                        mode: "fullButtons",
                        data: Object.create({playlists: results})
                    }}
                />
            {/if}
        {/key}
    {:else}
        <p>No items found</p>
    {/if}
{/if}