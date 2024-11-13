import React, { useState } from "react";
import axios from "axios";
import "../App.css";
const apiUrl: string = import.meta.env.VITE_API_URL;

type Props = {
  setUser: (userData: string) => void;
};

const Login: React.FC<Props> = ({ setUser }) => {
  const [username, setUsername] = useState<string>("");

  const sendUsername = async () => {
    setUsername("");
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        username: username,
      });

      const userData = response.data;
      setUser(userData.username);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Enter your username</h2>
      <input
        className="username-input"
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      ></input>
      <button className="submit-username" onClick={sendUsername}>
        Enter the chat
      </button>
    </div>
  );
};

export default Login;
