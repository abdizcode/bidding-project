import React, { useEffect, useState } from "react";
import axios from "axios";

const Compliant = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch complaints from the backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.post("/api/users/complaint");        
        setComplaints(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading complaints...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Complaints</h2>
      {complaints.length > 0 ? (
        <ul className="space-y-4">
          {complaints.map((complaint) => (
            <li
              key={complaint._id}
              className="p-4 bg-white rounded-md shadow-md border border-gray-200 lg:flex items-center justify-between"
            >
              <h3 className="text-lg font-bold text-gray-900">
                Subject: {complaint.subject}
              </h3>
              <p className="text-sm text-gray-600 ">
                Type: {complaint.type}
              </p>
              <p className="text-gray-700">Description: {complaint.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No complaints found.</p>
      )}
    </div>
  );
};

export default Compliant;
