import React, { useState } from 'react'
import { CloseButton, Form, Row, Col, Container, Button, FormGroup } from "react-bootstrap"
import { useNavigate } from 'react-router-dom'
import { createPoll } from '../api/poll'

let optionCount = 1
const CreatePoll = () => {
    const navigate = useNavigate()
    const [options, setOptions] = useState([])
    const [title, setTitle] = useState("")
    const [Private, setPrivate] = useState(false)
    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
    const handleOptionChange = (event) => {
        console.log(options);
        let optionId = event.target.id
        let index
        for (let i = 0; i < options.length; i++) {
            if (options[i] === optionId) {
                index = i
                break
            }
        }
        options.splice(index, 1, event.target.value)
        setOptions([...options])
    }
    const handleAddOptionClick = () => {
        setOptions([...options, "New Option" + optionCount])
        optionCount++
    }
    const handleDeleteOptionClick = (event) => {
        let option = event.target.getAttribute("name")
        document.getElementById(option).value = ""
        setOptions(options.filter(item => item !== option))
    }
    const handlePrivateCheckBoxChange = (event) => {
        setPrivate(event.target.checked)
    }

    const handleCreateClicked = async (event) => {
        event.preventDefault()
        optionCount = 1
        await createPoll(title, Private, options)
        navigate('/')
    }
    return (
        <>
            <h1 className="display-5 w-100 text-center my-4">Create Poll</h1>

            <Container className="py-5 mt-5 w-50 border border-dark rounded">
                <Form className="w-75 mx-auto">


                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control onChange={handleTitleChange} type="text" placeholder="My Poll" />
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

                    <Form.Group className="mb-3"  >
                        <Form.Label className='mx-3'><h4>Options</h4></Form.Label>

                        {
                            options.map((option, i) =>
                                <Row className='my-3' key={i}>
                                    <Col>
                                        <Form.Control type="text" onChange={handleOptionChange} id={option} placeholder={option} />
                                    </Col>
                                    <Col sm={1}>
                                        <CloseButton name={option} onClick={handleDeleteOptionClick} aria-label="Hide" id={'close ' + option} />
                                    </Col>
                                </Row>

                            )
                        }
                        <Button variant="success" onClick={handleAddOptionClick} className='w-25 mx-auto '>
                            Add Option
                        </Button>

                    </Form.Group>

                    <Button variant="primary" type="submit" onClick={handleCreateClicked}>
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
