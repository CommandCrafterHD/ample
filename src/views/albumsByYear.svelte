<script>
    import AlbumsByYear from '../components/album/albumsByYear.svelte';

    export let year;
</script>

<h1 class="page-title">Albums by Year</h1>

<AlbumsByYear showYear={year} />