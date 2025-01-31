<script>
    import { onMount } from 'svelte';

    import SVGAdd from "/src/images/add.svg";
    import SVGRefresh from "/src/images/refresh.svg";

    export let type;
    export let initialData = [];
    export let dataProvider = null;
    export let refresh = false;
    export let limit;
    export let heading = null;
    export let containerType = "grid";
    export let arg = null;
    export let showOnlyThese = false;

    let data = [];
    let newBatch = [];
    let loadCount = 0;
    let loading = true;

    let card;
    let logic;
    let containerClass;
    let emptyMessage;
    let options = {};

    $: data = [
        ...data,
        ...newBatch
    ];

    $: limit = limit;

    // Load initial data
    onMount(async () => {
        switch (type) {
            case 'artist':
                logic = await import("../logic/artist");
                card = (await import('../components/artist/artistCard.svelte')).default;
                containerClass = (containerType === "grid") ? "artist-grid" : "artist-scroll";
                emptyMessage = "No artists found";
                break;
            case 'album':
                logic = await import("../logic/album");
                card = (await import('../components/album/albumCard.svelte')).default;
                containerClass = (containerType === "grid") ? "album-grid" : "album-scroll";
                emptyMessage = "No albums found";
                break;
            case 'song':
                logic = await import("../logic/song");
                card = (await import('../components/song/songCard.svelte')).default;
                containerClass = (containerType === "grid") ? "song-grid" : "song-scroll";
                emptyMessage = "No songs found";
                break;
            case 'playlist':
                logic = await import("../logic/playlist");
                card = (await import('../components/playlist/playlistCard.svelte')).default;
                containerClass = (containerType === "grid") ? "playlist-grid" : "playlist-scroll";
                emptyMessage = "No playlists found";
                break;
            case 'smartlist':
                logic = await import("../logic/playlist");
                card = (await import('../components/playlist/playlistCard.svelte')).default;
                containerClass = (containerType === "grid") ? "playlist-grid" : "playlist-scroll";
                emptyMessage = "No smartlists found";
                options = {isSmartlist: true};
                break;
            case 'genre':
                logic = await import("../logic/genre");
                card = (await import('../components/genre/genreCard.svelte')).default;
                containerClass = (containerType === "grid") ? "genre-grid" : "genre-scroll";
                emptyMessage = "No genres found";
                break;
            case 'podcast':
                logic = await import("../logic/podcast");
                card = (await import('../components/podcast/podcastCard.svelte')).default;
                containerClass = (containerType === "grid") ? "podcast-grid" : "podcast-scroll";
                emptyMessage = "No podcast found";
                break;
            default:
                break;
        }

        // if starting off with preloaded data, kick off the loadCount
        if (initialData.length > 0) {
            newBatch = initialData;
            loading = false;
            loadCount++;
        } else {
            await loadMore();
        }
    });

    // Append extra data to existing
    async function loadMore() {
        loading = true;
        newBatch = await logic[dataProvider]({query: arg, limit: limit, page: loadCount});
        loading = false;
        loadCount++;
    }

    // Replace existing data with new
    async function refreshItems() {
        loading = true;
        data = [];
        newBatch = [];
        newBatch = await logic[dataProvider]({query: arg, limit: limit});
        loading = false;
    }
</script>

{#if heading || refresh}
    <h2 class="panel-title">
        {#if heading}
            {heading}
        {/if}

        {#if refresh}
            {#if heading}
                <button on:click={refreshItems} class="refresh-button"><SVGRefresh/></button>
            {:else}
                <button on:click={refreshItems} class="button button--tertiary"><SVGRefresh/> Refresh</button>
            {/if}
        {/if}
    </h2>
{/if}

<section>
    {#if loading && (loadCount < 1 || refresh)}
        <ul class="{containerClass}">
            {#each Array(parseInt(limit)) as placeholder}
                <li>
                    <svelte:component this={card} {...options} />
                </li>
            {/each}
        </ul>
    {:else}
        {#if data.length > 0}
            <ul class="{containerClass}">
                {#each data as dataSingle}
                    {#if dataSingle.name}
                        <li>
                            <svelte:component this={card} data={dataSingle} {...options} />
                        </li>
                    {/if}
                {/each}
                {#if !refresh}
                    {#if !showOnlyThese}
                        <li>
                            <button on:click={loadMore} hidden={newBatch.length < limit} class="load-more-button icon-button button--regular"><SVGAdd /></button>
                        </li>
                    {/if}
                {/if}
            </ul>
        {:else}
            <p>{emptyMessage}</p>
        {/if}
    {/if}
</section>

<style>
    h2 {
        display: flex;
        align-items: center;
        font-size: 20px;
    }

    .refresh-button {
        margin-left: var(--spacing-md);
    }

    .load-more-button:not([hidden]) {
        height: 100%;
    }
</style>