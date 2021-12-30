import React, { useEffect, useState } from "react";
import { getAllPolls } from "../api/allPolls";
import PollList from "./PollList";

const HomePage = () => {
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
        <div>
            <PollList polls={polls}/>
            <h1>{error}</h1>
        </div>
    )
}

export default HomePage
