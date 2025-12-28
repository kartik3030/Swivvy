import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing.jsx";
import Signup from "./Pages/Signup.jsx";
import Login from "./Pages/Login.jsx";
import ExplorePage from "./Pages/ExplorePage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import EditProfile from "./Pages/EditProfile.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import IsAuthN from "./Components/IsAuthN.jsx";
import ChatPage from "./Pages/ChatPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Explore Page route, If user logged in then go to Explore Page otherwise go to Landing Page */}
        <Route path="/"
          element={<IsAuthN element="/explore" />}
        />

        {/* Landing Route, if user First Time visiting site */}
        <Route path="/" element={<Landing />} />

        {/* Signup Route */}
        <Route path="/signup" element={<Signup />} />

        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Another Explore Route, if user is not authenticated Then must login first */}
        <Route
          path="/explore"
          element={<ProtectedRoute element={ExplorePage} />}
        />

        {/* Profile Route, only accessable if user is authenticated */}
        <Route
          path="/profile"
          element={<ProtectedRoute element={ProfilePage} />}
        />

        <Route
          path="/profile"
          element={<ProfilePage />}
        />

        {/* chatpage */}
        <Route
          path="/chatPage"
          element={<ProtectedRoute element={ChatPage} />}
        />

        {/* EditProfile Route, only accessable if user is authN */}
        <Route
          path="/editProfile"
          element={<ProtectedRoute element={EditProfile} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
