import React, { useEffect, useState } from "react";
import { getAllPolls } from "../api/allPolls";
import PollList from "./PollList";
import { Button, InputGroup, FormControl, Container, Dropdown } from "react-bootstrap"
const HomePage = () => {
    const [polls, setPolls] = useState([]);
    const [error, setError] = useState("");
    const [searchBy, setSearchBy] = useState('Search By');
    const [searchAttribute, setSearchAttribute] = useState("")
    useEffect(() => {
        getAllPolls().then((polls) => {
            if (polls) {
                setPolls(polls);
                setError("");
            }

            else setError("Failed to reach server")
        });
    }, []);
    const handleSearchButtonClicked=()=>{
        if(searchAttribute!==""&& searchBy!=="Search By"){
            //call the search api
        }
    }
    const handleSearchBySelect = (e) => {
        setSearchBy(e)
    }
    const handleSearchAttributeChange = (e)=>{
        setSearchAttribute(e.target.value)
    }

    return (

        <div>
            <Container className="w-50 mt-5">
                <InputGroup className="mb-3">
                    <Dropdown onSelect={handleSearchBySelect}>
                        <Dropdown.Toggle variant="secondary" id="searchBy"  >
                            {searchBy}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="Title">Title</Dropdown.Item>
                            <Dropdown.Item eventKey="Author">Author</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button variant="outline-secondary" id="searchButton" onClick={handleSearchButtonClicked}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </Button>
                    <FormControl
                        placeholder="Search"
                        onChange={handleSearchAttributeChange}
                    />
                </InputGroup>
            </Container>
            <PollList polls={polls} />
            <h1>{error}</h1>
        </div>
    )
}

export default HomePage
