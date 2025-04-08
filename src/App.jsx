import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import TopBar from './Main/TopBar';

function App() {
    const { pathname } = useLocation();
    const shouldHideTopBar = ['/login', '/signup', '/forgot', '/resetpass', '/verify', '/manager', '/admin-extra'].includes(pathname);

    return (
        <div>
            {!shouldHideTopBar && <TopBar />}
            <AppRoutes />
        </div>
    );
}

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}
