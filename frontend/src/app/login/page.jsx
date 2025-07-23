// "use client";

// import React, { useState } from "react";
// import "./login.css";
// import Image from "next/image";

// const Login = () => {
//   const [activeTab, setActiveTab] = useState("login");
//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });
//   const [signupData, setSignupData] = useState({
//     role: "",
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   const switchTab = (tab) => {
//     setActiveTab(tab);
//   };

//   const handleLoginChange = (e) => {
//     setLoginData({
//       ...loginData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSignupChange = (e) => {
//     setSignupData({
//       ...signupData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     // send the data to backend
//     alert(
//       "Login functionality will be implemented here\nEmail: " + loginData.email
//     );
//   };

//   const handleSignup = (e) => {
//     e.preventDefault();
//     // send the data to backend
//     alert(
//       `Sign up functionality will be implemented here\nRole: ${signupData.role}\nName: ${signupData.name}\nEmail: ${signupData.email}`
//     );
//   };

//   const showForgotPassword = () => {
//     alert("Forgot password functionality will be implemented here");
//   };

//   return (
//     <div className="container">
//       <div className="background-image"></div>

//       <div className="floating-elements">
//         <div className="floating-circle"></div>
//         <div className="floating-circle"></div>
//         <div className="floating-circle"></div>
//         <div className="floating-circle"></div>
//       </div>

//       <div className="left-panel">
//         <div className="auth-container">
//           <div className="logo">

//             <h1>🚌 Skoola Bus</h1>

//             <p>Safe & Reliable School Transport</p>
//           </div>

//           <div className="auth-tabs">
//             <button
//               className={`tab-button ${activeTab === "login" ? "active" : ""}`}
//               onClick={() => switchTab("login")}
//             >
//               Login
//             </button>
//             <button
//               className={`tab-button ${activeTab === "signup" ? "active" : ""}`}
//               onClick={() => switchTab("signup")}
//             >
//               Sign Up
//             </button>
//           </div>

//           <div
//             className={`form-container ${
//               activeTab === "login" ? "active" : ""
//             }`}
//           >
//             <form onSubmit={handleLogin}>
//               <div className="form-group">
//                 <label htmlFor="login-email">Email Address</label>
//                 <input
//                   type="email"
//                   id="login-email"
//                   name="email"
//                   placeholder="Enter your email"
//                   value={loginData.email}
//                   onChange={handleLoginChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="login-password">Password</label>
//                 <input
//                   type="password"
//                   id="login-password"
//                   name="password"
//                   placeholder="Enter your password"
//                   value={loginData.password}
//                   onChange={handleLoginChange}
//                   required
//                 />
//               </div>
//               <button type="submit" className="submit-btn">
//                 Login
//               </button>
//             </form>
//             <div className="forgot-password">
//               <a href="#" onClick={showForgotPassword}>
//                 Forgot Password?
//               </a>
//             </div>
//           </div>

//           <div
//             className={`form-container ${
//               activeTab === "signup" ? "active" : ""
//             }`}
//           >
//             <form onSubmit={handleSignup}>
//               <div className="form-group">
//                 <label htmlFor="signup-role">I am a:</label>
//                 <select
//                   id="signup-role"
//                   name="role"
//                   value={signupData.role}
//                   onChange={handleSignupChange}
//                   required
//                 >
//                   <option value="">Select your role</option>
//                   <option value="parent">Parent/Guardian</option>
//                   <option value="school">School Administrator</option>
//                   <option value="driver">Bus Driver</option>
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label htmlFor="signup-name">Full Name</label>
//                 <input
//                   type="text"
//                   id="signup-name"
//                   name="name"
//                   placeholder="Enter your full name"
//                   value={signupData.name}
//                   onChange={handleSignupChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="signup-email">Email Address</label>
//                 <input
//                   type="email"
//                   id="signup-email"
//                   name="email"
//                   placeholder="Enter your email"
//                   value={signupData.email}
//                   onChange={handleSignupChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="signup-phone">Phone Number</label>
//                 <input
//                   type="tel"
//                   id="signup-phone"
//                   name="phone"
//                   placeholder="Enter your phone number"
//                   value={signupData.phone}
//                   onChange={handleSignupChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="signup-password">Password</label>
//                 <input
//                   type="password"
//                   id="signup-password"
//                   name="password"
//                   placeholder="Create a password"
//                   value={signupData.password}
//                   onChange={handleSignupChange}
//                   required
//                 />
//               </div>
//               <button type="submit" className="submit-btn">
//                 Create Account
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       <div className="right-panel">
//         <Image
//           src="/bus-hero.png"
//           alt="School Bus with children"
//           width={800}
//           height={800}
//           priority
//         />
//       </div>
//     </div>
//   );
// };

// export default Login;


"use client";

import React, { useState } from "react";
import "./login.css";
import Image from "next/image";
import {useAuth} from '@/hooks/useAuth'
import { useRouter } from "next/navigation";


const Login = () => {
  const router = useRouter();
  const { login, register } = useAuth(); 
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    role: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
  });

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // send the data to backend
    await login(loginData).then(() => {
    console.log(
      "Login functionality will be implemented here\nEmail: " + loginData.email
    );
    router.push("/bookings");
  });
};


  const handleSignup = async (e) => {
    e.preventDefault();
    // send the data to backend
    await register(signupData).then(()=>{
      console.log(
        `Sign up functionality will be implemented here\nRole: ${signupData.role}\nName: ${signupData.name}\nEmail: ${signupData.email}`
      );
      router.push("/bookings")
    });
  };

  const showForgotPassword = () => {
    alert("Forgot password functionality will be implemented here");
  };

  return (
    <div className="container">
      <div className="background-image"></div>

      <div className="floating-elements">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
      </div>

      <div className="left-panel">
        <div className="auth-container">
          <div className="logo">

            <h1>🚌 Skoola Bus</h1>

            <p>Safe & Reliable School Transport</p>
          </div>

          <div className="auth-tabs">
            <button
              className={`tab-button ${activeTab === "login" ? "active" : ""}`}
              onClick={() => switchTab("login")}
            >
              Login
            </button>
            <button
              className={`tab-button ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => switchTab("signup")}
            >
              Sign Up
            </button>
          </div>

          <div
            className={`form-container ${
              activeTab === "login" ? "active" : ""
            }`}
          >
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                Login
              </button>
            </form>
            <div className="forgot-password">
              <a href="#" onClick={showForgotPassword}>
                Forgot Password?
              </a>
            </div>
          </div>

          <div
            className={`form-container ${
              activeTab === "signup" ? "active" : ""
            }`}
          >
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label htmlFor="signup-role">I am a:</label>
                <select
                  id="signup-role"
                  name="role"
                  value={signupData.role}
                  onChange={handleSignupChange}
                  required
                >
                  <option value="">Select your role</option>
                  <option value="parent">Parent/Guardian</option>
                  <option value="school">School Administrator</option>
                  <option value="driver">Bus Driver</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="signup-name">Full Name</label>
                <input
                  type="text"
                  id="signup-name"
                  name="username"
                  placeholder="Enter your full name"
                  value={signupData.username}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-email">Email Address</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-phone">Phone Number</label>
                <input
                  type="tel"
                  id="signup-phone"
                  name="mobile"
                  placeholder="Enter your phone number"
                  value={signupData.mobile}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  placeholder="Create a password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="right-panel">
        <Image
          src="/bus-hero.png"
          alt="School Bus with children"
          width={1200}
          height={1200}
          priority
        />
      </div>
    </div>
  );
};

export default Login;