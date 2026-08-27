const githubUrl = "https://api.github.com/repos/";
// GitHub allows only 60 unauthenticated requests per hour per IP, so every
// repository is cached in localStorage for this long before asking again.
const cacheTtlMs = 6 * 60 * 60 * 1000;
const cacheKeyPrefix = "github-repo:";
const columnNames = ["Name 🗒️", "Repository 📦", "Stars ⭐️", "Forks 🪚"];

// =============================================================================

const frameworks = {
    // ___: { name: "___", repo: "___", stars: 0, forks: 0 },
    vue: { name: "Vue 3", repo: "vuejs/core", stars: 0, forks: 0 },
    vue2: { name: "Vue 2", repo: "vuejs/vue", stars: 0, forks: 0 },
    react: { name: "React", repo: "react/react", stars: 0, forks: 0 },
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
    solid: { name: "Solid", repo: "solidjs/solid", stars: 0, forks: 0 },
    alpine: { name: "Alpine.js", repo: "alpinejs/alpine", stars: 0, forks: 0 },
    qwik: { name: "Qwik", repo: "QwikDev/qwik", stars: 0, forks: 0 },
    lit: { name: "Lit", repo: "lit/lit", stars: 0, forks: 0 },
    htmx: { name: "htmx", repo: "bigskysoftware/htmx", stars: 0, forks: 0 },
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
    eleventy: { name: "Eleventy", repo: "11ty/buildawesome", stars: 0, forks: 0 },
    hexo: { name: "Hexo", repo: "hexojs/hexo", stars: 0, forks: 0 },
    vuepress: { name: "VuePress", repo: "vuejs/vuepress", stars: 0, forks: 0 },
    gridsome: { name: "Gridsome", repo: "gridsome/gridsome", stars: 0, forks: 0 },
    metalsmith: { name: "Metalsmith", repo: "metalsmith/metalsmith", stars: 0, forks: 0 },
    teeny: { name: "teeny", repo: "yakkomajuri/teeny", stars: 0, forks: 0 },
    docusaurus: { name: "Docusaurus", repo: "facebook/docusaurus", stars: 0, forks: 0 },
    nuxt: { name: "Nuxt", repo: "nuxt/nuxt", stars: 0, forks: 0 },
    docsify: { name: "Docsify", repo: "docsifyjs/docsify", stars: 0, forks: 0 },
    vitepress: { name: "VitePress", repo: "vuejs/vitepress", stars: 0, forks: 0 },
    sveltekit: { name: "SvelteKit", repo: "sveltejs/kit", stars: 0, forks: 0 },
};

const staticSiteSelector = ".table-wrapper-for-static-site-generators";

// =============================================================================

function readCache(repo) {
    try {
        const raw = localStorage.getItem(`${cacheKeyPrefix}${repo}`);
        const entry = raw === null ? null : JSON.parse(raw);
        if (entry === null || typeof entry !== "object") {
            return null;
        }
        return entry;
    } catch {
        return null;
    }
}

function writeCache(repo, details) {
    try {
        const entry = { savedAt: Date.now(), ...details };
        localStorage.setItem(`${cacheKeyPrefix}${repo}`, JSON.stringify(entry));
    } catch {
        // Storage unavailable or full - the page still works, just without cache.
    }
}

async function fetchRepositoryDetails(repo) {
    const cached = readCache(repo);
    if (cached && Date.now() - cached.savedAt < cacheTtlMs) {
        return cached;
    }

    const response = await fetch(`${githubUrl}${repo}`);
    const data = await response.json();

    if (typeof data.stargazers_count !== "number") {
        // Rate limit, missing repository or network hiccup - reuse stale data if any.
        if (cached) {
            return cached;
        }
        throw new Error(`GitHub API (${repo}): ${data.message || response.status}`);
    }

    const details = { stars: data.stargazers_count, forks: data.forks_count };
    writeCache(repo, details);
    return details;
}

async function fetchStarsAndForks(tools) {
    const entries = Object.values(tools);
    const repositories = await Promise.allSettled(
        entries.map((tool) => fetchRepositoryDetails(tool.repo))
    );

    // Match results by index, not by the repository name returned by GitHub:
    // renamed repositories are redirected and come back under a new name.
    repositories.forEach(({ status, value, reason }, index) => {
        if (status === "fulfilled") {
            entries[index].stars = value.stars;
            entries[index].forks = value.forks;
        } else {
            console.warn(reason);
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
