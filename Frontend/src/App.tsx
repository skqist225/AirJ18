import React from 'react';
import { BrowserRouter as Router, Routes, Route, useMatch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import RoomDetailsPage from './pages/RoomDetailsPage';

function App() {
    return (
        <div className='App'>
            <Router>
                <Routes>
                    <Route path='/' element={<HomePage />}></Route>
                    <Route path='/register' element={<RegisterPage />}></Route>
                    <Route path='/room'>
                        <Route path=':id' element={<RoomDetailsPage />}></Route>
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
