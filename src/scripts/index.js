const githubUrl = "https://api.github.com/repos/";
const frameworks = {
    vue: { name: "Vue", repo: "vuejs/vue" },
    react: { name: "React", repo: "facebook/react" },
    angular: { name: "Angular", repo: "angular/angular" },
    svelte: { name: "Svelte", repo: "sveltejs/svelte" },
    backbone: { name: "Backbone", repo: "jashkenas/backbone" },
    "ember.js": { name: "Ember", repo: "emberjs/ember.js" },
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
    table.setHeaders(["Name", "Repository", "Stars", "Forks"]);
    table.load(Object.values(frameworks));
    table.render();
}

async function main() {
    await fetchStarsAndForks();
    displayTable();
}

window.addEventListener("DOMContentLoaded", main);
