import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Enviroment } from '../setupTests'
import { useContext } from 'react';
import { setUser, UserContext } from '../reducers/user';
import CreatePoll from './CreatePoll';

describe("CreatePoll", () => {
    beforeEach(() => {
        localStorage.clear()
    });

    afterAll(() => {
        localStorage.clear()
    })

    test('Renders guidelines at the beginning', () => {
        render((<Enviroment element={<CreatePoll />} />));
        expect(screen.getByText("Enter poll title")).toBeInTheDocument()
        expect(screen.getByText("Must have at least two options")).toBeInTheDocument()
    });

    test("Doesn't render guidelines for valid fields", async () => {
        render(<Enviroment element={<CreatePoll />} />);

        const titleWarning = screen.getByText("Enter poll title")
        const optionsWarning = screen.getByText("Must have at least two options")
        expect(titleWarning).toBeInTheDocument()
        expect(optionsWarning).toBeInTheDocument()

        const titleField = screen.getByPlaceholderText("My Poll")
        const addOptionButton = screen.getByRole("button", {name: "Add Option"})
    

        fireEvent.change(titleField, { target: { value: "Non empty title" } })
        fireEvent.click(addOptionButton)
        fireEvent.click(addOptionButton)

        const emptyOptionWarning = await screen.getAllByText("Option cannot be empty")
        expect(emptyOptionWarning.length).toEqual(2)

        screen.debug()
        const option1 = screen.getByPlaceholderText("Option 1")
        const option2 = screen.getByPlaceholderText("Option 2")

        fireEvent.change(option1, { target: { value: "Option one" } })
        fireEvent.change(option2, { target: { value: "Option two" } })

        waitForElementToBeRemoved(
            [titleWarning, optionsWarning, ...emptyOptionWarning]
        )
    })



})

