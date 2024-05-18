import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Authentication from "./pages/Authentication";
import AuthProvider from "./contexts/auth/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<Authentication />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
