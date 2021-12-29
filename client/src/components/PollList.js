import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAllPolls } from "../api/allPolls";
import { ListGroup, Badge, Container } from "react-bootstrap";

const PollList = () => {
    const [polls, setPolls] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getAllPolls().then((polls) => {
            if (polls) {
                setPolls(polls);
                setError("");
            }

            else setError("Failed to reach server")
        });
    }, []);

    
    return (
        <Container className="w-50 mt-5">

            <h1>{error}</h1>

            <ListGroup as="ul" numbered>
                {polls.map((poll, i) => (
                    <ListGroup.Item
                        className="d-flex justify-content-between align-items-start"
                        key={i}
                    >
                       
                       <Link style={pollStyle} className = "poll ms-2 me-auto"
                            style={{ display: "block", margin: "1rem 0" }}
                            to={`/polls/${poll._id}`}
                            key={poll._id}
                        >
                            <span className="fw-bold">{poll.question}</span>
                        </Link>
                       
                    </ListGroup.Item>
                ))}
            </ListGroup>


        </Container>
    );
};

const pollStyle = {
    "text-decoration": "none", 
    color: "red"
}

export default PollList;
