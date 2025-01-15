import React, { useState } from "react";
import axios from "axios";
import { FaHireAHelper } from "react-icons/fa";
import { Si1001Tracklists } from "react-icons/si";
import { toast } from "react-toastify";

const ComplaintForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    type: "",
    body: "",
  });

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/complaints", formData);
      toast.success("Complaint submitted successfully!");
      setFormData({ subject: "", type: "", body: "" });
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Toggle Button */}
      <button
        onClick={handleToggleForm}
        className="bg-yellow-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 transition duration-300"
        aria-label="Toggle Complaint Form"
      >
        {showForm ? "✖" : <Si1001Tracklists size={30}/>}
      </button>

      {/* Complaint Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 bg-white p-5 w-80 rounded-lg shadow-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Submit Complaint</h3>
          <p className="mb-2">please tell us any issue you encountered!!</p>
          
          {/* Subject Field */}
          <div className="mb-4">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          {/* Type Field */}
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="">Select Type</option>
              <option value="General">General</option>
              <option value="Technical">Technical</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Body Field */}
          <div className="mb-4">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700">
              Body
            </label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ComplaintForm;
