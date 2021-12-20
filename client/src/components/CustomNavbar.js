import { Navbar, Container, Button } from "react-bootstrap"
import { getLoggedInUser, logInUser, logOutUser } from "../util/user"
import { useState } from "react"
const CustomNavbar = () => {
    const [user, setUser] = useState(getLoggedInUser())

    const handleLogOut = () => {
        logOutUser()
        setUser(null)
    }

    const handleLogIn = () => {
        const userTemp = {name : "hamada"}
        logInUser(userTemp)
        setUser(userTemp)
    }

    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">Polling Website</Navbar.Brand>

                <div>
                {
                    user !== null ?
                        <>
                            <Button className="mx-2"> My Polls </Button>
                            <Button className="mx-2"> Create Poll </Button>
                            <Button className="mx-2" onClick={handleLogOut}> Log out </Button>
                        </>

                        :
                        <Button variant="light" onClick={handleLogIn}>
                            Login
                        </Button>
                }
                </div>

            </Container>
        </Navbar>

    )
}

export default CustomNavbar
