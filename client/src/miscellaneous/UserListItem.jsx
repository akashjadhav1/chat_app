import React from 'react'


function UserListItem({user,handleFunction}) {
    
  return (
    
    <div onClick={handleFunction} className='flex items-center px-2 my-4 py-2 m-2 mb-2 rounded-lg text-black bg-[#E8E8E8] cursor-pointer hover:bg-[#38B2AC] hover:text-white '>
  <div className='flex-shrink-0'>
    <img className='w-10 h-10 rounded-full border-2 border-black' src={user.pic} alt={user.name} />
  </div>
  <div className='px-4 flex-grow'>
    <p className='text-md font-semibold'>{user.name}</p>
    <p className='text-sm max-w-[210px] truncate '><span className='font-bold'>Email: </span>{user.email}</p>
  </div>
</div>

  )
}

export default UserListItem
