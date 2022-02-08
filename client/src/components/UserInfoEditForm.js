import React, {useRef} from 'react';
import { Form, Button } from 'react-bootstrap';

const UserInfoEditForm = ({ userInfo, onSubmit }) => {
    const displayNameInput = useRef(null);
    const bioInput = useRef(null);
    const colorInput = useRef(null);

    const handleSubmitClicked = (e) => {
        e.preventDefault()
        onSubmit(displayNameInput.current.value, bioInput.current.value, colorInput.current.value)
    }
    return (
        <Form>


            <Form.Group className="mb-3">
                <Form.Label>Display Name:</Form.Label>
                <Form.Control ref={displayNameInput} type="text" placeholder='Enter Display Name' defaultValue={userInfo.display_name ?? ""} />
            </Form.Group>

            <br />

            <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control ref={bioInput} as="textarea" rows={3} defaultValue={userInfo.bio}/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Profile Color</Form.Label>
                <Form.Control
                    ref={colorInput}
                    type="color"
                    defaultValue={userInfo.color}
                    title="Choose your profile color"
                />
            </Form.Group>

            <center><Button onClick={handleSubmitClicked}>Submit</Button></center>
        </Form>

    );
};

export default UserInfoEditForm;
