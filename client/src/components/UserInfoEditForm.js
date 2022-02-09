import React, {useRef} from 'react';
import { Form, Button } from 'react-bootstrap';

const UserInfoEditForm = ({ userInfo, onSubmit }) => {
    const displayNameInput = useRef(null);
    const bioInput = useRef(null);
    const colorInput = useRef(null);
    const ageInput = useRef(null);
    const genderInput = useRef(null);

    const handleSubmitClicked = (e) => {
        e.preventDefault()
        onSubmit(displayNameInput.current.value, 
                 bioInput.current.value,
                 colorInput.current.value,
                 ageInput.current.value,
                 genderInput.current.value)
    }
    return (
        <Form>


            <Form.Group className="mb-3">
                <Form.Label htmlFor="displayName">Display Name</Form.Label>
                <Form.Control id="displayName" ref={displayNameInput} type="text" placeholder='Enter Display Name' defaultValue={userInfo.display_name ?? ""} />
            </Form.Group>

            <br />

            <Form.Group className="mb-3">
                <Form.Label htmlFor="bio">Bio</Form.Label>
                <Form.Control id="bio" ref={bioInput} as="textarea" rows={3} defaultValue={userInfo.bio}/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="color">Profile Color</Form.Label>
                <Form.Control
                    id="color"
                    ref={colorInput}
                    type="color"
                    defaultValue={userInfo.color}
                    title="Choose your profile color"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="age">Age</Form.Label>
                <Form.Control
                    id="age"
                    ref={ageInput}
                    type="number"
                    min="1" max="120"
                    defaultValue={userInfo.age}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="gender">Gender</Form.Label>
                    <Form.Select ref={genderInput} id="gender" defaultValue={userInfo.gender}>
                        <option value=""></option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </Form.Select>
            </Form.Group>

            <center><Button onClick={handleSubmitClicked}>Submit</Button></center>
        </Form>

    );
};

export default UserInfoEditForm;
