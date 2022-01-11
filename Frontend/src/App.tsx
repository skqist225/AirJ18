import { BrowserRouter as Router, Routes, Route, useMatch } from 'react-router-dom';
import { ProtectedRoute } from './components/route/ProtectedRoute';
import { HomePage, ListingsPage, LoginPage, RegisterPage, RoomDetailsPage } from './pages';
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
                        <ProtectedRoute path=':page' element={<ListingsPage />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
