import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Notification = () => {
  const [notifications, setNotification] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch complaints from the backend
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await axios.post("/api/notification/allNotification");        
        setNotification(res.data);
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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Notification</h2>
      {notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className="p-4 bg-white rounded-md shadow-md border border-gray-200 lg:flex items-center justify-between"
            >
              <h3 className="text-lg font-bold text-gray-900">
                Type: {notification.type}
              </h3>
              <p className="text-sm text-gray-600 ">
                Date: {notification.createdAt}
              </p>
              {/* <p className="text-gray-700">Description: {notification.body}</p> */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No notification found.</p>
      )}
    </div>
  )
}

export default Notification