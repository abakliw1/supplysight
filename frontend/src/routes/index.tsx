import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardRoute from "./DashboardRoute";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardRoute />} />
        </Routes>
    );
}