import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Enviroment, wrapWithEnv } from '../setupTests';
import Login from './Login';



describe("Login", () => {
    const mockEmail = "jeff@mail.com"
    const mockPassword = "Password@1"
    const unmockedFetch = global.fetch
    const fetchMock = jest.fn(() => {
        return new Promise((res, rej) => {
            res()
        })
    })

    beforeAll(() => {
        global.fetch = fetchMock
        jest.spyOn(window, 'alert').mockImplementation(() => {});
    })

    afterAll(() => {
        global.fetch = unmockedFetch
    })

    test('Calls the userAuth api with the correct data', () => {
        render((<Enviroment element={<Login />} />));

        const emailField = screen.getByLabelText("Email address")
        const passwordField = screen.getByLabelText("Password")
        const loginButton = screen.getByRole("button", { name: "Login" })


        fireEvent.change(emailField, { target: { value: mockEmail } })
        fireEvent.change(passwordField, { target: { value: mockPassword } })
        expect(loginButton).toBeInTheDocument()


        fireEvent.click(loginButton)
        expect(fetchMock.mock.calls.length === 1)

        expect(fetchMock.mock.calls[0][0]).toEqual("http://localhost:5000/userAuth/login")
        const body = JSON.parse(fetchMock.mock.calls[0][1].body)
        expect(body.email).toEqual(mockEmail)
        expect(body.password).toEqual(mockPassword)
    });

})

