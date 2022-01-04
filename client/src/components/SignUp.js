import React, { useState, useContext } from 'react'
import { Form, Button, Container, FormControl } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { handleFacebookAuth, handleSignUp, UserContext } from '../reducers/user'

const SignUp = () => {
    const { dispatch } = useContext(UserContext)
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const [emailValid, setEmailValid] = useState(false)

    const [password, setPassword] = useState("")
    const strongPasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const [passwordValid, setPasswordValid] = useState(false)

    const handleEmailChanged = (e) => {
        setEmail(e.target.value)
        if (!emailRegex.test(e.target.value) || e.target.value === '')
            setEmailValid(false)
        else setEmailValid(true)
    }
    const handlePasswordChanged = (e) => {
        setPassword(e.target.value)
        if (!strongPasswordRegex.test(e.target.value) || e.target.value === '')
            setPasswordValid(false)
        else setPasswordValid(true)
    }

    const handleSubmitClicked = async (e) => {
        e.preventDefault()


        if (passwordValid && emailValid) {
            try {
                await handleSignUp(email, password)(dispatch)
                navigate('/')
            }
            catch (error){
                alert(error)
            }
        }
    }

    const handleFacebookClicked = async (e) => {
        e.preventDefault()


        try {
            await handleFacebookAuth()(dispatch)
            navigate('/')
        }
        catch (error){
            alert("MEOW"+ error)
        }
    }

    return (
        <Container className='py-5 mt-5 w-50 border border-dark rounded'>
            <h1 className="display-5 w-75 mx-auto mb-4">Sign Up</h1>
            <Form className='w-75 mx-auto'>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        value={email || ''}
                        onChange={handleEmailChanged}
                        type="email"
                        placeholder="Enter email"
                        isInvalid={!emailValid}
                    />
                    <FormControl.Feedback type='invalid'>
                        <ul>
                            <li>Invalid email address</li>
                        </ul>
                    </FormControl.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        value={password || ''}
                        onChange={handlePasswordChanged}
                        type="password"
                        placeholder="Password"
                        isInvalid={!passwordValid}
                    />
                    <FormControl.Feedback type='invalid'>
                        <ul>
                            <li>The password must contain at least 1 lowercase alphabetical character</li>
                            <li>The password must contain at least 1 uppercase alphabetical character</li>
                            <li>The password must contain at least 1 numeric character</li>
                            <li>The password must contain at least one special character [!@#$%^*]</li>
                            <li>The password must be eight characters or longer</li>
                        </ul>
                    </FormControl.Feedback>
                </Form.Group>

                <Button variant="primary" onClick={handleSubmitClicked}>
                    Submit
                </Button>

                {/* <a variant="primary" href='http::/localhost:5000/userAuth/oauth/facebook'>
                    Login With Facebook
                </a> */}

            </Form>
        </Container>
    )
}

export default SignUp
