<script>
    import { Link } from "svelte-routing";
    import { serverURL } from "../../stores/server";

    import AlbumCard from '../../components/album/albumCard.svelte';
    import AlbumSongs from '../../components/album/albumSongs.svelte';
    import Rating from '../../components/rating.svelte';
    import Visibility from '../../components/visibility.svelte';
    import Actions2 from '../../components/action/actions.svelte';

    import SVGArtist from "/src/images/artist.svg";
    import SVGYear from "/src/images/year.svg";

    export let data;

    let album;
    $: album = data;
</script>

<div class="album-card-expanded card">
    <div class="info">
        <AlbumCard data="{album}"/>
    </div>

    <Visibility steps={100} let:percent let:unobserve>
        {#if percent > 0}
            <div class="songs" use:unobserve>
                <AlbumSongs id={album.id} />
            </div>
        {/if}
    </Visibility>

</div>

<style>
    :global(.album-card-expanded + .album-card-expanded) {
        margin-top: calc(var(--spacing-xxxl) + var(--spacing-xxxl));
    }

    .info {
        margin-bottom: var(--spacing-xxl);
    }
</style>