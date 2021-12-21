import { Navbar, Container, Button, Nav } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import useAuthenticatedUser from "../reducers/user"

const CustomNavbar = () => {
    const {user, handleLogOut} = useAuthenticatedUser()
    const navigate = useNavigate()

    
    const handleLogOutClicked = () => {
        handleLogOut()
    }

    const handleLogInClicked = () => {
        navigate('/login')
    }

    return (
        <>
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">Polling Website </Navbar.Brand>

                {
                    user.email ?
                        <>
                            <Nav>
                                <Nav.Link as={Link} to="/create" className="mx-2">Create Poll</Nav.Link>
                                <Nav.Link as={Link} to="/mypolls" className="mx-2">My Polls</Nav.Link>
                                <Button className="mx-2" onClick={handleLogOutClicked}> Log out </Button>
                            </Nav>

                        </>

                        :
                        <Button variant="light" onClick={handleLogInClicked}>
                            Login
                        </Button>
                }

            </Container>
        </Navbar>

{user.email || "No email"}
        </>
    )
}

export default CustomNavbar
