function factoryChartSettings(data) {
    return {
        type: 'doughnut',
        data: {
            datasets: [
                {
                    data: pick(data, 'value'),
                    backgroundColor: pick(data, 'backgroundColor')
                }
            ],
            labels: buildLabels(data)
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

function sum(collection) {
    return collection.reduce((mem, item) => mem += item, 0);
}

function pick(data, property) {
    return data.map((item) => item[property]);
}

function toPercent(value, total) {
    return (value / total * 100).toFixed(1);
}

function buildLabels(data) {
    const values = pick(data, 'value');
    const mem = sum(values);
    return data.map((x) => `${x.label} - ${toPercent(x.value, mem)}%`);
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
