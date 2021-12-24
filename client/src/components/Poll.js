import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPoll, submitChoice } from "../api/poll";
import { ListGroup, Badge, Container, Row, Col } from "react-bootstrap";

const Poll = () => {
    const [poll, setPoll] = useState({});
    const [error, setError] = useState("");
    let params = useParams();

 
    useEffect(async () => {    
        console.log(params.pollId);
        console.log(localStorage.getItem("token"));
        const poll = await getPoll(params.pollId); 
        console.log("new poll", poll) 
        if (poll) {
            setPoll(poll); 
            setError("");
        }

        else setError("Failed to reach server") 

    }, []);

    const vote = async (index) => {
        console.log(index + " - " + poll.voted)
        if(poll.voted != undefined) {
            alert("you have alrady voted!")
            return ;
        }
        
        let newPoll = Object.assign({}, poll);
        newPoll.voted = index;

        let status = await submitChoice(poll._id, index, poll.public);
        console.log(status)
        if(status) {
            newPoll.voted = index;
            newPoll.choices[index].count++;
            setPoll(newPoll)
        }

        else {
            alert("voting failed")
        }
    }

    return (
        <Container className='py-5 mt-5 w-50 border border-dark rounded'>
            <h2> {poll.question}  </h2>
            <br></br>
            <ListGroup as="ul" numbered>
                {
                poll["choices"] && 
                poll["choices"].map((choice, i) => (
                    <ListGroup.Item
                        className="clearfix"
                        key={i}
                        onClick ={(e) => vote(i)}
                        style={cursorPointer}
                    > 

                <Container>
                    <Row>
                        <Col sm={8}>{choice.text}</Col>
                        <Col sm={4}>
                            <Choice
                                isVoted={(poll.voted == i)}
                                voteCount={choice.count}
                            /> 
                        </Col>
                    </Row>
                </Container>
                                    
                        
                    </ListGroup.Item>
                )) 
                }
            </ListGroup>
        </Container>
    )
}

const Choice = (props) => {
    const isVoted = props.isVoted;
    const voteCount = props.voteCount;  
    
    if(isVoted) {
        return (
            <span style={alignRight} class="float-right">
                <Badge className="" bg="success" pill>
                    {voteCount}
                </Badge>
            </span>   
        )
    }

    else {
        return (
            <span style={alignRight} class="float-right">
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
