# Endpoints

* to **view** all polls without authentication
    GET /

* to **view** the details of a poll (question, choices, creator, image, no need for authentication)
    GET /poll/:pollId

* to **create** a poll
    POST /polls/create

* to **vote** in a poll
    POST /votes/submit

* to **change** vote
    POST /votes/change

* to **view** result summary of a poll
    GET /polls/results/:pollId

* to **view** the choice a particular user voted for
    GET /polls/:pollId/vote/:userId

* to **view** the polls of a particular user
    GET /user/polls/:userId? (the user ID is optional.. if omitted, then the logged in user)