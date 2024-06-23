import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../Hooks/useAuth";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import ReviewModal from './ReviewModal';

const MyApplication = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

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

  const handleAddReviewClick = (scholarship) => {
    setSelectedScholarship(scholarship);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedScholarship(null);
  };

  const handleReviewSubmit = (review) => {
    console.log("Review submitted:", review);
    // Add your review submission logic here, such as sending the review to the server
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
              <th></th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application, idx) => (
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
                <td>{application.scholarshipDetails?.status || "pending"}</td>
                <td>
                  <Link className="btn btn-link"> Details</Link>
                </td>
                <td>
                  <FaEdit className="hover:scale-[2]"></FaEdit>
                </td>
                <td>
                  <MdCancel className="hover:scale-[2]"></MdCancel>
                </td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => handleAddReviewClick(application)}
                  >
                    Add Review
                  </button>
                </td>
              </tr>
            ))}
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
