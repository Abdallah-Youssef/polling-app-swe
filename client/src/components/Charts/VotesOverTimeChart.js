import React from 'react';
import ReactApexChart from 'react-apexcharts';

const VotesOverTimeChart = ({series}) => {
    const options = {
        chart: {
            type: 'area',
            stacked: false,
            height: 350,
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: 'zoom'
            }
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
        },
        title: {
            text: 'Votes',
            align: 'center'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100]
            },
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return (val).toFixed(0);
                },
            },
            title: {
                text: 'Votes'
            },
        },
        xaxis: {
            type: 'datetime',
        },
    }

    return <div>
        <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>;
};

export default VotesOverTimeChart;
