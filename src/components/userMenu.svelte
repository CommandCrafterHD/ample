<script>
    import { logout } from "../logic/user";
    import ThemeToggle from '../components/themeToggle.svelte';
    import Menu from '../components/menu.svelte';

    import SVGLogout from "/src/images/logout.svg";
    import SVGProfile from "/src/images/account_circle.svg";

    let menuIsVisible = false;

    function toggleMenu() {
        menuIsVisible = !menuIsVisible;
    }

    function handleLogOut() {
        logout();
    }
</script>

<button id="userMenu-toggle" class="icon-button userMenu-toggle" on:click={toggleMenu}>
    <SVGProfile />
</button>

{#if menuIsVisible}
    <Menu anchor="bottom-right" toggleSelector={"#userMenu-toggle"} bind:isVisible={menuIsVisible}>
        <div class="container">
            <button
                on:click={handleLogOut}
                class="visuallyLink logout"
                title="Log out"
            >
                <SVGLogout />
                <span class="text">Log out</span>
            </button>

            <ThemeToggle />
        </div>
    </Menu>
{/if}

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        justify-content: start;
    }

    .container :global(svg) {
        height: 1.5em;
        width: auto;
        color: var(--color-highlight);
    }

    .container :global(button),
    .container :global(a) {
        display: flex;
        gap: var(--spacing-sm);
    }

    .container :global(.theme-toggle) {
        background-color: transparent;
        padding: 0;
        font-weight: normal;
        color: inherit;
    }

    .userMenu-toggle {
        margin-right: var(--spacing-sm);
    }
</style>