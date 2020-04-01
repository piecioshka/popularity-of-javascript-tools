const APIurl = 'https://api.github.com/repos/';

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
        let i = 0;

        frameworks.forEach(framework => {
            framework.repo === repo ? framework.stars = starsCount : null;
            framework.repo === repo ? framework.forks = forksCount : null;

            repoStarsList[i].textContent = framework.stars;
            repoForksList[i].textContent = framework.forks;
            i++;
        })
    })
}

const repoStarsList = [...document.querySelectorAll('.repo-stars')];
const repoForksList = [...document.querySelectorAll('.repo-forks')];

const frameworks = [
    { name: 'Vue', repo: 'vuejs/vue', stars: 0, forks: 0 },
    { name: 'React', repo: 'facebook/react', stars: 0, forks: 0 },
    { name: 'Angular', repo: 'angular/angular', stars: 0, forks: 0 },
    { name: 'Svelte', repo: 'sveltejs/svelte', stars: 0, forks: 0 },
    { name: 'Backbone', repo: 'jashkenas/backbone', stars: 0, forks: 0 },
    { name: 'Ember', repo: 'emberjs/ember.js', stars: 0, forks: 0 }
]

const init = () => {
    frameworks.forEach(framework => getData(framework.repo));
}

window.addEventListener('DOMContentLoaded', init);