import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Enviroment, wrapWithEnv } from '../setupTests';
import SignUp from './SignUp';



describe("SignUp", () => {
    beforeEach(() => {
        localStorage.clear()
    });

    afterAll(() => {
        localStorage.clear()
    })


    test('Renders guidelines at the beginning', () => {
        render((<Enviroment element={<SignUp />} />));
        expect(screen.getByText("Invalid email address")).toBeInTheDocument()
        expect(screen.getByText("The password must contain at least 1 lowercase alphabetical character")).toBeInTheDocument()
    });

    test("Doesn't render guidelines for valid fields", async () => {
        render(<Enviroment element={<SignUp />} />);

        const emailField = screen.getByLabelText("Email address")
        const passwordField = screen.getByLabelText("Password")


        fireEvent.change(emailField, { target: { value: "jeff@mail.com" } })
        fireEvent.change(passwordField, { target: { value: "Password@1" } })


        waitForElementToBeRemoved(
            [
                screen.getByText("Invalid email address"),
                screen.getByText("The password must contain at least 1 lowercase alphabetical character")
            ]
        )
    })

    test("Render guidelines for invalid fields", async () => {
        const {rerender} = render((<Enviroment element={<SignUp />} />));

        const emailField = screen.getByLabelText("Email address")
        const passwordField = screen.getByLabelText("Password")


        fireEvent.change(emailField, { target: { value: "wrong" } })
        fireEvent.change(passwordField, { target: { value: "weak" } })

        await waitFor(() => {
            expect(screen.getByText('Invalid email address')).toBeInTheDocument();
            expect(screen.getByText('The password must contain at least 1 lowercase alphabetical character')).toBeInTheDocument();
        });


    })

})

