import axios from 'axios';
import React, { useEffect, useState } from 'react'

const UserNotification = () => {
  const [notifications, setNotification] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setopen] = useState(false)

  // Fetch complaints from the backend
  useEffect(() => {
    const fetchNotification = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];
      try {
        const res = await axios.post("/api/notification/userNotification", {},
          {
            headers: { Authorization: `Bearer ${token}` },
          });
        setNotification(res.data.notifications);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNotification();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading complaints...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }
  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-xl font-semibold mb-4 text-white">Notification</h2>
      {notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className="p-2 bg-white rounded-md shadow-md border border-gray-200 "
            >
              <div className='lg:flex items-center justify-betwee gap-3'>
                <div className='rounded-full w-10 h-10 bg-slate-500 text-center text-white pt-2 font-bold'>M</div>
                <div className='flex items-center justify-between w-full'>
                  <h3 className="text-lg font-bold text-gray-900">
                    {notification.type}
                  </h3>
                  <p className="text-sm text-gray-600 ">
                    Date: {notification.createdAt}
                  </p>
                  <button onClick={() => { setopen(true) }} className='border px-4'>View</button>
                </div>
                <br />

                {/*  */}
              </div>
              {open ? <p className="text-gray-700">Description: {notification.body}</p> : <></>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No notification found.</p>
      )}
    </div>
  )
}

export default UserNotification