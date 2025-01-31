<script>
    import { onDestroy, onMount } from 'svelte';
    import { Link } from "svelte-routing";

    import { SearchQuery, ShowSearch, SidebarIsOpen } from "../stores/status";
    import { SiteContentBind, SiteSidebarBind, SiteQueueBind } from '../stores/player';

    import Search from '../components/search.svelte';
    import UserMenu from '../components/userMenu.svelte';
    import Notifications from '../components/notification/notifications.svelte';

    import SVGAmpleLogo from "/src/images/ample_logo.svg";
    import SVGAmpleLetter from "/src/images/ample_letter.svg";
    import SVGClose from "/src/images/close.svg";
    import SVGSearch from "/src/images/search.svg";
    import SVGMenu from "/src/images/menu.svg";

    let timeout;
    let minimumLength = 2;

    let contentObserver;
    let sidebarObserver;
    let queueObserver;

    function handleFocus() {
        ShowSearch.set(true);
    }

    function handleInputChange(event) {
        clearTimeout(timeout);

        timeout = setTimeout(function () {
            let chars = event.target.value;

            if (chars.length >= minimumLength) {
                ShowSearch.set(true);
                SearchQuery.set(chars);
            } else {
                ShowSearch.set(false);
            }
        }, 600);
    }

    function handleClear() {
        SearchQuery.set('');
        ShowSearch.set(false);
    }

    function handleSidebarToggle() {
        let inverted = !$SidebarIsOpen;
        localStorage.setItem('SidebarIsOpen', JSON.stringify(inverted));
        SidebarIsOpen.set(inverted);
    }

    onMount(() => {
        // use ResizeObserver to monitor changes in dimension,
        // done in Header to give the binds time to initialise
        contentObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                $SiteContentBind = $SiteContentBind;
            });
        });

        sidebarObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                $SiteSidebarBind = $SiteSidebarBind;
            });
        });

        queueObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                $SiteQueueBind = $SiteQueueBind;
            });
        });

        contentObserver.observe($SiteContentBind);
        sidebarObserver.observe($SiteSidebarBind);
        queueObserver.observe($SiteQueueBind);
    });

    onDestroy(() => {
        if (contentObserver) {
            contentObserver.disconnect();
        }

        if (sidebarObserver) {
            sidebarObserver.disconnect();
        }

        if (queueObserver) {
            queueObserver.disconnect();
        }
    });
</script>

<div class="site-header">
    <div class="site-logo-container">
        <button id="sidebar-button" class="icon-button" on:click={handleSidebarToggle}><SVGMenu /></button>
        <Link to="{import.meta.env.BASE_URL}" class="site-logo " data-label="Artists"><SVGAmpleLetter /><SVGAmpleLogo /></Link>
    </div>

    <div class="search-container">
        <SVGSearch class="search-icon" />
        <input
            type="text"
            placeholder="Search"
            class="site-search"
            on:focus={handleFocus}
            on:paste={handleInputChange}
            on:keyup={handleInputChange}
            value="{$SearchQuery}"
        />
        {#if $SearchQuery}
            <button class="icon-button close" on:click={handleClear}><SVGClose /></button>
        {/if}
    </div>

    <div class="misc-container">
        <Notifications />

        <UserMenu />
    </div>
</div>

<Search />

<style>
    .site-header {
        background-color: var(--color-header);
        width: 100%;
        height: var(--size-header-height);
        align-items: center;
        z-index: 20;
        line-height: 1;
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
    }

    .site-header :global(*) {
        color: var(--color-sidebar-primary);
    }

    .site-logo-container {
        padding: 0 var(--spacing-md);
    }

    .site-logo-container,
    .misc-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .misc-container {
        justify-content: end;
    }

    :global(.site-logo) {
        display: block;
        width: 100%;
        line-height: 0;
        margin-right: var(--spacing-sm);
    }

    .site-header :global(.ample-logo) {
        display: none;
    }

    :global(.ample-letter),
    .site-header :global(.ample-logo){
        height: 14px;
    }

    :global(.ample-logo),
    :global(.ample-letter) {
        color: var(--color-highlight);
    }

    @media (hover: hover) {
        :global(.ample-logo:hover),
        :global(.ample-letter:hover) {
            color: var(--color-text-primary);
        }
    }

    .search-container {
        width: 100%;
        max-width: 500px;
        justify-self: center;
        height: calc(100% - 8px);
    }

    input.site-search {
        padding-left: var(--spacing-xxl);
        padding-right: var(--spacing-xxl);
        position: relative;
        display: block;
        width: 100%;
        height: 100%;
        border: 0;
        background-color: var(--color-sidebar-background);
        border-radius: 0;
    }

    input.site-search:focus-visible {
        box-shadow: inset 0 0 0 2px var(--color-highlight-alt);
    }

    .search-container :global(.search-icon) {
        position: absolute;
        left: var(--spacing-md);
        z-index: 10;
        fill: var(--color-sidebar-secondary);
    }

    .close {
        cursor: pointer;
        display: flex;
        align-items: center;
        position: absolute;
        right: var(--spacing-md);
        background: unset;
        border: unset;
        box-shadow: unset;
    }

    .search-container {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 1;
    }

    @media all and (min-width: 720px) {
        .site-logo-container {
            width: var(--size-sidebar-width);
        }

        .site-header :global(.ample-logo) {
            display: block;
        }

        :global(.ample-letter) {
            display: none;
        }
    }
</style>