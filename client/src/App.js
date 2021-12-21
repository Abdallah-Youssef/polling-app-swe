import CreatePoll from "./components/CreatePoll";
import CustomNavbar from "./components/CustomNavbar";
import { Routes, Route } from "react-router-dom";
import MyPolls from "./components/MyPolls";
import RequireAuth from "./components/RequireAuth";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { userReducer, UserContext } from "./reducers/user";
import { useReducer } from "react";
function App() {
  const [user, dispatch] = useReducer(userReducer, {});

  return (
    <div className="App">
      <UserContext.Provider value={{user, dispatch}}>
        <CustomNavbar />

        <Routes>
          <Route element={<RequireAuth />}>
            <Route exact path="/create" element={<CreatePoll />} />
            <Route exact path="/mypolls" element={<MyPolls />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/" element={<h1>Home Page</h1>} />
        </Routes>
      </UserContext.Provider>

    </div>
  );
}

export default App;
