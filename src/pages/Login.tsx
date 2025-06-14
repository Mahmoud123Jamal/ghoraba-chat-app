import "../styles/pages/Login.css";
import { useState } from "react";
import defaultAvatar from "../assets/avatar.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { authService, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
// import upload from "../lib/upload"; // Uncomment if using file upload

export default function Login() {
  const navigate = useNavigate();
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Optional Avatar Upload State (Commented)
  // const [avatar, setAvatar] = useState<{ file: File | null; url: string }>({
  //   file: null,
  //   url: "",
  // });

  // const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const url = URL.createObjectURL(file);
  //     setAvatar({ file, url });
  //   }
  // };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginLoading(true);

    const formData = new FormData(e.currentTarget);
    const { email, password } = Object.fromEntries(formData) as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      toast.error("Please fill all fields");
      setLoginLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(authService, email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        toast.error("No user found with this email.");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else {
        toast.error(err.message || "Login failed");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterLoading(true);

    const formData = new FormData(e.currentTarget);
    const { username, email, password } = Object.fromEntries(formData) as {
      username: string;
      email: string;
      password: string;
    };

    if (!username || !email || !password) {
      toast.error("Please fill all fields");
      setRegisterLoading(false);
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(authService, email, password);

      // Optional Avatar Upload (Commented)
      // let imgUrl = "";
      // if (avatar.file) {
      //   imgUrl = await upload(avatar.file);
      // }

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: defaultAvatar, // Replace with `imgUrl` if using upload
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), { chats: [] });

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email is already in use.");
      } else {
        toast.error(error.message || "Registration failed");
      }
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center min-vh-100 bg-dark">
      <div className="form-container d-flex flex-column flex-lg-row align-items-stretch p-4 rounded-4 shadow-lg gap-4">

        {/* Login Form */}
        <div className="login-form flex-grow-1 p-3 p-md-4 rounded-4 bg-secondary bg-opacity-10">
          <h2 className="mb-4 text-center text-light">Welcome Back</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="form-control bg-dark text-light border-secondary"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="form-control bg-dark text-light border-secondary"
              />
            </div>
            <button
              className="btn btn-lg btn-primary w-100 py-2 fw-medium"
              type="submit"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status" />
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="d-lg-none d-flex align-items-center my-3">
          <div className="flex-grow-1 border-top border-secondary"></div>
          <div className="px-3 text-light fw-light">OR</div>
          <div className="flex-grow-1 border-top border-secondary"></div>
        </div>

        {/* Register Form */}
        <div className="register-form flex-grow-1 p-3 p-md-4 rounded-4 bg-secondary bg-opacity-10">
          <h2 className="mb-4 text-center text-light">Create Account</h2>
          <form onSubmit={handleRegister}>

            {/* Optional Avatar Upload UI (Commented) */}
            {/* 
            <div className="mb-3">
              <label htmlFor="photo" className="form-label text-light d-flex align-items-center gap-2">
                <div className="avatar-container position-relative">
                  <img
                    src={avatar.url || defaultAvatar}
                    alt="avatar"
                    className="avatar rounded-circle border border-secondary"
                    width={50}
                    height={50}
                  />
                  <div className="upload-indicator position-absolute bottom-0 end-0 bg-primary rounded-circle p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 16 16">
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                      <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                    </svg>
                  </div>
                </div>
                <span className="text-light opacity-75">Upload Profile Photo</span>
              </label>
              <input id="photo" type="file" accept="image/*" className="d-none" onChange={handleAvatar} />
            </div> 
            */}

            <div className="mb-3">
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
                minLength={6}
                maxLength={20}
                pattern="^[a-zA-Z][a-zA-Z0-9_]{5,}$"
                title="Username must start with a letter and be at least 6 characters long. Only letters, numbers, and underscores are allowed."
                className="form-control bg-dark text-light border-secondary"
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="form-control bg-dark text-light border-secondary"
              />
            </div>
            <div className="mb-3">
            <input
  type="password"
  name="password"
  placeholder="Password"
  required
  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
  title="Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
  className="form-control bg-dark text-light border-secondary"
/>
            </div>

            <button
              className="btn btn-lg btn-primary w-100 py-2 fw-medium"
              type="submit"
              disabled={registerLoading}
            >
              {registerLoading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <div className="spinner-border spinner-border-sm me-2" role="status" />
                  Creating account...
                </div>
              ) : (
                "Register"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
