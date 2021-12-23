import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CustomNavbar from './CustomNavbar';
import {Enviroment, mockUserDispatch, mockUserState} from '../setupTests'
import { useContext } from 'react';
import { setUser, UserContext } from '../reducers/user';

describe("CustomNavbar", () => {
    beforeEach(() => {
        localStorage.clear()
    });

    afterAll(() => {
        localStorage.clear()
    })


    test('renders login button when not logged in', () => {
        render(<Enviroment element={<CustomNavbar/>} />);
        expect(screen.getByRole("button", {name : "Login"})).toBeInTheDocument()
    });

    test('renders logout button when logged in', () => {
        mockUserDispatch(setUser("123", "adel@shakal.com", "Password@1"))
        render(<Enviroment element={<CustomNavbar/>} />);

        const logOutButton = screen.getByRole("button", {name : "Log out"})
        expect(logOutButton).toBeInTheDocument()

    });

    test('logs out when log out is clicked', async () => {
        mockUserDispatch(setUser("123", "adel@shakal.com", "Password@1"))
        const {rerender} = render(<Enviroment element={<CustomNavbar/>} />);


        const logOutButton = screen.getByRole("button", {name : "Log out"})
        expect(logOutButton).toBeInTheDocument()

        fireEvent.click(logOutButton)
        rerender(<Enviroment element={<CustomNavbar/>} />)

        await waitFor(() => {
            expect(screen.getByRole("button", {name : "Login"})).toBeInTheDocument()
        })
    })
})

