import { Link } from "react-router-dom";
import { ListGroup, Container } from "react-bootstrap";

const PollList = ({ polls }) => {



    return (
        <Container className="w-50 mt-5">
            <ListGroup as="ul" numbered>
                {polls.map((poll, i) => (
                    <ListGroup.Item
                        key={i}
                    >

                        <Link style={pollStyle} className="my-2"
                            to={`/polls/${poll._id}`}
                            key={poll._id}
                        >
                            <h2 className="fw-bold">{poll.question}</h2>
                        </Link>

                        <Link to={`/user/${poll.postedBy._id}`}>
                            {poll.postedBy.local.email}
                        </Link>


                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

const pollStyle = {
    textDecoration: "none",
    color: "black",
}

export default PollList;
