<script>
    import { deletePlaylist } from "../../logic/playlist";

    import SVGBin from "/src/images/delete.svg";

    export let playlist = null;
    export let isVisible;

    function handleDelete() {
        deletePlaylist(playlist.id);
        playlist.isDeleted = true;
        playlist = playlist;
        isVisible = false;
    }

    function handleCancel() {
        isVisible = false;
    }
</script>

<div class="container">
    <div class="panel-header">
        <h4 class="panel-title">Confirm playlist removal</h4>
    </div>

    <div class="panel-content">
        <p><em>{playlist.name}</em> will be deleted</p>
    </div>

    <div class="panel-footer">
        <button class="button button--tertiary" on:click={handleCancel}>Cancel</button>
        <button class="button button--danger" on:click={handleDelete}><SVGBin /> Delete</button>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        width: 250px;
        gap: var(--spacing-md);
    }

    h4 {
        margin: 0;
    }

    p {
        margin: 0 var(--spacing-sm);
    }
</style>