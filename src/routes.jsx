import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import Login from './Login/Login';
import SignUp from './Login/SignUp';
import ForgotPass from './Login/ForgotPass';
import ResetPass from './Login/ResetPass';
import Verify from './Login/Verify';
import Loader from './Login/Loader';
import Home from './Main/Home';
import Academy from './pages/Academy';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import Gallery from './pages/Gallery';
import Ground from './pages/Ground';
import ManagerDashboard from './Manager/ManagerDashboard';
import AdminExtraPage from './Admin/AdminExtraPage'; // Import your extra admin page

const ADMIN_IDS = import.meta.env.VITE_ADMIN_IDS?.split(',') || []; // Convert .env string to array

const AppRoutes = () => {
    // Get encrypted user role and ID
    const encryptedRole = localStorage.getItem('role');
    const encryptedUserId = localStorage.getItem('userid');

    let role = '';
    let userId = '';

    if (encryptedRole) {
        role = CryptoJS.AES.decrypt(encryptedRole, import.meta.env.VITE_ENC_KEY).toString(CryptoJS.enc.Utf8);
    }

    if (encryptedUserId) {
        userId = CryptoJS.AES.decrypt(encryptedUserId, import.meta.env.VITE_ENC_KEY).toString(CryptoJS.enc.Utf8);
    }

    const isAdmin = ADMIN_IDS.includes(userId); // Check if user ID is in the admin list

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot" element={<ForgotPass />} />
            <Route path="/resetpass" element={<ResetPass />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/loading" element={<Loader />} />
            <Route path="/academy" element={<Academy />} />
            <Route path='/contactus' element={<ContactUs />} />
            <Route path='/aboutus' element={<AboutUs />} />
            <Route path='/gallery' element={<Gallery />} />
            <Route path='/playground' element={<Ground />} />

            {/* Manager Access */}
            {role === 'Manager' && <Route path="/manager" element={<ManagerDashboard />} />}

            {/* Admin Access (Admins get access to Manager + Extra Admin Page) */}
            {isAdmin && (
                <>
                    <Route path="/manager" element={<ManagerDashboard />} />
                    <Route path="/admin-extra" element={<AdminExtraPage />} />
                </>
            )}

            {/* Redirect Non-Managers Away */}
            {role !== 'Manager' && !isAdmin && <Route path="/manager" element={<Navigate to="/login" />} />}

            <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
    );
};

export default AppRoutes;
