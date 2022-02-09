import React, { useState, useEffect } from 'react'
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { getPoll, submitChoice, closePoll } from "../api/poll";
import { ListGroup, Badge, Container, Row, Col, Image, Button } from "react-bootstrap";
import { Doughnut } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto'
import { randomColor } from 'randomcolor'
import Loading from './Loading';
import ShareBar from './ShareBar';
import { UserContext } from "../reducers/user";
import { useContext } from "react";

const Poll = () => {
    const [poll, setPoll] = useState({});
    const [author, setAuthor] = useState({})
    const [error, setError] = useState("");
    const [chartData, setChartData] = useState({})
    const [loading, setLoading] = useState(true);
    const {user} = useContext(UserContext)
    let params = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {        
        const fetchPoll = async () => {
            setLoading(true);
            const { poll, author } = await getPoll(params.pollId);

            if (poll) {
                setPoll(poll);
                setAuthor(author)
                populateChartData(poll)
                setError("");
                setLoading(false)
            }
            else {
                setError("Failed to reach server") 
                alert(error)
            }
        }

        fetchPoll()
    }, [params.pollId]);

    const populateChartData = (poll) => {
        const chartDataFiller = {
            labels: poll.choices.map(x => x.text),
            datasets : [
                {
                    data: poll.choices.map(x => x.count),
                    label: "Poll Results",
                    fill: true,
                    backgroundColor: randomColor({
                        count: poll.choices.length,
                    })
                }   
            ]
        }
        console.log("chartDataFiller->",chartDataFiller)
        setChartData(chartDataFiller);
    };

    const vote = async (index) => {
        console.log(index + " - " + poll.voted)

        let newPoll = Object.assign({}, poll);
        
        /**
         * Wow, the front-end and the back-end have totally different ideas
         * of what "public" means in this request
         */
        let changing = poll.voted !== undefined;
        let status = await submitChoice(poll._id, 
                                        index,
                                        poll.public,
                                        changing);
        console.log(status)
        if (status) {
            if (changing){
                newPoll.choices[newPoll.voted].count--;
            }
        
            newPoll.voted = index;
            newPoll.choices[index].count++;
            setPoll(newPoll)
            populateChartData(poll)
        }

        else {
            alert("voting failed")
        }
    }

    const handleDashboardClicked = () =>  navigate(location.pathname + "/dashboard")
    const handleStopVotingClicked = () => {
        let newPoll = Object.assign({}, poll);
        newPoll['closed'] = true;
        setPoll(newPoll);
        closePoll(poll['_id']);
    }

    return (
        <Container className='py-3 mt-5 w-50 border border-dark rounded'>
            {
                poll.question ?
                    <>
                        <h1>{error}</h1>


                        <h1 className='display-2 text-center'> {poll.question}  </h1>

                        <div id="poll-info" className='text-center'>
                            Posted on: {poll.createdOn}
                            <br />
                            {poll.public ? "Public" : "Private"}
                            <br />
                            Author:&nbsp;  
                            <Link to={`/user/${author.id}`}>
                                <h5 className='d-inline opacity-50'>{author.email}</h5>
                            </Link>
                            
                            <br/>
                            {
                                user.id === author.id &&
                                <Button variant="info" onClick={handleDashboardClicked}>
                                    Dashboard
                                </Button>
                            }
                            {
                                user.id === author.id && !poll["closed"] &&
                                <Button variant="danger" onClick={handleStopVotingClicked}>
                                    Close Poll
                                </Button>
                            }

                        </div>



                        <br></br>
                        <ListGroup as="ul" numbered>
                            {
                                poll["choices"] && !poll["closed"] &&
                                poll["choices"].map((choice, i) => (
                                    <ListGroup.Item
                                        className="clearfix"
                                        key={i}
                                        onClick={(e) => vote(i)}
                                        style={cursorPointer}
                                    >

                                        <Container>
                                            <Row>
                                                <Col sm={8}>{choice.text}</Col>
                                                <Col sm={4}>
                                                    <Choice
                                                        isVoted={(poll.voted === i)}
                                                        voteCount={choice.count}
                                                    />
                                                </Col>
                                            </Row>
                                        </Container>


                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                        {poll.photo &&

                            <div className='w-100 d-flex flex-column justify-content-center my-3'>    
                                 <Image src={poll.photo} fluid rounded />
                            </div>
                         
                         }

                        <hr/>
                        <ShareBar content={poll.question}/>
                        <hr/>
                        <div>


                            <center>
                                {
                                    loading ?
                                    <Loading> </Loading> 
                                    :
                                    <h3>   
                                        total votes: {chartData['datasets'][0]['data'].reduce((a,b) => a + b, 0)}
                                    </h3>
                                }
                            </center>

                            {

                            loading ?
                            <Loading> </Loading> 
                             :
                            <Doughnut data={chartData} 
                            options={{
                                plugins: {
                                    title: {
                                        display: true,
                                        text: "Poll Doghnut Chart"
                                    },
                                    legend: {
                                        display: true,
                                        position: "bottom"
                                    }
                                }
                            }}
                            />
                            
                            }
                        </div>
                        
                        </>
                        

                    :
                    <Loading />
            }
        </Container>
    )
}

const Choice = (props) => {
    const isVoted = props.isVoted;
    const voteCount = props.voteCount;

    if (isVoted) {
        return (
            <span style={alignRight} >
                <Badge className="" bg="success" pill>
                    {voteCount}
                </Badge>
            </span>
        )
    }

    else {
        return (
            <span style={alignRight} >
                <Badge className="" bg="primary" pill>
                    {voteCount}
                </Badge>
            </span>
        )
    }
}


const alignRight = {
    float: 'right',
};

const cursorPointer = {
    cursor: "pointer"
}

export default Poll