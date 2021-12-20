import { Navbar, Container, Button, Nav } from "react-bootstrap"
import { getLoggedInUser, logInUser, logOutUser } from "../util/user"
import { useState } from "react"
import { Link } from "react-router-dom"
const CustomNavbar = () => {
    const [user, setUser] = useState(getLoggedInUser())

    const handleLogOut = () => {
        logOutUser()
        setUser(null)
    }

    const handleLogIn = () => {
        const userTemp = { name: "hamada" }
        logInUser(userTemp)
        setUser(userTemp)
    }

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">Polling Website </Navbar.Brand>

                {
                    user !== null ?
                        <>
                            <Nav>
                                <Nav.Link as={Link} to="/create" className="mx-2">Create Poll</Nav.Link>
                                <Nav.Link as={Link} to="/mypolls" className="mx-2">My Polls</Nav.Link>
                                <Button className="mx-2" onClick={handleLogOut}> Log out </Button>
                            </Nav>

                        </>

                        :
                        <Button variant="light" onClick={handleLogIn}>
                            Login
                        </Button>
                }

            </Container>
        </Navbar>

    )
}

export default CustomNavbar
