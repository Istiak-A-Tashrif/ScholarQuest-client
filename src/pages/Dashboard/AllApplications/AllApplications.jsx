import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import Swal from 'sweetalert2';
import FeedbackModal from './FeedbackModal';
import useAuth from '../../../Hooks/useAuth';
import DetailsModal from './DetailsModal';

const AllApplications = () => {
  const { user } = useAuth();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: applications = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_URL}/allApplications`);
      return data;
    },
    queryKey: ['allApplications'],
  });

  const handleFeedbackClick = (application) => {
    setSelectedApplication(application);
    setIsFeedbackModalOpen(true);
  };

  const handleDetailsClick = (application) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsFeedbackModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleCancel = (cancelId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`${import.meta.env.VITE_URL}/cancelApplication/${cancelId}`, { status: 'Rejected' })
          .then((response) => {
            Swal.fire({
              title: 'Canceled!',
              text: 'Application has been canceled.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
            queryClient.invalidateQueries({ queryKey: ['allApplications'] });
          })
          .catch((error) => {
            console.error('Error canceling application:', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to cancel application. Please try again later.',
              icon: 'error',
              timer: 1500,
              showConfirmButton: false,
            });
          });
      }
    });
  };

  const handleFeedbackSubmit = async (feedback) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_URL}/submitFeedback/${feedback.applicationId}`, {
            feedback: feedback.feedback,
            status: 'Processing',
          });
z          
      Swal.fire({
        title: 'Thank You',
        text: 'Your feedback has been submitted',
        icon: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['allApplications'] });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to submit feedback. Please try again later.',
        icon: 'error',
      });
    }
    handleModalClose();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>University Name</th>
              <th>Scholarship Category</th>
              <th>Subject Category</th>
              <th>Applied Degree</th>
              <th>Application Fees</th>
              <th>Service Charge</th>
              <th>Application Status</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application, idx) => (
              <tr key={application._id} className="hover">
                <th>{idx + 1}</th>
                <td>{application.scholarshipDetails.universityName}</td>
                <td>{application.scholarshipDetails.scholarshipCategory}</td>
                <td>{application.scholarshipDetails.subjectCategory}</td>
                <td>{application.degree}</td>
                <td>{application.scholarshipDetails.applicationFees}</td>
                <td>{application.scholarshipDetails.serviceCharge}</td>
                <td>{application?.status || 'Pending'}</td>
                <td>
                  <button
                    className="btn btn-link"
                    onClick={() => handleDetailsClick(application)}
                  >
                    Details
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-info"
                    onClick={() => handleFeedbackClick(application)}
                  >
                    Feedback
                  </button>
                </td>
                <td>
                  <button onClick={() => handleCancel(application._id)}>
                    <MdCancel className="hover:scale-[2]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedApplication && (
        <>
          <DetailsModal
            isOpen={isDetailsModalOpen}
            onRequestClose={handleModalClose}
            application={selectedApplication}
          />
          <FeedbackModal
            isOpen={isFeedbackModalOpen}
            onRequestClose={handleModalClose}
            application={selectedApplication}
            onSubmit={handleFeedbackSubmit}
          />
        </>
      )}
    </>
  );
};

export default AllApplications;
