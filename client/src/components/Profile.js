import React, { useEffect, useState } from "react";
import { Container, Col, Row, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getUserPolls } from "../api/poll";
import { getUserInfo, updateUserInfo } from "../api/user";
import PollList from "./PollList";
import Loading from "./Loading"
import UserInfoEditForm from "./UserInfoEditForm";
import {  UserContext } from "../reducers/user";
import { useContext } from "react";

const Profile = () => {
    const [polls, setPolls] = useState([]);
    const [userInfo, setUserInfo] = useState({})
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const {user} = useContext(UserContext)
    const params = useParams();

    useEffect(() => {
    


        const userId = params.userId
        console.log({userId, user})


        const pollsPromise = getUserPolls(userId)
        const userInfoPromise = getUserInfo(userId)

        Promise.all([pollsPromise, userInfoPromise])
            .then(([polls, userInfo]) => {
                if (polls && userInfo) {
                    setPolls(polls);
                    setUserInfo(userInfo);
                    setError("");
                    setLoading(false)
                }

                else setError("Failed to reach server")
            })

    }, [params.userId]);

    const handleEditClicked = () => setEditing(true)

  
    const onSubmit = async (displayName, bio, color) => {
        setEditing(false)
        updateUserInfo(displayName, bio, color)
        .then(res => {
            console.log(res)
            if (!res.error){
                setError("")
                setUserInfo(res)
            }else setError(res.error)
        })
    }


    return (
        <Container style={{ backgroundColor: userInfo.color }} className='p-5 mt-5 w-100 border border-dark rounded'>
            <Row>
                {loading ? <Loading /> :
                    <>

                        <Col sm={12} xl={4} className="py-3 border border-dark rounded">

                            {editing ? <UserInfoEditForm userInfo={userInfo} onSubmit={onSubmit}/> :
                                <>
                                    <h5>{userInfo.email}'s Profile</h5>
                                    {userInfo.bio}
                                    <br /><br />
                                    {params.userId === user.id && 
                                    <center>
                                        <Button onClick={handleEditClicked}>Edit</Button>
                                    </center>}
                                    
                                </>
                            }

                            <h1>{error}</h1>
                        </Col>

                        <Col sm={12} xl={8} className="border border-dark rounded">
                            <center><h3 className="display-6"> Polls </h3></center>
                            <PollList polls={polls} />
                        </Col>
                    </>
                }
            </Row>
        </Container>

    );
}

export default Profile
