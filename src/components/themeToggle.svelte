<script>
    import { Theme } from "../stores/status";
    import { MediaPlayer } from "../stores/player";

    import SVGDarkMode from "/src/images/dark_mode.svg";
    import SVGLightMode from "/src/images/light_mode.svg";

    function toggleTheme() {
        let theme;
        if ($Theme === 'dark') {
            theme = 'light';
            document.body.classList.add('theme-is-light');
        } else {
            theme = 'dark';
            document.body.classList.remove('theme-is-light');
        }

        localStorage.setItem('AmpleTheme', JSON.stringify(theme));
        Theme.set(theme);

        // update waveform colors when theme is toggled
        $MediaPlayer.setWaveColors();
    }
</script>

<button
    class="icon-button theme-toggle"
    on:click={toggleTheme}
    title="Toggle theme"
>
    {#if $Theme === 'dark'}
        <SVGLightMode />
    {:else}
        <SVGDarkMode />
    {/if}

    Toggle theme
</button>

<style>
    .theme-toggle {
        display: flex;
        gap: var(--spacing-sm);
    }
</style>