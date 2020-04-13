const APIurl = 'https://api.github.com/repos/';
const tableWrapper = document.querySelector('.table-wrapper');

const fetchData = async (repo) => {
    try {
        const response = await fetch(`${APIurl}${repo}`);
        const data = await response.json();

        return data;

    } catch (err) {
        console.log(err);
    }
}

const getData = (repo) => {
    fetchData(repo).then(data => {
        const starsCount = data.stargazers_count;
        const forksCount = data.forks_count;

        frameworks.forEach(framework => {
            framework.repo === repo ? framework.stars = `${starsCount} stars` : null;
            framework.repo === repo ? framework.forks = `${forksCount} forks` : null;
        })
        setup();
    })
}

const frameworks = [
    { name: 'Vue', repo: 'vuejs/vue', stars: 0, forks: 0 },
    { name: 'React', repo: 'facebook/react', stars: 0, forks: 0 },
    { name: 'Angular', repo: 'angular/angular', stars: 0, forks: 0 },
    { name: 'Svelte', repo: 'sveltejs/svelte', stars: 0, forks: 0 },
    { name: 'Backbone', repo: 'jashkenas/backbone', stars: 0, forks: 0 },
    { name: 'Ember', repo: 'emberjs/ember.js', stars: 0, forks: 0 }
]

function setup() {
    const d = new SimpleDataTable(tableWrapper , {addButtonLabel: 'New record'});

    d.load(frameworks);
    d.render();
}

const init = () => {
    frameworks.forEach(framework => getData(framework.repo));
}

window.addEventListener('DOMContentLoaded', init);