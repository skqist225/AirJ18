import { BrowserRouter as Router, Routes, Route, useMatch } from 'react-router-dom';
import {
    HomePage,
    ListingsPage,
    LoginPage,
    RegisterPage,
    RoomDetailsPage,
    WishListsPage,
} from './pages';
import PersonalInfoPage from './pages/PersonalInfoPage';

function App() {
    return (
        <div className='App'>
            <Router>
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/register' element={<RegisterPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/account-settings/personal-info' element={<PersonalInfoPage />} />
                    <Route path='/room'>
                        <Route path=':id' element={<RoomDetailsPage />} />
                    </Route>
                    <Route path='/hosting/listings'>
                        <Route path=':page' element={<ListingsPage />} />
                    </Route>
                    <Route path='/wishlists' element={<WishListsPage />}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
