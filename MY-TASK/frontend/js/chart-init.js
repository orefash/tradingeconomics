// Utility functions
const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

const formatValue = (value) => Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 3,
  // notation: 'compact',
}).format(value);

// Define Chart.js default settings
Chart.defaults.font.family = '"Inter", sans-serif';
Chart.defaults.font.weight = '500';
Chart.defaults.color = '#94a3b8';
Chart.defaults.scale.grid.color = '#f1f5f9';
Chart.defaults.plugins.tooltip.titleColor = '#1e293b';
Chart.defaults.plugins.tooltip.bodyColor = '#1e293b';
Chart.defaults.plugins.tooltip.backgroundColor = '#ffffff';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.borderColor = '#e2e8f0';
Chart.defaults.plugins.tooltip.displayColors = false;
Chart.defaults.plugins.tooltip.mode = 'nearest';
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.plugins.tooltip.position = 'nearest';
Chart.defaults.plugins.tooltip.caretSize = 0;
Chart.defaults.plugins.tooltip.caretPadding = 20;
Chart.defaults.plugins.tooltip.cornerRadius = 4;
Chart.defaults.plugins.tooltip.padding = 8;

const graphColors = [
  {
    backgroundColor: '#E0BBE4',
    hoverBackgroundColor: '#957DAD',
  },
  {
    backgroundColor: '#AFE6FA',
    hoverBackgroundColor: '#AAD6FA',
  },
  {
    backgroundColor: '#eae1d8',
    hoverBackgroundColor: '#bcbfc0',
  },
  {
    backgroundColor: '#E9EFF3',
    hoverBackgroundColor: '#ADD5DD',
  }
]

// export function testFn(){
//   console.log("testing")
// }

let gdpChart = null;
let populationChart = null;

const baseUrl = "https://us-central1-te-fash.cloudfunctions.net/app";

async function getTEData({ indicator, startYear = 2010, endYear = 2020, delay = false }) {

  try {

    if (delay) {
      // Add a one-second delay using setTimeout
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const response = await fetch(`${baseUrl}/api/fetchChartData/${indicator}?startYear=${startYear}&endYear=${endYear}`);
    // const response = await fetch("http://localhost:3050/api/fetchChartData/"+indicator);

    if (response.status !== 200) return null;

    const data = await response.json();

    if (!data.data.yearList && !data.data.countryData) return null;

    return data.data;
  } catch (error) {
    console.log("fetch data error: ", error);
    return null;
  }

}

// getTEData('gdp');

async function initChart(indicator, delay = false) {

  const chartData = await getTEData({ indicator, delay });

  if (!chartData) return null

  let yrList = chartData.yearList;
  let countryData = chartData.countryData;

  if (indicator === 'population')
    return dataCard01(yrList, countryData);
  else if (indicator === 'gdp')
    return dataCard02(yrList, countryData);
}

async function updateChart(chart, indicator, startYear, endYear) {

  const chartData = await getTEData({ indicator, startYear, endYear });

  if (!chartData) return null

  let yrList = chartData.yearList;
  let countryData = chartData.countryData;

  // if (indicator === 'gdp') {
  //   gdpChart.data.labels = yrList;
  //   gdpChart.data.datasets = Object.keys(countryData).map((c, i) => {
  //     return {
  //       label: c,
  //       data: countryData[c],
  //       ...graphColors[i],
  //       barPercentage: 0.66,
  //       categoryPercentage: 0.66,
  //     }
  //   })
  //   gdpChart.update();
  // }
  // else if (indicator === 'population') {
  //   populationChart.data.labels = yrList;
  //   populationChart.data.datasets = Object.keys(countryData).map((c, i) => {
  //     return {
  //       label: c,
  //       data: countryData[c],
  //       ...graphColors[i],
  //       barPercentage: 0.66,
  //       categoryPercentage: 0.66,
  //     }
  //   })
  //   populationChart.update();
  // }

  chart.data.labels = yrList;
  chart.data.datasets = Object.keys(countryData).map((c, i) => {
    return {
      label: c,
      data: countryData[c],
      ...graphColors[i],
      barPercentage: 0.66,
      categoryPercentage: 0.66,
    }
  })
  chart.update();
}

//Population Chart setup
const dataCard01 = (yrList, countryData) => {
  const ctx = document.getElementById('dash-chart-01');
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: yrList,
      datasets: Object.keys(countryData).map((c, i) => {
        return {
          label: c,
          data: countryData[c],
          ...graphColors[i],
          barPercentage: 0.66,
          categoryPercentage: 0.66,
        }
      })
    },
    options: {
      layout: {
        padding: {
          top: 12,
          bottom: 20,
          left: 20,
          right: 20,
        },
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
          },
          ticks: {
            maxTicksLimit: 5,
            // callback: (value) => formatValue(value),
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        htmlLegend: {
          // ID of the container to put the legend in
          containerID: 'chart-01-legend',
        },
        tooltip: {
          callbacks: {
            title: () => false, // Disable tooltip title
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      animation: {
        duration: 200,
      },
      maintainAspectRatio: false,
    },
    plugins: [{
      id: 'htmlLegend',
      afterUpdate(c, args, options) {
        const legendContainer = document.getElementById(options.containerID);
        const ul = legendContainer.querySelector('ul');
        if (!ul) return;
        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }
        // Reuse the built-in legendItems generator
        const items = c.options.plugins.legend.labels.generateLabels(c);
        items.forEach((item) => {
          const li = document.createElement('li');
          li.style.marginRight = '16px';
          // Button element
          const button = document.createElement('button');
          button.style.display = 'inline-flex';
          button.style.alignItems = 'center';
          button.style.opacity = item.hidden ? '.3' : '';
          button.onclick = () => {
            c.setDatasetVisibility(item.datasetIndex, !c.isDatasetVisible(item.datasetIndex));
            c.update();
          };
          // Color box
          const box = document.createElement('span');
          box.style.display = 'block';
          box.style.width = '12px';
          box.style.height = '12px';
          box.style.borderRadius = '9999px';
          box.style.marginRight = '8px';
          box.style.borderWidth = '3px';
          box.style.borderColor = item.fillStyle;
          box.style.pointerEvents = 'none';
          // Label
          const label = document.createElement('span');
          label.style.color = '#64748b';
          label.style.fontSize = '0.875rem';
          label.style.lineHeight = '1.5715';
          const labelText = document.createTextNode(item.text);
          label.appendChild(labelText);
          li.appendChild(button);
          button.appendChild(box);
          button.appendChild(label);
          ul.appendChild(li);
        });
      },
    }],
  });

  return chart;
};


//GDP Chart setup
const dataCard02 = (yrList, countryData) => {
  const ctx = document.getElementById('dash-chart-02');
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: yrList,
      datasets: Object.keys(countryData).map((c, i) => {
        return {
          label: c,
          data: countryData[c],
          ...graphColors[i],
          barPercentage: 0.66,
          categoryPercentage: 0.66,
        }
      })
    },
    options: {
      layout: {
        padding: {
          top: 12,
          bottom: 16,
          left: 20,
          right: 20,
        },
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
          },
          ticks: {
            maxTicksLimit: 5,
            callback: (value) => formatValue(value),
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        htmlLegend: {
          // ID of the container to put the legend in
          containerID: 'chart-02-legend',
        },
        tooltip: {
          callbacks: {
            title: () => false, // Disable tooltip title
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      animation: {
        duration: 200,
      },
      maintainAspectRatio: false,
    },
    plugins: [{
      id: 'htmlLegend',
      afterUpdate(c, args, options) {
        const legendContainer = document.getElementById(options.containerID);
        const ul = legendContainer.querySelector('ul');
        if (!ul) return;
        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }
        // Reuse the built-in legendItems generator
        const items = c.options.plugins.legend.labels.generateLabels(c);
        items.forEach((item) => {
          const li = document.createElement('li');
          li.style.marginRight = '16px';
          // Button element
          const button = document.createElement('button');
          button.style.display = 'inline-flex';
          button.style.alignItems = 'center';
          button.style.opacity = item.hidden ? '.3' : '';
          button.onclick = () => {
            c.setDatasetVisibility(item.datasetIndex, !c.isDatasetVisible(item.datasetIndex));
            c.update();
          };
          // Color box
          const box = document.createElement('span');
          box.style.display = 'block';
          box.style.width = '12px';
          box.style.height = '12px';
          box.style.borderRadius = '9999px';
          box.style.marginRight = '8px';
          box.style.borderWidth = '3px';
          box.style.borderColor = item.fillStyle;
          box.style.pointerEvents = 'none';
          // Label
          const label = document.createElement('span');
          label.style.color = '#64748b';
          label.style.fontSize = '0.875rem';
          label.style.lineHeight = '1.5715';
          const labelText = document.createTextNode(item.text);
          label.appendChild(labelText);
          li.appendChild(button);
          button.appendChild(box);
          button.appendChild(label);
          ul.appendChild(li);
        });
      },
    }],
  });

  return chart;
};


//initialize gdp chart
// gdpChart = await initChart('gdp');

//initialize population chart
// populationChart = await initChart('population');


export { updateChart, initChart };