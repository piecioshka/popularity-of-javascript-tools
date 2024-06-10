const githubUrl = "https://api.github.com/repos/";
const columnNames = ["Name 🗒️", "Repository 📦", "Stars ⭐️", "Forks 🪚"];

// =============================================================================

const frameworks = {
    // ___: { name: "___", repo: "___", stars: 0, forks: 0 },
    vue: { name: "Vue", repo: "vuejs/vue", stars: 0, forks: 0 },
    react: { name: "React", repo: "facebook/react", stars: 0, forks: 0 },
    preact: { name: "Preact", repo: "preactjs/preact", stars: 0, forks: 0 },
    angular: { name: "Angular", repo: "angular/angular", stars: 0, forks: 0 },
    svelte: { name: "Svelte", repo: "sveltejs/svelte", stars: 0, forks: 0 },
    backbone: {
        name: "Backbone",
        repo: "jashkenas/backbone",
        stars: 0,
        forks: 0,
    },
    "ember.js": { name: "Ember", repo: "emberjs/ember.js", stars: 0, forks: 0 },
};
const frameworkSelector = ".table-wrapper-for-frameworks";

const staticSite = {
    // ___: { name: "___", repo: "___", stars: 0, forks: 0 },
    quartz: { name: "Quartz v4", repo: "jackyzha0/quartz", stars: 0, forks: 0 },
    astro: { name: "Astro", repo: "withastro/astro", stars: 0, forks: 0 },
    gatsby: { name: "Gatsby", repo: "gatsbyjs/gatsby", stars: 0, forks: 0 },
    "next.js": { name: "Next.js", repo: "vercel/next.js", stars: 0, forks: 0 },
    jekyll: { name: "Jekyll", repo: "jekyll/jekyll", stars: 0, forks: 0 },
    hugo: { name: "Hugo", repo: "gohugoio/hugo", stars: 0, forks: 0 },
    eleventy: { name: "Eleventy", repo: "11ty/eleventy", stars: 0, forks: 0 },
    hexo: { name: "Hexo", repo: "hexojs/hexo", stars: 0, forks: 0 },
    vuepress: { name: "VuePress", repo: "vuejs/vuepress", stars: 0, forks: 0 },
    gridsome: { name: "Gridsome", repo: "gridsome/gridsome", stars: 0, forks: 0 },
    metalsmith: { name: "Metalsmith", repo: "metalsmith/metalsmith", stars: 0, forks: 0 },
    teeny: { name: "teeny", repo: "yakkomajuri/teeny", stars: 0, forks: 0 },
};

const staticSiteSelector = ".table-wrapper-for-static-site-generators";

// =============================================================================

async function fetchRepositoryDetails(repo) {
    const url = `${githubUrl}${repo}`;
    const response = await fetch(url);
    return await response.json();
}

async function fetchStarsAndForks(tools) {
    const repositories = await Promise.allSettled(
        Object.values(tools).map((framework) =>
            fetchRepositoryDetails(framework.repo)
        )
    );

    repositories.forEach(({ status, value }) => {
        if (status === "fulfilled" && value.name) {
            tools[value.name].stars = value.stargazers_count;
            tools[value.name].forks = value.forks_count;
        }
    });
}

function displayTable(tools, targetSelector) {
    const $target = document.querySelector(targetSelector);
    const tableOptions = { readonly: true };
    // @ts-ignore
    const table = new SimpleDataTable($target, tableOptions);
    table.setHeaders(columnNames);
    table.load(Object.values(tools));
    table.render();
    table.setSortComparingFn((a, b) => {
        if (typeof a === "string") {
            return a.localeCompare(b);
        }
        return a - b;
    });
    table.sortByColumn(2);
}

async function displayTools(tools, toolsSelector) {
    await fetchStarsAndForks(tools);
    displayTable(tools, toolsSelector);
}

async function main() {
    await displayTools(frameworks, frameworkSelector);
    await displayTools(staticSite, staticSiteSelector);
}

window.addEventListener("DOMContentLoaded", main);
