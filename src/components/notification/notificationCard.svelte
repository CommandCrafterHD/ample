<script>
    import { Link } from "svelte-routing";

    import { removeNotification } from "../../logic/notification";

    import Rating from '../../components/rating.svelte';

    import SVGClose from '/src/images/close.svg';
    import SVGInfo from "/src/images/info.svg";
    import SVGSuccess from "/src/images/check.svg";
    import SVGWarning from "/src/images/warning.svg";
    import SVGError from "/src/images/error.svg";
    import SVGAlbum from "/src/images/album.svg";

    export let item;
</script>

<div class="notification-card card {item.style}">
    <div class="style-icon">
        {#if item.style === "info"}
            <SVGInfo />
        {:else if item.style === "success"}
            <SVGSuccess />
        {:else if item.style === "warning"}
            <SVGWarning />
        {:else if item.style === "error"}
            <SVGError />
        {/if}
    </div>

    <div class="content">
        {#if item.title}
            <div class="title">{item.title}</div>
        {/if}

        {#if item.message}
            <div class="message">{item.message}</div>
        {/if}

        {#if item.data}
            <div class="message">
                <div class="title">
                    {item.data.title}
                </div>
                <div class="artist">
                    <Link to="artists/{item.data.artist.id}" title="{item.data.artist.name}">{item.data.artist.name}</Link>
                </div>
                <div class="album">
                    <Link to="albums/{item.data.album.id}" title="{item.data.album.name}"><SVGAlbum class="inline"/> {item.data.album.name}</Link>
                </div>
            </div>
        {/if}

        {#if item.type === "ratingMissing"}
            <div class="rating-container">
                <Rating type="song" id="{item.data.id}" rating="{item.data.rating}" flag="{item.data.flag}" averageRating="{item.data.averagerating}" />
            </div>
        {/if}

        {#if item.type === "alternateVersions"}
            <div class="action-container">
                <Link to="versions/{item.data.title}/{item.data.artist.name}" title="View all">View all</Link>
            </div>
        {/if}

        <div class="time">{item.time}</div>
    </div>

    <div class="actions">
        <button class="icon-button remove" on:click={e => { removeNotification(item.id) }}><SVGClose /></button>
    </div>
</div>

<style>
    .notification-card {
        background-color: var(--color-interface);
        padding: var(--spacing-md);
        border-radius: 4px;
        border-left: 4px solid var(--color-regular-background);
        display: flex;
        flex-direction: row;
        pointer-events: initial;
    }

    .notification-card.success {
        border-color: var(--color-primary-background);
    }

    .notification-card.info {
        border-color: var(--color-secondary-background);
    }

    .notification-card.warning {
        border-color: var(--color-warning-background);
    }

    .notification-card.error {
        border-color: var(--color-danger-background);
    }

    .style-icon {
        width: 32px;
    }

    .success .style-icon {
        color: var(--color-primary-foreground);
    }

    .info .style-icon {
        color: var(--color-secondary-foreground);
    }

    .warning .style-icon {
        color: var(--color-warning-foreground);
    }

    .error .style-icon {
        color: var(--color-danger-foreground);
    }

    .message {
        margin: var(--spacing-md) 0;
    }

    .message .title,
    .message .artist,
    .message .album {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .time {
        opacity: 0.6;
        margin-top: var(--spacing-sm);
        text-transform: uppercase;
    }

    .action-container,
    .rating-container {
        display: flex;
        margin: var(--spacing-md) 0;
        align-items: center;
    }

    .content {
        flex: 1;
        overflow: hidden;
    }

    .actions {
        margin-left: var(--spacing-md);
        position: relative;
        top: calc(-1 * var(--spacing-sm));
        right: calc(-1 * var(--spacing-sm));
    }
</style>