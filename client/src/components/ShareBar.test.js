import { fireEvent, render, screen } from '@testing-library/react';
import ShareBar from './ShareBar'



describe("ShareBar", () => {
    jest.spyOn(navigator.clipboard, "writeText");
    const mockFocus = jest.fn()
    const content = "Hello world"

    test('Copies link into clipboard successfully', () => {
        render(<ShareBar content={content} />);

        const copyButton = screen.getByRole("button", { name: "Copy Link" })
        expect(copyButton).toBeInTheDocument()

        fireEvent.click(copyButton)
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(content + ": http://localhost/");
    });


    test('Opens whatsapp share', () => {
        render(<ShareBar content={content} />);

        const whatsappButton = screen.getByRole("button", { name: "WhatsApp" })

        global.open = jest.fn(() => ({focus: mockFocus}));
        fireEvent.click(whatsappButton)
        expect(global.open).toBeCalled();
        expect(mockFocus).toBeCalled()
    });

    test('Opens twitter', () => {
        render(<ShareBar content={content} />);

        const twitterButton = screen.getByRole("button", { name: "Tweet" })


        global.open = jest.fn(() => ({focus: mockFocus}));
        fireEvent.click(twitterButton)
        expect(global.open).toBeCalled();
        expect(mockFocus).toBeCalled()
    });

})

