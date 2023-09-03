import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link  } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import Navbar from './components/Navbar';
import AddGameForm from './components/AddGameForm';
import GameCatalog from './components/GameCatalog';
import GameDetails from './components/GameDetails';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import UserFavorites from './components/UserFavorites';


const App = () => {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<GameCatalog/>} />
                <Route path="/add-game" element={<AddGameForm />} />
                <Route path="/gameDetails/:id" element={<GameDetails />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/favorites" element={<UserFavorites />} />
            </Routes>
        </Router>

        
    );
};

export default App;
