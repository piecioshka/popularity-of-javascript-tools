function factoryChartSettings(data) {
    return {
        type: 'doughnut',
        data: {
            datasets: [
                {
                    data: data.map(x => x.value),
                    backgroundColor: data.map(x => x.backgroundColor)
                }
            ],
            labels: data.map(x => `${x.label} - ${countPercent(x.value)}%`)
        },
        options: {
            responsive: true
        }
    };
}

window.addEventListener('data-table:update', (data) => {
    const settings = factoryChartSettings(data.detail);
    createChart(settings);
});

function sumValues() {
    return CHART_DATA.reduce((sum, nextElement) => sum += nextElement.value, 0)
}

function countPercent(value) {
    return (value / sumValues() * 100).toFixed(1);
}

function createChart(settings) {
    const $root = document.querySelector('#chart-area');
    const ctx = $root.getContext('2d');
    return new Chart(ctx, settings);
}

function setup() {
    const settings = factoryChartSettings(CHART_DATA);
    return createChart(settings);
}

window.addEventListener('DOMContentLoaded', setup);
