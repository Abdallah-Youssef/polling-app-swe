import React, { useState, useEffect } from 'react'
import { CloseButton, Form, Row, Col, Container, Button, FormGroup, FormControl } from "react-bootstrap"
import { useNavigate } from 'react-router-dom'
import { createPoll } from '../api/poll'

const CreatePoll = () => {
    const navigate = useNavigate()
    const [options, setOptions] = useState([])
    const [title, setTitle] = useState("")
    const [Private, setPrivate] = useState(false)
    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
    const handleOptionChange = (event, index) => {
        setOptions(options.map((option, i) => i === index ? event.target.value : option))
    }
    const handleAddOptionClick = () => {
        setOptions([...options, ""])
    }
    const handleDeleteOptionClick = (index) => {
        options.splice(index, 1)
        setOptions([...options])
    }
    const handlePrivateCheckBoxChange = (event) => {
        setPrivate(event.target.checked)
    }

    const handleCreateClicked = async (event) => {
        event.preventDefault()
        await createPoll(title, Private, options)
        navigate('/')
    }


    const [validData, setValidData] = useState(false)
    useEffect(() => {
        setValidData(checkValidData())
    }, [title, options])

    const checkValidData = () => {
        if (title.trim() === "" || options.length < 2)
            return false;

        for (let i = 0; i < options.length; i++) {
            if (options[i].trim() === "") 
                return false
        }

        return true;
    }

    return (
        <>
            <h1 className="display-5 w-100 text-center my-4">Create Poll</h1>

            <Container className="py-5 mt-5 w-50 border border-dark rounded">
                <Form className="w-75 mx-auto">


                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            onChange={handleTitleChange}
                            type="text"
                            placeholder="My Poll"
                            isInvalid={title.trim() === ""}
                        />
                        <FormControl.Feedback type='invalid'>
                            <ul>
                                <li>Enter poll title</li>
                            </ul>
                        </FormControl.Feedback>
                    </Form.Group>


                    <FormGroup>
                        <Form.Check
                            type='checkbox'
                            id={`privateCheck`}
                            label={`Private`}
                            onChange={handlePrivateCheckBoxChange}
                            className='my-3 mx-auto'
                        />
                    </FormGroup>

                    <hr></hr>

                    <Form.Group className="mb-3">
                        <Form.Label className='mx-3'><h4>Options</h4></Form.Label>

                        {
                            options.map((option, i) =>
                                <Row className='my-3' key={i}>
                                    <Col>
                                        <Form.Control type="text"
                                            value={options[i]}
                                            onChange={(e) => handleOptionChange(e, i)}
                                            placeholder={"Option " + (i + 1)}
                                            isInvalid={options[i].trim() === ""}
                                        />
                                        <FormControl.Feedback type='invalid'>
                                            <ul>
                                                <li>Option cannot be empty</li>
                                            </ul>
                                        </FormControl.Feedback>
                                    </Col>
                                    <Col sm={1}>
                                        <CloseButton name={option} onClick={() => handleDeleteOptionClick(i)} aria-label="Hide" />
                                    </Col>
                                </Row>

                            )
                        }
                        <Button variant="success" onClick={handleAddOptionClick} className='w-25 mx-auto '>
                            Add Option
                        </Button>

                        {
                            options.length < 2 ?
                                <ul>
                                    <li style={{ color: "red" }}>Must have at least two options</li>
                                </ul>
                                : <></>
                        }

                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={handleCreateClicked} disabled={!validData}>
                        Create
                    </Button>
                    <Row>
                    </Row>
                </Form>
            </Container>

        </>
    )
}

export default CreatePoll
