import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { MdCancel } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import Swal from 'sweetalert2';
import FeedbackModal from './FeedbackModal';
import useAuth from '../../../Hooks/useAuth';
import DetailsModal from './DetailsModal';
import Lottie from 'lottie-react';
import loading from "../../../assets/loading.json";
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';

const AllApplications = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusFilter, setStatusFilter] = useState(''); // State for status filtering

  const queryClient = useQueryClient();

  const {
    data: applications = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: async () => {
      let url = `/allApplications?email=${user.email}`;

      // Add status filter if it's set
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }

      const { data } = await axiosSecure.get(url);
      return data;
    },
    queryKey: ['allApplications', statusFilter], // Include statusFilter in the queryKey
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
        axiosSecure
          .put(`/cancelApplication/${cancelId}?email=${user.email}`, { status: 'Rejected' })
          .then((response) => {
            Swal.fire({
              title: 'Rejected!',
              text: 'Application has been canceled.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
            queryClient.invalidateQueries({ queryKey: ['allApplications', statusFilter] });
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
      const response = await axiosSecure.put(`/submitFeedback/${feedback.applicationId}?email=${user.email}`, {
        feedback: feedback.feedback,
        status: 'Processing',
      });

      Swal.fire({
        title: 'Thank You',
        text: 'Your feedback has been submitted',
        icon: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['allApplications', statusFilter] });
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

  const handleApprove = (approveId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will approve the application!',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .put(`/approveApplication/${approveId}?email=${user.email}`, { status: 'Approved' })
          .then((response) => {
            Swal.fire({
              title: 'Approved!',
              text: 'Application has been approved.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
            queryClient.invalidateQueries({ queryKey: ['allApplications', statusFilter] });
          })
          .catch((error) => {
            console.error('Error approving application:', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to approve application. Please try again later.',
              icon: 'error',
              timer: 1500,
              showConfirmButton: false,
            });
          });
      }
    });
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
      <div className="flex items-center mb-4">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mr-2">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          name="statusFilter"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Processing">Processing</option>
        </select>
      </div>

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
                  {application.status !== 'Approved' && (
                    <button onClick={() => handleApprove(application._id)}>
                      <FaCheck className="hover:scale-[1.5]" />
                    </button>
                  )}
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
