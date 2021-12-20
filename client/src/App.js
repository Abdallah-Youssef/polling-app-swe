import './App.css';
import CreatePoll from './components/CreatePoll';
import CustomNavbar from './components/CustomNavbar';
import { Routes, Route } from 'react-router-dom'
import MyPolls from './components/MyPolls';
import RequireAuth from './components/RequireAuth';
import Login from './components/Login';
function App() {
    return (
        <div className="App">
            <CustomNavbar />



            <Routes>

                <Route element={<RequireAuth />}>
                    <Route exact path='/create' element={<CreatePoll/>} />
                    <Route exact path='/mypolls' element={<MyPolls/>} />
                </Route>

                <Route path='/login' element={<Login/>}/>

                <Route path='/' element={<h1>Home Page</h1>}/>
            </Routes>
        </div>
    );
}

export default App;
