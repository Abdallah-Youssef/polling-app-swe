import React, { useEffect, useState } from 'react'
import { getVotes } from "../api/poll";
import { useParams, useNavigate } from 'react-router-dom'
import Loading from './Loading';
import ReactApexChart from 'react-apexcharts';
import { Button } from 'react-bootstrap';
import { BsArrowLeftSquare } from 'react-icons/bs'


const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [series, setSeries] = useState();
    let params = useParams();
    const navigate = useNavigate();

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



    useEffect(() => {
        const fetchVotes = async () => {
            const res = await getVotes(params.pollId);

            if (res.error) {
                alert(res.error)
                navigate("/")
            }

            console.log(res.series)
            setSeries(res.series)
            setLoading(false)
        }

        fetchVotes()
    }, [params.pollId, navigate]);





    return (
        <div className='w-75 my-3 mx-auto border border-3 border-secondary rounded'>
            <Button className="m-3" variant="dark" onClick={() => navigate("/polls/"+params.pollId)}>
                <BsArrowLeftSquare className='m-2'/>Back to Poll
            </Button>

            {loading && <center><Loading /></center>}

            <div className='m-5 p-5 border border-primary rounded'>
            {series &&<ReactApexChart options={options} series={series} type="area" height={350} />}
            </div>
        </div>
    );
};


export default Dashboard;








