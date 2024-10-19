import React from "react";

function ProfileModel({ user, closeProfileModal }) {

  return (
    <div className="fixed font-serif inset-0 z-50 flex items-center justify-center text-black bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
        <div className="flex justify-center mb-4">
        <img className="w-28 h-28 border-4 border-double object-contain border-blue-500 rounded-full shadow-md" src={user.picture?user.picture:user.pic} alt={user.name} />
        </div>
        
        <p className="mb-4"><span className="font-bold">Name:</span> {user.name}</p>
        <p className="mb-4"><span className="font-bold">Email:</span> {user.email}</p>
        <button
          onClick={closeProfileModal}
          className="text-white bg-red-500 px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ProfileModel;
