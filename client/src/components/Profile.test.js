import { findByDisplayValue, findByRole, findByText, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Component from './Component';
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
})

describe("Profile", () => {
    const unmockedFetch = global.fetch

    beforeAll(() => {
        global.fetch = fetchMock
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
})

