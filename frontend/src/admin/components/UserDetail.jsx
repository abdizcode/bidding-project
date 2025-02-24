import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ConfirmationDialog from "./ConfirmationDialog";

const UserDetail = () => {
  const { id } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState("");
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const [reason, setReason] = useState("")

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const res = await axios.get(`/api/users/${id}`)
        if (!res.data) { return (console.log("user not found")) }
        setUser(res.data)
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchuser();
  }, [id])

  const handleOpenDialog = (actionType, user) => {
    setAction(actionType);
    setDialogOpen(true);
    if (actionType !== "reject") {
      setReason(""); // Reset reason unless rejecting
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setAction("");
    setReason("");
  };

  const handleConfirm = () => {
    if (action === "approve") {
      approve();
    } else if (action === "delete") {
      handleDelete();
    } else if (action === "reject") {
      if (!reason.trim()) {
        toast.error("Please provide a reason for rejection.");
        return;
      }
      reject();
    }
    handleCloseDialog();
  };

  const approve = async () => {
    try {
      const res = await axios.post(`/api/users/approve/${id}`);
      if (res.status === 200) {
        toast.success("user approval successfull")
        navigate("/admin/users");
        console.log()
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/users/delete/${id}`);
      toast.success("user deleted successfuly!!")
      navigate("/admin/users");
    } catch (error) {
      toast.error(error)
      console.error("Error deleting auction item:", error);
    }
  };
  const reject = async () => {
    try {
      await axios.post(`/api/users/reject/${id}`, { reason });
      toast.success("user rejected successfuly!!")
      navigate("/admin/users");
    } catch (error) {
      console.error("Error rejecting auction item:", error);
    }
  };

  return (
    <div className='bg-nature p-5 w-full text-whit'>
      {user ? (
        <>
          <div className='flex gap-3 md:gap-6'>
            <div className="w-[35%]">
              <p className='text-yellow'>National ID Image</p>
              <img src={user?.idImage?.filename
                ? `http://localhost:5000/images/${user?.idImage?.filename}`
                : 'http://localhost:5000/images/default.jpg'} alt=""
                className="h-48 w-full  object-fit object-center group-hover:opacity-75" />
                <a href={`http://localhost:5000/images/${user?.idImage?.filename}`} target="_blank" className="text-blue-400">View Image</a>
            </div>
            <div className="flex flex-col w-[35%]">
              <p className='text-yellow'>Tax certificate Image</p>
              <img src={user?.taxCertificate?.filename
                ? `http://localhost:5000/images/${user?.taxCertificate?.filename}`
                : 'http://localhost:5000/images/default.jpg'} alt=""
                className="h-48 w-full  object-fit object-center group-hover:opacity-75" />
                <a href={`http://localhost:5000/images/${user?.taxCertificate?.filename}`} target="_blank" className="text-blue-400">View Image</a>
            </div>
            <div className="flex flex-col w-[35%]">
              <p className='text-yellow'>Business Licence Image</p>
              <img src={user?.businessLicense?.filename
                ? `http://localhost:5000/images/${user?.businessLicense?.filename}`
                : 'http://localhost:5000/images/default.jpg'} alt=""
                className="h-48 w-  object-fit object-center group-hover:opacity-75" />
                <a href={`http://localhost:5000/images/${user?.businessLicense?.filename}`} target="_blank" className="text-blue-400">View Image</a>
            </div>
          </div>
          <div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-semibold text-gray-700 mb-4"><strong>Name:</strong> {user?.username || 'Loading...'}</h1>
              <h1 className="text-lg font-semibold text-gray-700 mb-4"><strong>Email:</strong> {user?.email}</h1>
              <p className="text-lg font- text-gray-700 mb-6"><strong>TIN Number: </strong>{user?.tin||"---"}</p>
              <p className="text-lg font- text-gray-700 mb-6"><strong>Created At:</strong> {user?.createdAt}</p>
              <p className="text-lg font- text-gray-700 mb-6"><strong>Phone Number:</strong> {user?.phone||"---"}</p>
              <p className="text-lg font- text-gray-700 mb-6"><strong>Address:</strong> {user?.address||"---"}</p>

              <div className='flex gap-2'>
                <a href={user?.isFullyRegistered ? `https://etrade.gov.et/business-license-checker?tin=${user?.tin}` : '#'} target={user.isFullyRegistered?'_blank':'_self'} className={`py-3 px-6 rounded-lg transition duration-300 ${user?.isFullyRegistered ? 'bg-yellow-600 text-white hover:bg-slate-700' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}>
                  Check
                </a>
                <button onClick={() => handleOpenDialog("approve", user)} className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-slate-700 transition duration-300" disabled={!user?.isFullyRegistered}>
                  Approve
                </button>
                <button onClick={() => handleOpenDialog("reject", user)} className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-slate-700 transition duration-300">
                  Reject
                </button>
                <button onClick={() => handleOpenDialog("delete", user)} className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-slate-700 transition duration-300">
                  Delete
                </button>
              </div>
            </div>
          </div>
          <ConfirmationDialog
            isOpen={dialogOpen}
            onClose={handleCloseDialog}
            onConfirm={handleConfirm}
            message={
              action === "reject"
                ? "Are you sure you want to reject this user? Provide a reason below."
                : `Are you sure you want to ${action} this user?`
            }
            showReasonInput={action === "reject"}
            reason={reason}
            setReason={setReason}
          />
        </>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  )
}

export default UserDetail