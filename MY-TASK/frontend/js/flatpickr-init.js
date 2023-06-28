import { updateChartEvent } from './init-load-event.js';

flatpickr('.datepicker', {
  mode: 'range',
  static: true,
  monthSelectorType: 'static',
  dateFormat: 'Y',
  defaultDate: [new Date().setDate(new Date().getDate() - 6), new Date()],
  prevArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
  nextArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
  onReady: (selectedDates, dateStr, instance) => {
    // eslint-disable-next-line no-param-reassign
    instance.element.value = dateStr.replace('to', '-');
    instance.element.value = "2010 - 2020";
    const customClass = instance.element.getAttribute('data-class');
    instance.calendarContainer.classList.add(customClass);
  },
  onChange: (selectedDates, dateStr, instance) => {
    // eslint-disable-next-line no-param-reassign
    instance.element.value = dateStr.replace('to', '-');
    let dateValue = instance.element.value.trim();

    if (dateValue.includes('-')) {
      let datesList = dateValue.split('-');
      let startYr = datesList[0].trim();
      let endYr = datesList[1].trim();

      if (instance.element.id === "chart-01-picker") {
        // updating Population chart on date range change
        updateChartEvent('population', startYr, endYr);
      }
      else if (instance.element.id === "chart-02-picker") {
        // updating GDP chart on date range change
        updateChartEvent('gdp', startYr, endYr);

      }

    }

  },
});