import { Chart, ChartItem, registerables } from 'chart.js';
Chart.register(...registerables);

export const drawBarChart = function (canvas: ChartItem, labelsForData: string[], dataValues: number[]) {
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labelsForData,
            datasets: [
                {
                    label: 'Изученные слова',
                    data: dataValues,
                    backgroundColor: 'rgba(164, 18, 104, 1)',
                    borderColor: ['rgba(164, 18, 104, 1)'],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Кол-во слов',
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Период изучения',
                    },
                },
            },
        },
    });
};

export const drawLineChart = function (canvas: ChartItem, labelsForData: string[], dataValues: number[]) {
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: labelsForData,
            datasets: [
                {
                    label: 'Новые слова',
                    data: dataValues,
                    backgroundColor: 'rgba(164, 18, 104, 1)',
                    borderColor: ['rgba(164, 18, 104, 1)'],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Кол-во слов',
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Период изучения',
                    },
                },
            },
        },
    });
};
