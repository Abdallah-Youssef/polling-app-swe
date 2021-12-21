import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { logInUser } from '../util/user';
import CustomNavbar from './CustomNavbar';

const renderWithRouter = (component) => render(<BrowserRouter>{component}</BrowserRouter>)

describe("CustomNavbar", () => {
    beforeEach(() => {
        localStorage.clear()
    });

    afterAll(() => {
        localStorage.clear()
    })


    test('renders login button when not logged in', () => {
        renderWithRouter(<CustomNavbar />);
        expect(screen.getByRole("button", {name : "Login"})).toBeInTheDocument()
    });

    test('renders logout button when logged in', () => {
        logInUser({name: "keff"})

        renderWithRouter(<CustomNavbar />);

        const logOutButton = screen.getByRole("button", {name : "Log out"})
        expect(logOutButton).toBeInTheDocument()
    });

    test('logs out when log out is clicked', () => {
        logInUser({name: "keff"})


        renderWithRouter(<CustomNavbar />);

        const logOutButton = screen.getByRole("button", {name : "Log out"})
        expect(logOutButton).toBeInTheDocument()

        fireEvent.click(logOutButton)
        expect(screen.getByRole("button", {name : "Login"})).toBeInTheDocument()
    })
})


