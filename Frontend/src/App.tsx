import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./views/Landing";
import Signup from "./views/Signup";
import Login from "./views/Login";
import ExplorePage from "./views/Explore";
import ProfilePage from "./views/Profile";
import EditProfile from "./views/EditProfile";
import ChatPage from "./views/Chat";

import IsAuthN from "./component/IsAuthN";
import ProtectedRoute from "./component/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IsAuthN />} />

        <Route path="/landing" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

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