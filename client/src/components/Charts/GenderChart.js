import React from 'react';
import ReactApexChart from 'react-apexcharts';

const GenderChart = ({ poll, series }) => {

    const mockGenderData = [{
        name: 'Male',
        data: [44, 55]
    }, {
        name: 'Female',
        data: [13, 23]
    }]

    const options = {
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
                categories: ["Option 1", "Option 2"],
            },
            legend: {
                position: 'right',
                offsetY: 40
            },
            fill: {
                opacity: 1
            }
    }
      


return (<div>
    <ReactApexChart options={options} series={mockGenderData} type="bar" height={350} />

</div>);
};

export default GenderChart;
