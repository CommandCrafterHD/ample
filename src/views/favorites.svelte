<script>
    import { favoriteArtists } from "../logic/artist";
    import { favoriteAlbums } from "../logic/album";
    import { favoriteSongs } from "../logic/song";

    import Tabs from "../components/tabs/tabs.svelte";
    import Tab from "../components/tabs/tab.svelte";
    import Lister2 from '../components/lister/lister.svelte';

    import SVGArtist from "/src/images/artist.svg";
    import SVGAlbum from "/src/images/album.svg";
    import SVGSong from "/src/images/music_note.svg";

    // Current active tab
    let currentTab;

    let tabItems = [
        { label: "Artists", value: "artists", icon: SVGArtist },
        { label: "Albums",  value: "albums",  icon: SVGAlbum },
        { label: "Songs",   value: "songs",   icon: SVGSong },
    ];
</script>

<h1 class="page-title">Favorites</h1>

<Tabs bind:activeTabValue={currentTab} bind:items={tabItems}>
    {#each tabItems as tab}
        {#if tab.loaded === true}
            {#if tab.value === 'artists'}
                <Tab id="artists" class="artists" bind:activeTabValue={currentTab}>
                    {#await favoriteArtists({limit: 100})}
                        Loading favorite artists
                    {:then artists}
                        {#if artists.length > 0}
                            <Lister2
                                data={artists}
                                type="artist"
                                actionData={{
                                    type: "artists",
                                    mode: "fullButtons",
                                    showShuffle: artists.length > 1,
                                    data: Object.create({artists: artists})
                                }}
                            />
                        {:else}
                            <p>No artists found</p>
                        {/if}
                    {:catch error}
                        <p>An error occurred.</p>
                    {/await}
                </Tab>
            {/if}

            {#if tab.value === 'albums'}
                <Tab id="albums" class="albums" bind:activeTabValue={currentTab}>
                    {#await favoriteAlbums({limit: 100})}
                        Loading favorite albums
                    {:then albums}
                        {#if albums.length > 0}
                            <Lister2
                                data={albums}
                                type="album"
                                actionData={{
                                    type: "albums",
                                    mode: "fullButtons",
                                    showShuffle: albums.length > 1,
                                    data: Object.create({albums: albums})
                                }}
                            />
                        {:else}
                            <p>No albums found</p>
                        {/if}
                    {:catch error}
                        <p>An error occurred.</p>
                    {/await}
                </Tab>
            {/if}

            {#if tab.value === 'songs'}
                <Tab id="songs" class="songs" bind:activeTabValue={currentTab}>
                    {#await favoriteSongs({limit: 100})}
                        Loading favorite songs
                    {:then songs}
                        {#if songs.length > 0}
                            <Lister2
                                data={songs}
                                type="song"
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
        {/if}
    {/each}
</Tabs>