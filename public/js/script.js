// public/js/script.js
// Header and footer are now rendered on the SERVER (see views/partials),
// Everything below just wires up the search dropdown UI.

function initializeSearch() {
    const searchTrigger = document.getElementById("search-trigger");
    const searchDropdown = document.getElementById("search-dropdown");
    const searchField = document.getElementById("search-field");

    if (!searchTrigger || !searchDropdown || !searchField) return;

    searchTrigger.addEventListener("click", function (e) {
        e.stopPropagation();
        searchDropdown.classList.toggle("is-open");

        if (searchDropdown.classList.contains("is-open")) {
            setTimeout(() => searchField.focus(), 200);
        }
    });

    document.addEventListener("click", function (e) {
        if (
            !searchDropdown.contains(e.target) &&
            !searchTrigger.contains(e.target)
        ) {
            searchDropdown.classList.remove("is-open");
        }
    });

    // Simple client-side "search" -> sends the user to the shop page
    // with the query, since there's no live search index yet.
    searchField.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && searchField.value.trim() !== "") {
            window.location.href = "/shop?category=All";
        }
    });
}

window.addEventListener("DOMContentLoaded", initializeSearch);
