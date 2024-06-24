import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import ReactStars from 'react-stars';
import useAuth from '../../../Hooks/useAuth';

const ReviewModal = ({ isOpen, onRequestClose, scholarship, onSubmit, isEditing }) => {
  console.log(scholarship);
  const { user } = useAuth();
  const [ratingPoint, setRatingPoint] = useState(0);
  const [comments, setComments] = useState('');

  useEffect(() => {
    if (isEditing && scholarship) {
      setRatingPoint(scholarship.ratingPoint);
      setComments(scholarship.comments);
    }
  }, [isEditing, scholarship]);
  

  const handleRatingChange = (newRating) => {
    setRatingPoint(newRating);
  };

  const handleSubmit = () => {
    const review = {
      ratingPoint,
      comments,
      reviewDate: new Date().toISOString(), // Automatically set to current date and time
      scholarshipName: scholarship?.scholarshipName || scholarship?.scholarshipDetails?.universityName,
      universityId: scholarship?.universityId || scholarship?.scholarshipDetails?._id,
      scholarshipName: scholarship?.scholarshipDetails?.scholarshipCategory,
      universityName: scholarship?.scholarshipDetails?.universityName,
      universityId: scholarship?.scholarshipDetails?._id,
      reviewerName: user.displayName,
      reviewerImage: user.photoURL || 'https://static.vecteezy.com/system/resources/thumbnails/005/129/844/sm…',
      reviewerEmail: user.email,
    };
    onSubmit(review);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Review' : 'Add Review'}</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Rating:</label>
            <ReactStars
              count={5}
              value={ratingPoint}
              onChange={handleRatingChange}
              size={24}
              color2={'#ffd700'}
              half={false}
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Review Comment:</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {isEditing ? 'Update' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={onRequestClose}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ReviewModal;
