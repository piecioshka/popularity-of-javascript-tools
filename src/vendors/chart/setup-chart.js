function factoryChartSettings(data) {
    return {
        type: 'doughnut',
        data: {
            datasets: [
                {
                    data: mapValues(data),
                    backgroundColor: data.map(x => x.backgroundColor)
                }
            ],
            labels: setupLabels(data)
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

function sumValues(arrayOfValues) {
    return arrayOfValues.reduce((mem, item) => mem += item, 0);
}

function mapValues(data) {
    return data.map((item) => item.value);
}

function setupLabels(data) {
    const arrayOfValues = mapValues(data);
    const mem = sumValues(arrayOfValues);
    return data.map((x) => `${x.label} - ${countPercent(x.value, mem)}%`);
}

function countPercent(value, totalValue) {
    return (value / totalValue * 100).toFixed(1);
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
