import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const { setUser } = ChatState();
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
  };

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.warning("Please fill all the required fields", toastifyConfig);
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

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      setUser(response.data);
      toast.success("User login successful", toastifyConfig);
      navigate("/chats", { replace: true });

    } catch (error) {
      toast.error("Error on login request", toastifyConfig);
    }
  };

  return (
    <div className="flex justify-center  min-h-screen bg-gray-50 font-[sans-serif]">
      <div className="flex flex-col items-center  w-full max-w-xs sm:max-w-md md:max-w-md lg:max-w-lg xl:max-w-xl py-6 px-4">
        <div className="w-full p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-gray-800 text-center text-2xl md:text-3xl font-bold">Sign in</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-gray-800 text-sm mb-2 block">Email</label>
              <input
                onChange={handleChange}
                name="email"
                type="text"
                required
                className="w-full border border-gray-300 px-4 py-3 text-sm md:text-base rounded-md outline-blue-600"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-2 block">Password</label>
              <input
                onChange={handleChange}
                name="password"
                type="password"
                required
                className="w-full border border-gray-300 px-4 py-3 text-sm md:text-base rounded-md outline-blue-600"
                placeholder="Enter password"
              />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm md:text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
