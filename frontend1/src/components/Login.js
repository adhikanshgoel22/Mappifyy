import { Cancel, Room } from "@mui/icons-material";
import axios from "axios";
import { useRef, useState } from "react";
import "./Login.css";

export default function Login({ setShowLogin, setCurrentUsername, myStorage }) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post("http://localhost:8080/api/users/login", user); // Assuming you have a login endpoint
      setCurrentUsername(res.data.username);
      myStorage.setItem('user', res.data.username);
      setShowLogin(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room className="logoIcon" />
        <span>LamaPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="Username" ref={usernameRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Incorrect username or password!</span>}
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}
