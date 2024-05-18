import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth/AuthContext";

import Header1 from "../components/Header1";
import TextInput from "../components/TextInput"
import Button from "../components/Button";

export default function Authentication() {
  const { authState, signupUser, loginUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.user) {
      // redirect to home page if already logged in
      navigate("/");
    }
  }, [authState.user, navigate]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSignUp) {
      signupUser(formData);
    } else {
      loginUser(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex"
    >
      <div className="flex flex-col">
        <Header1 text={isSignUp ? "Sign Up" : "Log In"} />
      </div>
      <div className="flex flex-col">
        <TextInput
          placeholder="Username"
          textValue={formData.username}
          onChange={(value) =>
            setFormData({ ...formData, username: value })
          }
        />

        <TextInput
          placeholder="Password"
          textValue={formData.password}
          onChange={(value) =>
            setFormData({ ...formData, password: value })
          }
        />
      </div>

        <Button
          type="submit"
          element={isSignUp ? "Sign Up" : "Log In"}
          onClick={() => {}}
        />

        <span
          className="text-blue-500 hover:underline cursor-pointer"
          onClick={toggleForm}
        >
          {isSignUp
            ? "Already have an account? Log In"
            : "Don't have an account? Sign Up"}
        </span>
    </form>
  );
}
