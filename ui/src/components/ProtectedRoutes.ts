import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import React from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : React.createElement(Navigate, { to: "/login" });
};

export default ProtectedRoute;