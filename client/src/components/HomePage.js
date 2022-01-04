import React, { useEffect, useState } from "react";
import { getPolls } from "../api/allPolls";
import PollList from "./PollList";
import { Pagination, Button, InputGroup, FormControl, Container, Dropdown } from "react-bootstrap"
const HomePage = () => {
    const [polls, setPolls] = useState([]);
    const [activePage, setActivePage] = useState()
    const [paginationCounter, setPaginationCounter] = useState([])
    const [error, setError] = useState("");
    const [searchBy, setSearchBy] = useState('Search By');
    const [searchAttribute, setSearchAttribute] = useState("")
    useEffect(() => {
        getPolls().then((response) => {
            if (response.error){
                setError(response.error)
                return
            }

            setError("")
            setPolls(response.polls);
            setActivePage(1);

            const n_pages = Math.ceil(response.count / 10)
            setPaginationCounter([ ...Array(n_pages).keys() ].map( i => i+1)); // [1, 2, 3, ... , n_pages]  
        });
    }, []);

    const handlePaginationClick = (number) => {
        setActivePage(number);

        getPolls(searchBy !== 'Search By' ? searchBy : null, searchAttribute, number).then((response) => {
            if (response.error){
                setError(response.error)
                return
            }

            setError("")
            setPolls(response.polls);
        })
    }
    const handleSearchButtonClicked = () => {
        if (searchAttribute !== "" && searchBy !== "Search By") {
            //call the search api
            getPolls(searchBy, searchAttribute).then((response) => {
                if (response.error){
                    setError(response.error)
                    return
                }

                setError("")
                setPolls(response.polls);
                setActivePage(1);

                const n_pages = Math.ceil(response.count / 10)
                setPaginationCounter([ ...Array(n_pages).keys() ].map( i => i+1)); // [1, 2, 3, ... , n_pages]  
            });
        }
    }
    const handleSearchBySelect = (e) => {
        setSearchBy(e)
    }
    const handleSearchAttributeChange = (e) => {
        setSearchAttribute(e.target.value)
    }

    return (
        <div>
            <Container className="w-50 mt-5">
                <InputGroup className="mb-3">
                    <Dropdown onSelect={handleSearchBySelect}>
                        <Dropdown.Toggle variant="secondary" id="searchBy">
                            {searchBy}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="title">Title</Dropdown.Item>
                            <Dropdown.Item eventKey="author">Author</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button variant="outline-secondary" id="searchButton" onClick={handleSearchButtonClicked}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
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
            <Container className="w-50 mt-5" >
                <Pagination className="justify-content-center">
                    {paginationCounter.map((number) =>
                        <Pagination.Item key={number} active={number === activePage} onClick={() => handlePaginationClick(number)}>
                            {number}
                        </Pagination.Item>,
                    )
                    }
                </Pagination>
            </Container>
            <h1 className="text-center">{error}</h1>
        </div>
    )
}

export default HomePage
