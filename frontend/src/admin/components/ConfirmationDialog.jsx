const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    message,
    showReasonInput,
    reason,
    setReason,
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white text-black rounded-lg shadow-lg p-6 w-96">
          <p className="text-lg font-semibold text-center mb-4">{message}</p>
          {showReasonInput && (
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Provide a reason for rejection..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          )}
          <div className="flex justify-center gap-4">
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            
          </div>
        </div>
      </div>
    );
  };
  
  export default ConfirmationDialog;
  