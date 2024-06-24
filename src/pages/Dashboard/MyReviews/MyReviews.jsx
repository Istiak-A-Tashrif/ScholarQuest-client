import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";
import formatDateToDdmmyyyy from "../../../Utility/formatDateToDdmmyyyy";
import Swal from "sweetalert2";
import ReviewModal from "../MyApplication/ReviewModal";
import loading from "../../../assets/loading.json";

const MyReviews = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const { data: reviews = [], isLoading, isError, error } = useQuery({
    queryFn: async () => {
      const { data } = await axios(
        `${import.meta.env.VITE_URL}/myReviews?email=${user.email}`
      );
      return data;
    },
    queryKey: ["myReviews"],
  });

  const handleDelete = async (reviewId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${import.meta.env.VITE_URL}/deleteReview/${reviewId}`);
          Swal.fire("Deleted!", "Your review has been deleted.", "success");
          queryClient.invalidateQueries("myReviews");
        } catch (error) {
          console.error("Error deleting review:", error);
          Swal.fire("Error", "Failed to delete review. Please try again later.", "error");
        }
      }
    });
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const handleReviewSubmit = async (updatedReview) => {
    try {
      await axios.put(`${import.meta.env.VITE_URL}/updateReview/${selectedReview._id}`, updatedReview);
      Swal.fire("Success", "Review updated successfully", "success");
      queryClient.invalidateQueries("myReviews");
    } catch (error) {
      console.error("Error updating review:", error);
      Swal.fire("Error", "Failed to update review. Please try again later.", "error");
    }
    handleModalClose();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center  min-h-[calc(100vh-300px)]">
        <Lottie animationData={loading} loop={true} className="h-44"></Lottie>
      </div>
    );
  }

  if (isError || error) {
    console.error(error);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>University Name</th>
              <th>Scholarship Name</th>
              <th>Review Comments</th>
              <th>Review Date</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, idx) => (
              <tr key={idx} className="hover">
                <th>{idx + 1}</th>
                <td>{review.universityName}</td>
                <td>{review.scholarshipName}</td>
                <td>{review.comments}</td>
                <td>{formatDateToDdmmyyyy(review.reviewDate)}</td>
                <td>
                  <FaEdit className="hover:scale-[2]" onClick={() => handleEdit(review)} />
                </td>
                <td>
                  <MdDeleteForever className="hover:scale-[2]" onClick={() => handleDelete(review._id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedReview && (
        <ReviewModal
          isOpen={isModalOpen}
          onRequestClose={handleModalClose}
          scholarship={selectedReview}
          onSubmit={handleReviewSubmit}
          isEditing // Pass a prop to indicate editing mode
        />
      )}
    </>
  );
};

export default MyReviews;
