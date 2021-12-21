import React, { useState } from 'react'
import { Form, Button, Container } from 'react-bootstrap'
import useAuthenticatedUser from '../reducers/user'
const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {handleSignUp} = useAuthenticatedUser()

    const handleEmailChanged = (e) => setEmail(e.target.value)
    const handlePasswordChanged = (e) => setPassword(e.target.value)

    const handleSubmitClicked = (e) => {
        e.preventDefault()
        handleSignUp(email, password)
    }

    return (
        <Container className='py-5 mt-5 w-50 border border-dark rounded'>
            <Form className='w-75 mx-auto'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        value={email || ''} 
                        onChange={handleEmailChanged}
                        type="email"
                        placeholder="Enter email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        value={password || ''}
                        onChange={handlePasswordChanged}
                        type="password"
                        placeholder="Password" />
                </Form.Group>

                <Button variant="primary" onClick={handleSubmitClicked}>
                    Submit
                </Button>
            </Form>
        </Container>
    )
}

export default SignUp
