import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Authentication from "./pages/Authentication";
import AuthProvider from "./contexts/auth/AuthProvider";
import CreateInterview from "./pages/CreateInterview";
import InterviewsProvider from "./contexts/interviews/InterviewProvider";

function App() {
  return (
    <AuthProvider>
      <InterviewsProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Authentication />} />
          <Route path="/interviews/create" element={<CreateInterview />} />
        </Routes>
      </Router>
      </InterviewsProvider>
    </AuthProvider>
  );
}

export default App;
