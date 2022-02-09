import React, { useEffect, useState } from 'react'
import { getInsights } from "../api/poll";
import { useParams, useNavigate } from 'react-router-dom'
import Loading from './Loading';
import { Button } from 'react-bootstrap';
import { BsArrowLeftSquare } from 'react-icons/bs'
import GenderChart from './Charts/GenderChart';
import VotesOverTimeChart from './Charts/VotesOverTimeChart';
import AgeHistogram from './Charts/AgeHistogram';
import { Accordion } from 'react-bootstrap';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState();

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
            const res = await getInsights(params.pollId);

            if (res.error) {
                alert(res.error)
                navigate("/")
            }

            setInsights(res)
            setLoading(false)
        }

        fetchVotes()
    }, [params.pollId, navigate]);





    return (
        <div className='w-75 my-3 mx-auto border border-3 border-secondary rounded'>
            <Button className="m-3" variant="dark" onClick={() => navigate("/polls/" + params.pollId)}>
                <BsArrowLeftSquare className='m-2' />Back to Poll
            </Button>

            {loading && <center><Loading /></center>}

            <div className='m-5 p-5 border border-primary rounded'>




                {insights && <>

                    <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen={true}>
                        <Accordion.Item eventKey="0" >
                            <Accordion.Header>Age Distribution</Accordion.Header>
                            <Accordion.Body>
                                <AgeHistogram series={insights.age} />
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Gender Distributios</Accordion.Header>
                            <Accordion.Body>
                                <GenderChart series={insights.gender} options={insights.options} />
                            </Accordion.Body>
                        </Accordion.Item>


                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Vote History</Accordion.Header>
                            <Accordion.Body>
                                <VotesOverTimeChart series={insights.voteHistory} />
                            </Accordion.Body>
                        </Accordion.Item>

                    </Accordion>


                </>}
            </div>
        </div>
    );
};


export default Dashboard;








