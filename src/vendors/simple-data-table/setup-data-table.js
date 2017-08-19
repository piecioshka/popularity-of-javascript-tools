function setup() {
    const d = new SimpleDataTable(document.querySelector('#chooser'), {
        addButtonLabel: 'New record'
    });

    d.load(CHART_DATA);
    d.render();

    d.on(SimpleDataTable.EVENTS.UPDATE, (data) => {
        window.dispatchEvent(new CustomEvent('data-table:update', {
            detail: data
        }));
    });
}

window.addEventListener('DOMContentLoaded', setup);
