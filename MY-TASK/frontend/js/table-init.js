
let selectedCountry = "Mexico";

//keep only one country select checkbox selected at a time
function onlyOne(checkbox) {
    var checkboxes = document.getElementsByName('country-select')
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
    })
}

var countryChangeBoxes = document.getElementsByName('country-select');
countryChangeBoxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function (event) {

        if (checkbox.checked){
            selectedCountry = checkbox.value;
            onlyOne(checkbox)
        }
    })
});

let applyBtn = document.getElementById('country-apply-btn');
applyBtn.addEventListener('click',async function (event) {
    await setTableData(selectedCountry);
    
})


document.getElementById('mexico-check').checked = true;
document.getElementById('nz-check').checked = false;
document.getElementById('thailand-check').checked = false;
document.getElementById('sweden-check').checked = false;



const baseUrl = "http://localhost:3050";

// async function getTableData(country, startYear = 2010, endYear = 2020) {
async function getTableData(country, startYear, endYear, delay = false) {

    try {

        if (delay) {
            // Add a one-second delay using setTimeout
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        const response = await fetch(`${baseUrl}/api/fetchTableData/${country}?startYear=${startYear}&endYear=${endYear}`);
        // const response = await fetch("http://localhost:3050/api/fetchChartData/"+indicator);
        console.log(response);

        if (response.status !== 200) return null;

        const data = await response.json();

        if (!data.data) return null;

        return data.data;
    } catch (error) {
        console.log("fetch table data error: ", error);
        return null;
    }

}


async function setTableData(country, startYear = 2010, endYear = 2020) {

    const tableData = await getTableData(country, startYear, endYear);

    console.log('rc d: ', tableData)

    if (!tableData) return null

    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; // Clear the table body

    // Generate new rows based on the new data
    tableData.forEach(dataItem => {
        // console.log('rc dtem: ', dataItem)
        const newRow = document.createElement('tr');

        const countryCell = document.createElement('td');
        countryCell.className = 'p-2 whitespace-nowrap';
        countryCell.innerHTML = `<div class="flex items-center"><div class="font-medium text-slate-800">${dataItem.country}</div></div>`;
        newRow.appendChild(countryCell);

        const yearCell = document.createElement('td');
        yearCell.className = 'p-2 whitespace-nowrap';
        yearCell.textContent = dataItem.year;
        newRow.appendChild(yearCell);

        const gdpCell = document.createElement('td');
        gdpCell.className = 'p-2 whitespace-nowrap';
        gdpCell.innerHTML = `<div class="font-semibold text-slate-800 text-right">${dataItem.gdp}</div>`;
        newRow.appendChild(gdpCell);

        const populationCell = document.createElement('td');
        populationCell.className = 'p-2 whitespace-nowrap';
        populationCell.innerHTML = `<div class="font-medium text-slate-800 text-right">${dataItem.population}</div>`;
        newRow.appendChild(populationCell);

        tableBody.appendChild(newRow);
    });


}

// await setTableData("Thailand", false);

export { setTableData, };
