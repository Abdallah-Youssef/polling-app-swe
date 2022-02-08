import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getUserPolls } from "../api/poll";
import { getUserInfo } from "../api/user";
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

        getUserInfo(userId)
        .then((user) => {
            if (user) {
                setUser(user);
                setError("");
            }

            else setError("Failed to reach server")
        })

    }, [params.userId]);

    
    return (
        <Container className='py-5 mt-5 w-50 border border-dark rounded'>
            <h1>{error}</h1>
            {user.email ? <h1 className="display-5 text-center">{user.email}'s Profile</h1> : ""}
            
            <PollList polls={polls}/>

        </Container>

    );
}

export default Profile
