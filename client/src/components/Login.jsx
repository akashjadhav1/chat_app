import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider"; // Assuming you have a ChatProvider for state management
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const { setUser } = ChatState(); // Assuming setUser is a function from ChatState to set the user data globally
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

const toastifyConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
}

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.warning("Please fill all the required fields",toastifyConfig);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const formData = {
        email: loginData.email,
        password: loginData.password,
      };

      const response = await axios.post(
        "https://chat-app-wybw.onrender.com/api/user/login",
        formData,
        config
      );

      // Store token and user info in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      // Update the global user state with the response data
      setUser(response.data);
      toast.success("User login successful",toastifyConfig)
      // Navigate to the chats route and pass state
      navigate("/chats", { replace: true });

    } catch (error) {
      toast.error("Error on login request",toastifyConfig);
    }
  };

  return (
    <div className="bg-gray-50 font-[sans-serif] rounded">
      <div className="flex flex-col items-center justify-center py-4 px-4">
        <div className="max-w-md w-full">
          <div className="p-4 rounded-2xl bg-white shadow">
            <h2 className="text-gray-800 text-center text-2xl font-bold">Sign in</h2>
            <form className="mt-4 space-y-2" onSubmit={handleSubmit}>
              <div>
                <label className="text-gray-800 text-sm mb-2 block">User name</label>
                <div className="relative flex items-center">
                  <input
                    onChange={handleChange}
                    name="email"
                    type="text"
                    required
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Enter user name"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                <div className="relative flex items-center">
                  <input
                    onChange={handleChange}
                    name="password"
                    type="password"
                    required
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className="!mt-8">
                <button type="submit" className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
