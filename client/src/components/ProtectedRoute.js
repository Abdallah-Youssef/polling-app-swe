import React from "react";
import { Navigate, Route } from "react-router-dom";
import { getIsLoggedIn } from "../util/user";

/**
 * @returns A route that is only accessible by logged in users
 */
function ProtectedRoute({ component: Component, ...restOfProps }) {


    return (
        <Route
            {...restOfProps}
            render={(props) =>
                (getIsLoggedIn()) ? <Component {...props} /> : <Navigate to="/error" />
            }
        />
    );
}

export default ProtectedRoute;