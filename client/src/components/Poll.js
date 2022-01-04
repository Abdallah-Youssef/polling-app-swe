import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPoll, submitChoice } from "../api/poll";
import { ListGroup, Badge, Container, Row, Col } from "react-bootstrap";
import Loading from './Loading';
import ShareBar from './ShareBar';
const Poll = () => {
    const [poll, setPoll] = useState({});
    const [author, setAuthor] = useState({})
    const [error, setError] = useState("");
    let params = useParams();



    useEffect(() => {
        const fetchPoll = async () => {
            const { poll, author } = await getPoll(params.pollId);

            if (poll) {
                setPoll(poll);
                setAuthor(author)
                setError("");
            }
            else setError("Failed to reach server")
        }

        fetchPoll()
    }, [params.pollId]);



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
        }

        else {
            alert("voting failed")
        }
    }

    return (
        <Container className='py-3 mt-5 w-50 border border-dark rounded'>
            {
                poll.question ?
                    <>
                        <h1>{error}</h1>


                        <h1 className='display-2 text-center'> {poll.question}  </h1>

                        <div className='text-center'>
                            Posted on: {poll.createdOn}
                            <br />
                            Author:&nbsp;  
                            <Link to={`/user/${author.id}`}>
                                <h5 className='d-inline opacity-50'>{author.email}</h5>
                            </Link>
                        </div>



                        <br></br>
                        <ListGroup as="ul" numbered>
                            {
                                poll["choices"] &&
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
                        {poll.photo && <img src={poll.photo} width='300px' />}
                        <ShareBar content={poll.question}/>
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
            <span style={alignRight} className="float-right">
                <Badge className="" bg="success" pill>
                    {voteCount}
                </Badge>
            </span>
        )
    }

    else {
        return (
            <span style={alignRight} className="float-right">
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
