import { Link } from "react-router-dom";
import { ListGroup, Container } from "react-bootstrap";

const PollList = ({ polls }) => {



    return (
        <Container className="w-50 mt-5">
            {
                polls.length !== 0 ?
                    
                        <ListGroup as="ul" numbered>
                            {polls.map((poll, i) => (
                                <ListGroup.Item
                                    className="d-flex justify-content-between align-items-start"
                                    key={i}
                                >

                                    <Link style={pollStyle} className="poll ms-2 me-auto"
                                        to={`/polls/${poll._id}`}
                                        key={poll._id}
                                    >
                                        <span className="fw-bold">{poll.question}</span>
                                    </Link>

                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                     :
                    <h3 className="display-5">Loading ... </h3>
            }
            </Container>
    );
};

const pollStyle = {
    "text-decoration": "none",
    color: "red",
    display: "block",
    margin: "1rem 0"
}

export default PollList;
