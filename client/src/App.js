import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import LandingPage from "./Pages/LandingPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import AnalyticsPage from "./Pages/AnalyticsPage";
import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";
import "./index.css";
import Footer from "./components/layout/Footer";

// Landing page — navbar + footer
function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

// Internal app pages — navbar + footer
function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function AuthLayout({ children }) {
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <LandingPage />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/analytics/:shortCode"
          element={
            <AppLayout>
              <AnalyticsPage />
            </AppLayout>
          }
        />
        <Route
          path="/home"
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
