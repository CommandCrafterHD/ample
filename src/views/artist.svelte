<script>
    import { fade } from 'svelte/transition';

    import { ShowExpandedAlbums, Theme } from "../stores/status";
    import { serverURL } from "../stores/server";

    import { getArtist, similarArtists } from "../logic/artist";
    import { getTopSongsFromArtist } from "../logic/song";
    import { formatTimeToReadable } from "../logic/helper";

    import Tabs from "../components/tabs/tabs.svelte";
    import Tab from "../components/tabs/tab.svelte";
    import ArtistCard from '../components/artist/artistCard.svelte';
    import ArtistReleases from '../components/artist/artistReleases.svelte';
    import ArtistSongs from '../components/artist/artistSongs.svelte';
    import Rating from '../components/rating.svelte';
    import Lister2 from '../components/lister/lister.svelte';
    import MusicbrainzScan2 from '../components/musicbrainzScan2.svelte';
    import ThirdPartyServices from '../components/thirdPartyServices.svelte';
    import Actions2 from '../components/action/actions.svelte';
    import Genres from '../components/genre/genres.svelte';

    import '/src/css/containerqueries/artist.css';
    import SVGAlbum from "/src/images/album.svg";
    import SVGPopular from "/src/images/trending_up.svg";
    import SVGSongs from "/src/images/songs.svg";
    import SVGSimilar from "/src/images/people.svg";
    import SVGArticle from "/src/images/article.svg";
    import SVGTrack from "/src/images/music_note.svg";
    import SVGClock from "/src/images/clock.svg";

    export let id;

    let theme;
    $: theme = $Theme;

    // List of tab items with labels and values.
    let tabItems = [
        { label: "Discography",         value: "discography", icon: SVGAlbum },
        { label: "Popular Songs",       value: "popular",     icon: SVGPopular },
        { label: "All Songs",           value: "all",         icon: SVGSongs },
        { label: "Similar Artists",     value: "similar",     icon: SVGSimilar },
        { label: "Summary",             value: "summary",     icon: SVGArticle },
        { label: "MusicBrainz Compare", value: "musicbrainz" },
    ];

    // Current active tab
    let currentTab;

    function toggleShowExpanded() {
        let inverted = !$ShowExpandedAlbums;
        localStorage.setItem('ShowExpandedAlbums', JSON.stringify(inverted));
        ShowExpandedAlbums.set(inverted);
    }
</script>

{#await getArtist({id: id, artAnalysis: true})}
    <p>Loading artist</p>
{:then artist}
    {#if artist.id}
        <div class="container" in:fade>
            <div class="header">
                <h1 class="title">{artist.name}</h1>

                <div class="profile">
                    <div class="art-container" >
                        <img class="art"
                            src="{artist.art}&thumb=32"
                            alt="Image of {artist.name}"
                            width="240"
                            height="240"
                            on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=artist&thumb=32' }}
                        />
                    </div>

                    <div class="rating">
                        <Rating type="artist" id="{artist.id}" rating="{artist.rating}" flag="{artist.flag}" averageRating="{artist.averagerating}" />
                    </div>
                </div>

                <div class="details">
                    <div class="meta">
                        {#if artist.albumcount > 0}
                            <span><SVGAlbum class="inline"/> {artist.albumcount} {artist.albumcount !== 1 ? 'releases' : 'release'}</span>
                        {/if}

                        {#if artist.appearanceCount > 0}
                            <span><SVGAlbum class="inline"/> {artist.appearanceCount} {artist.appearanceCount !== 1 ? 'appearances' : 'appearance'}</span>
                        {/if}

                        <span><SVGTrack class="inline"/> {artist.songcount} {artist.songcount !== 1 ? 'songs' : 'song'}</span>

                        {#if artist.time > 0}
                            <span><SVGClock class="inline"/> {formatTimeToReadable(artist.time)}</span>
                        {/if}
                    </div>


                    <Genres genres="{artist.genre}" />

                    <div class="actions">
                        <Actions2
                            type="artist"
                            mode="fullButtons"
                            showShuffle={artist.songcount > 1}
                            id="{artist.id}"
                        />

                        <ThirdPartyServices data={artist} type="artist" />
                    </div>
                </div>
            </div>
        </div>

        <Tabs bind:activeTabValue={currentTab} bind:items={tabItems}>
            {#each tabItems as tab}
                {#if tab.loaded === true}
                    {#if tab.value === 'discography'}
                        <Tab id="discography" class="discography" bind:activeTabValue={currentTab}>
                            <button
                                class="album-view-toggle button button--regular"
                                on:click={toggleShowExpanded}>
                                View {$ShowExpandedAlbums ? 'condensed' : 'expanded'}
                            </button>

                            <ArtistReleases artistID={artist.id} />
                        </Tab>
                    {/if}

                    {#if tab.value === 'popular'}
                        <Tab id="popular" class="popular" bind:activeTabValue={currentTab}>
                            {#await getTopSongsFromArtist(id)}
                                Loading popular songs
                            {:then songs}
                                {#if songs.length > 0}
                                    <Lister2
                                        data={songs}
                                        type="song"
                                        tableOnly={true}
                                        showIndex={true}
                                        actionData={{
                                            type: "",
                                            mode: "fullButtons",
                                            showShuffle: songs.length > 1,
                                            data: Object.create({songs: songs})
                                        }}
                                    />
                                {:else}
                                    <p>No songs found</p>
                                {/if}
                            {:catch error}
                                <p>An error occurred.</p>
                            {/await}
                        </Tab>
                    {/if}

                    {#if tab.value === 'similar'}
                        <Tab id="similar" class="similar" bind:activeTabValue={currentTab}>
                            {#await similarArtists(id)}
                                Loading similar artists
                            {:then artists}
                                {#if artists.length > 0}
                                    <div class="artist-grid">
                                        {#each artists as artist}
                                            {#if artist.name}
                                                <ArtistCard data="{artist}" />
                                            {/if}
                                        {/each}
                                    </div>
                                {:else}
                                    <p>No similar artists</p>
                                {/if}
                            {:catch error}
                                <p>An error occurred.</p>
                            {/await}
                        </Tab>
                    {/if}

                    {#if tab.value === 'all'}
                        <Tab id="all" class="all" bind:activeTabValue={currentTab}>
                            {#if artist.songcount > 0}
                                <ArtistSongs artistID={artist.id} />
                            {:else}
                                <p>No songs found</p>
                            {/if}
                        </Tab>
                    {/if}

                    {#if tab.value === 'summary'}
                        <Tab id="summary" class="summary" bind:activeTabValue={currentTab}>
                            {#if artist.summary && artist.summary.replace(/\s/g, "").length > 0}
                                <div class="summary">
                                    <p>{artist.summary}</p>
                                </div>
                            {:else}
                                <p>No summary found</p>
                            {/if}
                        </Tab>
                    {/if}

                    {#if tab.value === 'musicbrainz'}
                        <Tab id="musicbrainz" class="musicbrainz" bind:activeTabValue={currentTab}>
                            <MusicbrainzScan2 data={artist} />
                        </Tab>
                    {/if}
                {/if}
            {/each}
        </Tabs>
    {:else}
        <p>Unable to find artist with that ID</p>
    {/if}
{:catch error}
    <p>Something went wrong: {error.message}</p>
{/await}

<style>
    .container {
        container-name: artist-info-wrapper;
        container-type: inline-size;
    }

    .header {
        position: relative;
    }
    
    .header:before {
        content: '';
        background-color: var(--color-highlight);
        mask-image: linear-gradient(
                to bottom,
                hsl(0, 0%, 0%) 0%,
                hsla(0, 0%, 0%, 0.738) 19%,
                hsla(0, 0%, 0%, 0.541) 34%,
                hsla(0, 0%, 0%, 0.382) 47%,
                hsla(0, 0%, 0%, 0.278) 56.5%,
                hsla(0, 0%, 0%, 0.194) 65%,
                hsla(0, 0%, 0%, 0.126) 73%,
                hsla(0, 0%, 0%, 0.075) 80.2%,
                hsla(0, 0%, 0%, 0.042) 86.1%,
                hsla(0, 0%, 0%, 0.021) 91%,
                hsla(0, 0%, 0%, 0.008) 95.2%,
                hsla(0, 0%, 0%, 0.002) 98.2%,
                hsla(0, 0%, 0%, 0) 100%
        );
        position: absolute;
        bottom: 0;
        top: calc(-1 * var(--spacing-xxl));
        left: calc(-1 * var(--spacing-xxl));
        right: calc(-1 * var(--spacing-xxl));
        pointer-events: none;
        z-index: -1;
        opacity: 0.2;
    }
    
    .art-container {
        max-width: 240px;
        aspect-ratio: 1 / 1;
        border-radius: 6px;
        overflow: hidden;
        font-size: 0;
        position: relative;
        box-shadow: var(--shadow-lg);
    }

    .art {
        object-fit: cover;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: -1;
    }

    .profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .rating {
        display: inline-block;
        margin-top: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
    }

    .title {
        --roboto-opsz: 50;
        line-height: 1;
        text-align: center;
        letter-spacing: 0.02em;
        font-weight: 300;
        font-stretch: 80%;
    }

    .details {
        container-name: artist-details-wrapper;
        container-type: inline-size;
    }

    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md) var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
    }
    
    .actions {
        display: flex;
        flex-direction: column-reverse;
        gap: var(--spacing-lg);
    }

    .details:after {
        content: '';
        display: table;
        clear: both;
        padding-bottom: var(--spacing-xxl);
    }

    .album-view-toggle {
        width: 140px;
        text-align: center;
        display: inline-block;
        margin-bottom: var(--spacing-xl);
    }

    .summary {
        max-width: 80ch;
        line-height: 1.5;
    }
</style>