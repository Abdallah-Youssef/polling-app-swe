import { findByDisplayValue, findByRole, findByText, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Profile from './Profile'
import {Enviroment, setMockUserId} from '../setupTests';
import { apiURL } from '../api/url';
import { act } from '@testing-library/react';

const mockUserId = "123"
const mockUserInfo = {
    display_name: "User",
    bio: "My Bio",
    color: "#000",
    email: "e@mail.com"
}

const newUserInfo = {
    newBio : "New Bio",
    newAge : 100
}

const mockVisitorId = "456"

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ userId: mockUserId}),
}));

const fetchMock = jest.fn((url, req) => {
    if (url === apiURL + "/user/polls/"+mockUserId)
        return Promise.resolve({
            json: () => Promise.resolve([])
        })
    
    if (url === apiURL + "/user/"+mockUserId)
        return Promise.resolve({
            json: () => Promise.resolve(mockUserInfo)
        })

    if (url === apiURL + "/user/updateInfo")
        return Promise.resolve({
            json: () => Promise.resolve({})
        })


})

describe("Profile", () => {
    const unmockedFetch = global.fetch

    beforeAll(() => {
        global.fetch = fetchMock
    })

    beforeEach(() => {
        global.fetch.mockClear()
    })

    afterAll(() => {
        global.fetch = unmockedFetch
    })

    test("Doesn't show edit button for non owner", async () => {
        setMockUserId(mockVisitorId)

        await act( async () => render(<Enviroment element={<Profile/>} />));

        const bio = await screen.findByText(mockUserInfo.bio)
        expect(bio).toBeInTheDocument()

        const editButton = await screen.queryByRole("button")
        expect(editButton).not.toBeInTheDocument()
    });

    test("Show edit button for owner", async () => {
        setMockUserId(mockUserId)

        await act( async () => render(<Enviroment element={<Profile/>} />));
        
        const editButton = await screen.queryByRole("button")
        expect(editButton).toBeInTheDocument()
    });

    test("Submits New data", async () => {
        setMockUserId(mockUserId)

        await act( async () => render(<Enviroment element={<Profile/>} />));
        
        const editButton = await screen.queryByRole("button")
        fireEvent.click(editButton)

        // Expect the form to show
        const bioInput = await screen.findByLabelText("Bio")
        const ageInput = await screen.findByLabelText("Age")
        const genderInput = await screen.findByLabelText("Gender")
        const submitButton = await screen.queryByRole("button")

        expect(bioInput).toBeInTheDocument()
        expect(ageInput).toBeInTheDocument()
        expect(genderInput).toBeInTheDocument()




        fireEvent.change(bioInput, { target: { value: newUserInfo.newBio } });
        fireEvent.change(ageInput, { target: { value: newUserInfo.newAge } });
        global.fetch.mockClear()
        fireEvent.click(submitButton)

        expect(fetchMock.mock.calls[0][0]).toEqual("http://localhost:5000/user/updateinfo")

        const reqBody = JSON.parse(fetchMock.mock.calls[0][1].body)
        expect(reqBody.bio).toEqual(newUserInfo.newBio)
        expect(parseInt(reqBody.age)).toEqual(newUserInfo.newAge)

    });
})

