import CreatePoll from "./components/CreatePoll";
import CustomNavbar from "./components/CustomNavbar";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Login from "./components/Login";
import Poll from "./components/Poll"
import SignUp from "./components/SignUp";
import { userReducer, UserContext } from "./reducers/user";
import { useReducer } from "react";
import HomePage from "./components/HomePage";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
function App() {
  const [user, dispatch] = useReducer(userReducer, {});

  return (
    <div className="App">
      <UserContext.Provider value={{user, dispatch}}>
        <CustomNavbar />

        <Routes>
          <Route element={<RequireAuth />}>
            <Route exact path="/create" element={<CreatePoll />} />
            <Route path="/polls/:pollId" element={<Poll />}/>
            <Route path="/polls/:pollId/dashboard" element={<Dashboard />}/>
            <Route exact path="/user/:userId" element={<Profile />}/>
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route path="/pollFeed" element={<HomePage/>} />

          <Route
            path="*"
            element={
              <main style={{ padding: "1rem" }}>
                <p>There's nothing here!</p>
              </main>
            }
          />
        </Routes>
      </UserContext.Provider>

    </div>
  );
}

export default App;
