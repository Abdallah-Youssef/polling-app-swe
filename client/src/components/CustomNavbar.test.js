import { fireEvent, render, screen } from '@testing-library/react';
import CustomNavbar from './CustomNavbar';

describe("CustomNavbar", () => {
    beforeEach(() => {
        localStorage.clear()
    });

    afterAll(() => {
        localStorage.clear()
    })


    test('renders login button when not logged in', () => {
        render(<CustomNavbar />);
        expect(screen.getByRole("button", {name : "Login"})).toBeInTheDocument()
    });

    test('renders logout button when logged in', () => {
        localStorage.setItem("user", JSON.stringify({name: "jjjjj"}))

        render(<CustomNavbar />)

        const logOutButton = screen.getByRole("button", {name : "Log out"})
        expect(logOutButton).toBeInTheDocument()
    });

    test('logs out when log out is clicked', () => {
        localStorage.setItem("user", JSON.stringify({name: "jjjjj"}))

        render(<CustomNavbar />)

        const logOutButton = screen.getByRole("button", {name : "Log out"})
        expect(logOutButton).toBeInTheDocument()

        fireEvent.click(logOutButton)
        expect(screen.getByRole("button", {name : "Login"})).toBeInTheDocument()
    })
})


