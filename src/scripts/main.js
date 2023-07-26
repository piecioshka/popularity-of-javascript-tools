const githubUrl = "https://api.github.com/repos/";
const frameworks = {
    vue: { name: "Vue", repo: "vuejs/vue", stars: 0, forks: 0 },
    react: { name: "React", repo: "facebook/react", stars: 0, forks: 0 },
    angular: { name: "Angular", repo: "angular/angular", stars: 0, forks: 0 },
    svelte: { name: "Svelte", repo: "sveltejs/svelte", stars: 0, forks: 0 },
    backbone: { name: "Backbone", repo: "jashkenas/backbone", stars: 0, forks: 0 },
    "ember.js": { name: "Ember", repo: "emberjs/ember.js", stars: 0, forks: 0 },
};

async function fetchRepositoryDetails(repo) {
    const url = `${githubUrl}${repo}`;
    const response = await fetch(url);
    return await response.json();
}

async function fetchStarsAndForks() {
    const repositories = await Promise.allSettled(
        Object.values(frameworks).map((framework) =>
            fetchRepositoryDetails(framework.repo)
        )
    );

    repositories.forEach(({ status, value }) => {
        if (status === "fulfilled" && value.name) {
            frameworks[value.name].stars = value.stargazers_count;
            frameworks[value.name].forks = value.forks_count;
        }
    });
}

function displayTable() {
    const $target = document.querySelector(".table-wrapper");
    const tableOptions = { readonly: true };
    // @ts-ignore
    const table = new SimpleDataTable($target, tableOptions);
    table.setHeaders(["Name 🗒️", "Repository 📦", "Stars ⭐️", "Forks 🪚"]);
    table.load(Object.values(frameworks));
    table.sortByColumn(2, (a, b) => b - a);
    table.render();
}

async function main() {
    await fetchStarsAndForks();
    displayTable();
}

window.addEventListener("DOMContentLoaded", main);
