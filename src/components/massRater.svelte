<script>
    import { setRating } from "../logic/library";

    export let items = [];
    export let type;
    export let loadedTime;

    let newRating = 3;

    function handleApply() {
        items.forEach((item, index) => {
            if (item.selected === true) {
                setRating(type, item.id, newRating);
                items[index].rating = newRating;
            }
        });

        items = items;
        loadedTime = new Date();
    }

    function handleRating(e) {
        newRating = parseInt(e.target.value);
    }
</script>


<div class="container">
    <button type="button" class="button button--primary" on:click={handleApply}>Apply</button>

    <label>
        rating of

        <select on:change={handleRating}>
            <option value="0" selected={newRating === 0}>0</option>
            <option value="1" selected={newRating === 1}>1</option>
            <option value="2" selected={newRating === 2}>2</option>
            <option value="3" selected={newRating === 3}>3</option>
            <option value="4" selected={newRating === 4}>4</option>
            <option value="5" selected={newRating === 5}>5</option>
        </select>
    </label>

    <span>to selected items</span>
</div>


<style>
    .container {
        background-color: var(--color-interface);
        padding: var(--spacing-lg);
        display: inline-block;
        border-radius: 10px;
    }
</style>