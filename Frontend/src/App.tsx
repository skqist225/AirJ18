import { BrowserRouter as Router, Routes, Route, useMatch } from 'react-router-dom';
import {
    BecomeAHostIndexPage,
    BookedRoomsPage,
    HomePage,
    ListingsPage,
    LoginPage,
    ManageBookingPage,
    PropertyAmenitiesPage,
    PropertyCategoryPage,
    PropertyDescriptionPage,
    PropertyGroupPage,
    PropertyLocationPage,
    PropertyPricePage,
    PropertyPrivacyPage,
    PropertyRoomImagesPage,
    PropertyRoomInfoPage,
    PropertyTitlePage,
    RegisterPage,
    RoomDetailsPage,
    RoomPreviewPage,
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
                    <Route path='/user/booked-rooms' element={<BookedRoomsPage />}></Route>
                    <Route path='/booking/listings'>
                        <Route path=':page' element={<ManageBookingPage />} />
                    </Route>
                    <Route path='become-a-host'>
                        <Route path='intro' element={<BecomeAHostIndexPage />}></Route>
                        <Route path='property-type-group' element={<PropertyGroupPage />} />
                        <Route path='property-category' element={<PropertyCategoryPage />} />
                        <Route path='privacy-type' element={<PropertyPrivacyPage />} />
                        <Route path='location' element={<PropertyLocationPage />} />
                        <Route path='room-info' element={<PropertyRoomInfoPage />} />
                        <Route path='amenities' element={<PropertyAmenitiesPage />} />
                        <Route path='photos' element={<PropertyRoomImagesPage />} />
                        <Route path='title' element={<PropertyTitlePage />} />
                        <Route path='description' element={<PropertyDescriptionPage />} />
                        <Route path='price' element={<PropertyPricePage />} />
                        <Route path='preview' element={<RoomPreviewPage />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
