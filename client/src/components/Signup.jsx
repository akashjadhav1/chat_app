import React, { useState ,useNavigate} from "react";
import axios from "axios";


function Signup({setActiveTab}) {
  
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: null, // Store the selected file for image upload
  });
  const [loading, setLoading] = useState(false); // To handle loading state

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
      console.log("Error uploading image to Cloudinary", error);
      return null;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault()
    // Check if passwords match and required fields are filled
    if (!data.name || !data.email || !data.password) {
      console.log("Please fill all the required fields");
      return;
    }
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
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

      
      const response = await axios.post(
        "http://localhost:8000/api/user/register",
        formData,
        config
      );
      // console.log("Signup successful", response.data);
      setActiveTab("login")
    } catch (error) {
      console.log("Error on signup request", error.response?.data || error);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center font-[sans-serif] p-2">
        <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-2">
          <h2 className="text-gray-800 text-center text-2xl font-bold">
            Sign up
          </h2>
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
                <label className="text-gray-800 text-sm mb-1 block">
                  Email Id
                </label>
                <input
                  onChange={handleChange}
                  name="email"
                  type="email" // Use email type for better validation
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md outline-blue-500"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-1 block">
                  Password
                </label>
                <input
                  onChange={handleChange}
                  name="password"
                  type="password"
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md outline-blue-500"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-1 block">
                  Confirm Password
                </label>
                <input
                  onChange={handleChange}
                  name="confirmPassword"
                  type="password"
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md outline-blue-500"
                  placeholder="Confirm password"
                />
              </div>
              <div>
                <label className="text-gray-800 text-sm mb-1 block">
                  Upload a picture
                </label>
                <input
                  onChange={handleFileChange}
                  name="pic"
                  type="file"
                  accept="image/*"
                  className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2 rounded-md outline-blue-500"
                />
              </div>
            </div>

            <div className="!mt-6">
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
