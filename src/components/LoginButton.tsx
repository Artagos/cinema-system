import { Link } from 'react-router-dom';
import {useAuth} from "../contexts/AuthContext.tsx";

export default function LoginButton() {
    const {isAuthenticated}= useAuth()
    if(isAuthenticated) return null;
  return (
    <Link to="/login" className="login-button">
      Staff Login
    </Link>
  );
}
