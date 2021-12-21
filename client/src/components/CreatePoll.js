import React, {useState} from 'react'
import {CloseButton, Form,Row,Col ,Container, Button, Nav, FormGroup } from "react-bootstrap"

const CreatePoll = () => {
    const [options, setOptions] = useState([])
    const [title, setTitle] = useState("")

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
    const handleOptionChange=(event)=>{

    }
    const handleAddOptionClick=() => {
        setOptions([...options, "New Option"])  
    }
  
    
    return (
        <Container>
             <Form >
            <Row  className="justify-content-md-center">
                <Col sm={3}>
                    <Form.Group className="mb-3" controlId="pollTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control onChange={handleTitleChange} type="text" placeholder="My Poll" /> 
                   
                    </Form.Group>
                </Col>
            </Row>
            <Row  className="justify-content-md-center">
                <Col sm={1}>
                    <FormGroup>
                    <Form.Check 
                        type='checkbox'
                        id={`privateCheck`}
                        label={`Private`}
                        />
                    </FormGroup>
                 </Col>   
            </Row>
            <Row className="justify-content-md-center" >
                 <Col sm={4}>
                    <Form.Group className="mb-3" controlId="pollOptions" inline>
                    
                    {
                        options.map((option)=>
                        <Row >
                            <Col>
                            <Form.Control type="text" id={option} onChange={handleOptionChange} placeholder={option} />
                            </Col>
                            <Col sm={1}>
                            <CloseButton aria-label="Hide" />
                            </Col>
                        </Row>
                            
                        ) 
                    }
                     
                    <Button variant="success"  onClick={handleAddOptionClick}>
                        Add Option     
                    </Button>
                    </Form.Group>
                    </Col>  
            </Row>
                    
                    <Button variant="primary" type="submit">
                        Create     
                    </Button>
      
                
            
            <Row>
            </Row>
            </Form>
    </Container>
       
    )
}

export default CreatePoll
