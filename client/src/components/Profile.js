import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getUserPolls } from "../api/poll";
import { getMyPolls } from "../api/user";
import PollList from "./PollList";


const Profile = () => {
    const [polls, setPolls] = useState([]);
    const [user, setUser] = useState({})
    const [error, setError] = useState("");
    const params = useParams();

    useEffect(() => {
        const userId = params.userId
        
        getUserPolls(userId)
        .then((polls) => {
            if (polls) {
                setPolls(polls);
                setError("");
            }

            else setError("Failed to reach server")
        });

        
    }, []);

    
    return (
        <Container>
            <h1>{error}</h1>
            <h1 className="display-1">Profile</h1>
            <PollList polls={polls}/>

        </Container>

    );
}

export default Profile
