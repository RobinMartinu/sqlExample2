google.charts.load('current', {packages: ['corechart', 'line']});
// google.charts.setOnLoadCallback(drawCurveTypes);
let objNakazeni = {};

function poNacteni(){

        let url = `https://onemocneni-aktualne.mzcr.cz/api/v1/covid-19/nakaza.json`;
        fetch(url).then(function (response) {
            response.text().then(function (text) {
                objNakazeni = JSON.parse(text);
                drawCurveTypes(objNakazeni);
                createTable();
            })
        });

}

function drawCurveTypes(inputData) {
    let data = new google.visualization.DataTable();
    data.addColumn('date', 'X');
    data.addColumn('number', 'Za den');
    data.addColumn('number', 'Celkem');

    let rows = [];
    for (let day of inputData) {
        if(day.pocetCelkem > 0) {
            rows.push([new Date(day.datum), day.pocetDen, day.pocetCelkem])
        }
    }
    data.addRows(rows);

    let options = {
        hAxis: {
            title: 'Den'
        },
        vAxis: {
            title: 'Počet nakažených'
        },
        series: {
            1: {curveType: 'function'}
        }
    };

    let chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

function createTable(){
    let table = new Tabulator(document.getElementById("example-table"), {
        layout:"fitColumns",
        // pagination:"local",
        // paginationSize:10,
        // paginationSizeSelector:[5, 10, 20],
        data:objNakazeni, //load data into table
        columns:[
            {title:"Datum", field:"datum", align:"center", sorter:"date", sorterParams:{format:"YYYY-M-D"},
                formatter:"datetime", formatterParams:{
                    inputFormat:"YYYY-M-D",
                    outputFormat:"D.M.YYYY"},
                headerFilter:"select", headerFilterParams:{values:true}},
            {title:"Nakažených za den", field:"pocetDen", sorter:"number", headerFilter:"select", headerFilterParams:{values:true}},
            {title:"Celkem nakažených", field:"pocetCelkem", sorter:"number"},
        ],
    });

    let cols = table.getColumns();
    table.setSort(cols[0], "desc");
}