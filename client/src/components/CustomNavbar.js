import { useContext } from "react";
import { Navbar, Container, Button, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../reducers/user";
import { handleLogOut } from "../reducers/user";

const CustomNavbar = () => {
    const { user, dispatch } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogOutClicked = () => {
        handleLogOut()(dispatch);
        navigate("/pollFeed");
    };

    const handleLogInClicked = () => {
        navigate("/login");
    };

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/pollFeed">
                        Polling Website
                    </Navbar.Brand>

                    {user.email ? (
                        <>
                            <h5 style={{color:"#3283a8"}}>{user.email}</h5>
                            <Nav>
                                <Nav.Link as={Link} to="/create" className="mx-2">
                                    Create Poll
                                </Nav.Link>
                                <Nav.Link as={Link} to={"/user/"+user.id} className="mx-2">
                                    My Profile
                                </Nav.Link>
                                <Button className="mx-2" onClick={handleLogOutClicked}>
                                    Log out
                                </Button>
                            </Nav>
                        </>
                    ) : (
                        <Button variant="light" onClick={handleLogInClicked}>
                            Login
                        </Button>
                    )}
                </Container>
            </Navbar>
        </>
    );
};

export default CustomNavbar;
