import React, { useState } from 'react';
import Modal from 'react-modal';

const FeedbackModal = ({ isOpen, onRequestClose, application, onSubmit }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    const feedbackData = {
      applicationId: application._id,
      feedback,
    };
    onSubmit(feedbackData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">Provide Feedback</h2>
        <textarea
          className="border border-gray-300 rounded-md w-full p-2 mb-4"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter feedback here..."
          rows={6}
        />
        <div className="flex justify-end">
          <button
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit Feedback
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onRequestClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
