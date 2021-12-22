import React, {useState} from 'react'
import {CloseButton, Form,Row,Col ,Container, Button, FormGroup } from "react-bootstrap"
let optionCount =1
const CreatePoll = () => {
    const[options, setOptions] = useState([])
    const [title, setTitle] = useState("")
    const [Private,setPrivate]=useState(false)
    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }
    const handleOptionChange=(event)=>{
        console.log(options);
        let optionId=event.target.id
        let index
        for (let i = 0; i < options.length; i++) {
            if(options[i]==optionId){
                index=i
                break
            }            
        }
        options.splice(index,1,event.target.value)
        setOptions([...options])
    }
    const handleAddOptionClick=() => {
        setOptions([...options, "New Option"+optionCount])  
         optionCount ++
    }
    const handleDeleteOptionClick=(event)=>{
       let option=event.target.getAttribute("name")
       document.getElementById(option).value="" 
       setOptions(options.filter(item =>item!=option) )
    }
    const handlePrivateCheckBoxChange=(event)=>{
        setPrivate(event.target.checked)
        console.log(event.target.checked);
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
                        onChange={handlePrivateCheckBoxChange}
                        />
                    </FormGroup>
                 </Col>   
            </Row>
            <Row className="justify-content-md-center" >
                 <Col sm={4}>
                    <Form.Group className="mb-3" controlId="pollOptions" >
                    
                    {
                        options.map((option)=>
                        <Row >
                            <Col>
                            <Form.Control type="text" onChange={ handleOptionChange} id={option}  placeholder={option} />
                            </Col>
                            <Col sm={1}>
                            <CloseButton name ={option} onClick={handleDeleteOptionClick} aria-label="Hide" id={'close '+option} />
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
