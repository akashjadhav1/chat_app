import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import showpassword from '../assets/showpassword.svg'
import hidepassword from '../assets/hidepassword.svg'
 
function Signup({ setActiveTab }) {
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

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: null, // Store the selected file for image upload
  });
  const [loading, setLoading] = useState(false); // To handle loading state
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to toggle confirm password visibility

  const handleChange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setData({ ...data, pic: e.target.files[0] }); // Store the selected file for image upload
  };

  const uploadImageToCloudinary = async () => {
    if (!data.pic) return null; // If no image is selected, return null

    const formData = new FormData();
    formData.append("file", data.pic);
    formData.append("upload_preset", "chat-app"); // Your Cloudinary preset
    formData.append("cloud_name", "db4e0k6un"); // Your Cloudinary cloud name

    try {
      setLoading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/db4e0k6un/image/upload",
        formData
      );
      setLoading(false);
      return response.data.url; // Return the URL of the uploaded image
    } catch (error) {
      setLoading(false);
      toast.error("Error uploading image to Cloudinary", toastifyConfig);
      return null;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    // Check if passwords match and required fields are filled
    if (!data.name || !data.email || !data.password) {
      toast.warning("Please fill all the required fields", toastifyConfig);
      return;
    }
    if (data.password !== data.confirmPassword) {
      toast.warning("Passwords do not match!", toastifyConfig);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const imageUrl = await uploadImageToCloudinary(); // Upload image to Cloudinary
      const formData = {
        name: data.name,
        email: data.email,
        password: data.password,
        pic: imageUrl || "", // Send the Cloudinary image URL if available, else an empty string
      };

      await axios.post("https://chat-app-wybw.onrender.com/api/user/register", formData, config);

      setActiveTab("login");
      toast.success("Signup successful", toastifyConfig);
    } catch (error) {
      toast.error("Error on signup request", toastifyConfig);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center font-[sans-serif] p-2">
        <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-2">
          <h2 className="text-gray-800 text-center text-2xl font-bold">Sign up</h2>
          <form>
            <div className="space-y-2">
              <div>
                <label className="text-gray-800 text-sm mb-1 block">Name</label>
                <input
                  onChange={handleChange}
                  name="name"
                  type="text"
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md outline-blue-500"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-1 block">Email Id</label>
                <input
                  onChange={handleChange}
                  name="email"
                  type="email"
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md outline-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-1 block">Password</label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    name="password"
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md outline-blue-500"
                    placeholder="Enter password"
                  />
                  <img
                    src={showPassword ? showpassword : hidepassword}
                    alt="show"
                    className="absolute inset-y-2 w-5 h-5 right-3 text-sm text-gray-600 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                    
                 
                </div>
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-1 block">Confirm Password</label>
                <div className="relative">
                  <input
                    onChange={handleChange}
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
                    className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md outline-blue-500"
                    placeholder="Confirm password"
                  />
                  <img
                    src={showConfirmPassword ? showpassword : hidepassword}
                    alt="show"
                    className="absolute inset-y-2 w-5 h-5 right-3 text-sm text-gray-600 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-1 block">Upload a picture</label>
                <input
                  onChange={handleFileChange}
                  name="pic"
                  type="file"
                  accept="image/*"
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md outline-blue-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSignup}
                type="button"
                className="w-full py-3 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Create an account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
