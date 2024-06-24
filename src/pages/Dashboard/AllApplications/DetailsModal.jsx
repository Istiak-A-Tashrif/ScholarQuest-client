import React from 'react';
import Modal from 'react-modal';

const DetailsModal = ({ isOpen, onRequestClose, application }) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose} 
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">Application Details</h2>
        <p className="mb-2"><strong>University Name:</strong> {application.scholarshipDetails.universityName}</p>
        <p className="mb-2"><strong>Applied Degree:</strong> {application.degree}</p>
        <p className="mb-2"><strong>Scholarship Category:</strong> {application.scholarshipDetails.scholarshipCategory}</p>
        {/* Add other details as needed */}
        <button 
          onClick={onRequestClose} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default DetailsModal;
