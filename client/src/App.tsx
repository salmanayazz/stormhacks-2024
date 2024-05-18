import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AuthProvider from "./contexts/auth/AuthProvider";
import CreateInterview from "./pages/CreateInterview";
import InterviewsProvider from "./contexts/interviews/InterviewProvider";
import Signup from "./pages/Signup";


function App() {
  return (
    <AuthProvider>
      <InterviewsProvider>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/interviews/create" element={<CreateInterview />} />
        </Routes>
      </Router>
      </InterviewsProvider>
    </AuthProvider>
  );
}

export default App;
