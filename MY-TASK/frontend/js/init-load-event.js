import { updateChart, initChart } from './chart-init.js';
import { setTableData } from './table-init.js';


//initialize population chart
let populationChart = await initChart('population', true);

//initialize gdp chart
let gdpChart = await initChart('gdp');


await setTableData("Mexico");

let updateChartEvent = async (indicator, start, end) => {

    if (indicator === 'gdp') 
        await updateChart(gdpChart, indicator, start, end);

    else if (indicator === 'population')
    await updateChart(populationChart, indicator, start, end);

}

export { updateChartEvent };