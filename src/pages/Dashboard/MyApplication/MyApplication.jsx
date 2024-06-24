import React, { useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import ReviewModal from './ReviewModal';
import Swal from 'sweetalert2';

const MyApplication = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: applications = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios(
        `${import.meta.env.VITE_URL}/myApplication?email=${user.email}`
      );
      return data;
    },
    queryKey: ["applications"],
  });

  const { data: reviews = [], isLoading: reviewLoading, isError: isReviewError, error: err } = useQuery({
    queryFn: async () => {
      const { data } = await axios(
        `${import.meta.env.VITE_URL}/myReviews?email=${user.email}`
      );
      return data;
    },
    queryKey: ["myReviews"],
  });

  const handleAddReviewClick = (scholarship) => {
    setSelectedScholarship(scholarship);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedScholarship(null);
  };
  
  const handleDelete = (deleteId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${import.meta.env.VITE_URL}/deleteApplication/${deleteId}`)
          .then(response => {
            Swal.fire({
              title: "Deleted!",
              text: "Your application has been deleted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false
            });
            queryClient.invalidateQueries({ queryKey: ["applications"] });
          })
          .catch(error => {
            console.error('Error deleting application:', error);
            Swal.fire({
              title: "Error",
              text: "Failed to delete application. Please try again later.",
              icon: "error",
              timer: 1500,
              showConfirmButton: false
            });
            // Handle error (e.g., show error message)
          });
      }
    });
  };

  const handleReviewSubmit = async (review) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/saveReview`, review);
      Swal.fire({
        title: "Thank You",
        text: "Your review has been saved",
        icon: "success"
      });
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
    } catch (error) {
      console.error('Error submitting review:', error);
      // Handle error state or display error message to user
    }
    setIsModalOpen(false); // Close modal after submit
    setSelectedScholarship(null); // Reset selected scholarship
  };
 
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>University Name</th>
              <th>Address</th>
              <th>Subject Category</th>
              <th>Applied Degree</th>
              <th>Total Fees</th>
              <th>Status</th>
              <th>Feedback</th>
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application, idx) => {
              const reviewExist = reviews.some(
                (review) => review.universityId === application.scholarshipDetails._id && review.reviewerEmail === user.email
              );

              return (
                <tr key={idx} className="hover">
                  <th>{idx + 1}</th>
                  <td>{application.scholarshipDetails.universityName}</td>
                  <td>
                    {application.scholarshipDetails.universityCity},{" "}
                    {application.scholarshipDetails.universityCountry}
                  </td>
                  <td>{application.scholarshipDetails.subjectCategory}</td>
                  <td>{application.degree}</td>
                  <td>
                    {application.scholarshipDetails.applicationFees +
                      application.scholarshipDetails.serviceCharge}
                  </td>
                  <td>{application?.status || "pending"}</td>
                  <td>{application?.feedback}</td>
                  <td>
                    <Link to={`/details/${application.scholarshipDetails._id}`} className="btn btn-link"> Details</Link>
                  </td>
                  <td>
                    <button onClick={() => navigate(`/dashboard/editApplication/${application._id}`)}>
                      <FaEdit className="hover:scale-[2]" />
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(application._id)}>
                      <MdCancel className="hover:scale-[2]" />
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-info"
                      onClick={() => handleAddReviewClick(application)}
                      disabled={reviewExist}
                    >
                      {reviewExist ? 'Reviewed' : 'Add Review'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedScholarship && (
        <ReviewModal
          isOpen={isModalOpen}
          onRequestClose={handleModalClose}
          scholarship={selectedScholarship}
          onSubmit={handleReviewSubmit}
        />
      )}
    </>
  );
};

export default MyApplication;
