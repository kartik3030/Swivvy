import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./Pages/Landing.jsx";
import Signup from "./Pages/Signup.jsx";
import Login from "./Pages/Login.jsx";
import ExplorePage from "./Pages/ExplorePage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import EditProfile from "./Pages/EditProfile.jsx";
import ChatPage from "./Pages/ChatPage.jsx";

import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import IsAuthN from "./Components/IsAuthN.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Root decision route */}
        <Route path="/" element={<IsAuthN />} />

        {/* Public */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected wrapper */}
        <Route element={<ProtectedRoute />}>
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chatPage" element={<ChatPage />} />
          <Route path="/editProfile" element={<EditProfile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
