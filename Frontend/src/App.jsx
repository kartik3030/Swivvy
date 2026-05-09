import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./views/Landing.js";
import Signup from "./views/Signup.jsx";
import Login from "./views/Login.js";
import ExplorePage from "./views/Explore.jsx";
import ProfilePage from "./views/Profile.jsx";
import EditProfile from "./views/EditProfile.js";
import ChatPage from "./views/Chat.jsx";

import IsAuthN from "./component/IsAuthN.js";
import ProtectedRoute from "./component/ProtectedRoute.js";

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
