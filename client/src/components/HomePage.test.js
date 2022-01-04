import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import HomePage from './HomePage'
import { Enviroment, mockPollData } from '../setupTests'
import { getPolls } from '../api/allPolls';
import { act } from 'react-dom/test-utils';



describe("HomePage", () => {

    beforeEach(() => {
        window.fetch = jest.fn((url, requestOptions) =>
            Promise.resolve({
                json: () => Promise.resolve(mockPollData),
            }))
    })

    afterEach(() => {
        window.fetch.mockClear()
    })


    test('Initial request correct', async () => {
        window.fetch = jest.fn((url, requestOptions) =>
            Promise.resolve({
                json: () => Promise.resolve(mockPollData),
            }))

        render(<Enviroment element={<HomePage />} />);

        const [pollList, paginationCounter] = await screen.findAllByRole('list')
        expect(global.fetch).toBeCalledWith("http://localhost:5000?pageNumber=1", { "method": "GET", "redirect": "follow" })

        expect(pollList.childElementCount).toEqual(10)
        expect(paginationCounter.childElementCount).toEqual(2)
    });


    test('Search by author', async () => {
        window.fetch = jest.fn((url, requestOptions) =>
            Promise.resolve({
                json: () => ({
                    polls: [{
                        "_id": "61c39a59aee6623b60ddd68a",
                        "postedBy": {
                            "local": {
                                "email": "adel@shakal.com"
                            },
                            "_id": "61c212e078743f401426e042"
                        },
                        "question": "How is it?",
                    }],
                    count: 1
                })
            }))
        render(<Enviroment element={<HomePage />} />);

        await screen.findAllByRole('list')

        const searchButton = await screen.findByTestId("searchButton")

        const inputField = await screen.findByPlaceholderText("Search")
        fireEvent.change(inputField, { target: { value: "adel" } })

        const dropDownButton = await screen.findByText("Search By")
        fireEvent.click(dropDownButton)
        const titleOption = await screen.findByText("Author")
        fireEvent.click(titleOption)
        fireEvent.click(searchButton)

        expect(global.fetch).toBeCalledWith("http://localhost:5000?pageNumber=1&searchBy=author&searchAttribute=adel", { "method": "GET", "redirect": "follow" })
        await screen.findByText("How is it?")
    });

    test('Search by title', async () => {
        const title = "ABC"
        window.fetch = jest.fn((url, requestOptions) =>
            Promise.resolve({
                json: () => ({
                    polls: [{
                        "_id": "61c39a59aee6623b60ddd68a",
                        "postedBy": {
                            "local": {
                                "email": "adel@shakal.com"
                            },
                            "_id": "61c212e078743f401426e042"
                        },
                        "question": title,
                    }],
                    count: 1
                })
            }))

        render(<Enviroment element={<HomePage />} />);

        await screen.findAllByRole('list')
        window.fetch.mockClear()

        const searchButton = await screen.findByTestId("searchButton")

        const inputField = await screen.findByPlaceholderText("Search")
        fireEvent.change(inputField, {target: {value: title}})

        const dropDownButton = await screen.findByText("Search By")
        fireEvent.click(dropDownButton)
        const titleOption = await screen.findByText("Title")
        fireEvent.click(titleOption)
        fireEvent.click(searchButton)

        expect(global.fetch).toBeCalledWith("http://localhost:5000?pageNumber=1&searchBy=title&searchAttribute="+title, {"method": "GET", "redirect": "follow"})        

        await screen.findByText(title)
    });

})

