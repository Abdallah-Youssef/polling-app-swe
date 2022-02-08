import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loading = () => {
    return (
        <center>
            <h3 className="display-5">Loading ... </h3>
            <Spinner animation="grow" variant="success" />
        </center>
    )
}

export default Loading
