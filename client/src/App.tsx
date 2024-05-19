import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AuthProvider from "./contexts/auth/AuthProvider";
import CreateInterview from "./pages/CreateInterview";
import InterviewsProvider from "./contexts/interviews/InterviewProvider";
import Signup from "./pages/Signup";
import Interview from "./pages/Interview";
import Home from "./pages/Home"
import Navbar from "./components/Navbar";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>  
        <InterviewsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navbar/>} >
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/interviews/create" element={<CreateInterview />} />
              <Route path="/interviews/:interviewId" element={<Interview />} />
            </Route>
          </Routes>
        </Router>
        </InterviewsProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
