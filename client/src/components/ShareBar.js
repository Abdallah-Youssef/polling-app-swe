// import React from 'react'
import { BsWhatsapp, BsTwitter, BsClipboard } from 'react-icons/bs'
import { Button } from 'react-bootstrap'


const ShareBar = ({ content }) => {
    const currentURL = window.location


    const handleWhatsapp = () => {
        window.open(`https://api.whatsapp.com/send/?phone&text=${content + ": " + currentURL}`, '_blank').focus();
    }
    const handleTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${content + ": " + currentURL}`, '_blank').focus();
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(currentURL.href);
    }

    return (
        <div className='mt-3 mx-auto w-50 d-flex justify-content-between'>
            <Button className='d-flex align-items-center text-nowrap' variant="outline-secondary" onClick={handleCopy}>
                <BsClipboard className='mx-1' />Copy Link
            </Button>

            <Button className='d-flex align-items-center mx-2' style={{ backgroundColor: "#25D366", borderColor: "white" }} onClick={handleWhatsapp}>
                <BsWhatsapp className='mx-1' />WhatsApp
            </Button>

            <Button className='d-flex align-items-center' style={{ backgroundColor: "#1DA1F2", borderColor: "white" }} onClick={handleTwitter}>
                <BsTwitter className='mx-1' />Tweet
            </Button>


        </div>
    )
}

export default ShareBar
