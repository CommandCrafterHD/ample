<script>
    import { Link } from 'svelte-routing';

    import SVGGenre from "/src/images/label.svg";

    export let genres;
</script>

{#if genres.length > 0}
    <ul class="genres">
        {#each genres as genre}
            <li class="genre-tag"><Link to="genres/{genre.id}"><SVGGenre /> {genre.name}</Link></li>
        {/each}
    </ul>
{/if}

<style>
    .genres {
        display: flex;
        gap: var(--spacing-md);
        flex-wrap: wrap;
        margin-bottom: var(--spacing-lg);
    }

    .genre-tag :global(a) {
        display: flex;
        background-color: var(--color-genre-background);
        border: 1px solid var(--color-genre-border);
        color: var(--color-genre-text);
        border-radius: 3px;
        padding: 0.2em 0.5em;
        font-stretch: 25%;
        align-items: center;
    }

    .genre-tag :global(svg) {
        color: inherit;
        opacity: 0.5;
        height: 1em;
        width: auto;
        margin-right: var(--spacing-sm);
    }
</style>