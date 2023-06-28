
const serverStatus = () => {
    return {
        state: 'up',
    }
};


const generateYearsBetween = (startDate = "2010-01-01", endDate) => {

    let endYear =  new Date(endDate).getFullYear() || new Date().getFullYear();
    let startYear = new Date(startDate).getFullYear();

    let years = [];

    for (var i = startYear; i <= endYear; i++) {

      years.push(startYear);

      startYear++;

    }

    return years;
}


module.exports = { serverStatus, generateYearsBetween }