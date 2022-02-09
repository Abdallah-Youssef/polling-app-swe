import React from 'react';
import ReactApexChart from 'react-apexcharts';

const GenderChart = ({ series, options }) => {

    const mockGenderData = [{
        name: 'Male',
        data: [44, 55]
    }, {
        name: 'Female',
        data: [13, 23]
    }]


    const chartOptions = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 10
            },
        },
        xaxis: {
            // TODO replace with poll options
            categories: options,
        },
        legend: {
            position: 'right',
            offsetY: 40
        },
        fill: {
            opacity: 1
        },
        title: {
            text: 'Gender Distribution',
            floating: true,
            offsetY: 330,
            align: 'center',
            style: {
                color: '#444'
            }
        }
    }



    return (<div>
        <ReactApexChart options={chartOptions} series={series} type="bar" height={350} />

    </div>);
};

export default GenderChart;
