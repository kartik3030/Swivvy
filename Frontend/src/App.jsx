import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./Pages/Landing.jsx";
import Signup from "./Pages/Signup.jsx";
import Login from "./Pages/Login.jsx";
import ExplorePage from "./Pages/ExplorePage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import EditProfile from "./Pages/EditProfile.jsx";
import ChatPage from "./Pages/ChatPage.jsx";

import IsAuthN from "./Components/IsAuthN.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ENTRY DECISION */}
        <Route path="/" element={<IsAuthN />} />

        {/* PUBLIC */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route element={<ProtectedRoute />}>
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/editProfile" element={<EditProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
