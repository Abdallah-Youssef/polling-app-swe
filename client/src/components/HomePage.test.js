import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import HomePage from './HomePage'
import { Enviroment } from '../setupTests'

const mockPollData = {
    
}

describe("HomePage", () => {



    beforeEach(() => {
        global.fetch.mockClear();
    });


    describe('No search query', () => {
        test('Initiall request correct', () => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve({ rates: { CAD: 1.42 } }),
            }))
    
            render(<Enviroment element={<HomePage />} />);
            
            
        });
    })




})

