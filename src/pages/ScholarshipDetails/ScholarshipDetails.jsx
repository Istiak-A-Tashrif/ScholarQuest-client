import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import useAuth from "../../Hooks/useAuth";
import formatDateToDdmmyyyy from "../../Utility/formatDateToDdmmyyyy";
import Lottie from "lottie-react";
import loading from "../../assets/loading.json";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch scholarship details
  const { data: scholarshipData, isLoading: scholarshipLoading, isError: scholarshipError, error: scholarshipErrorObj } = useQuery({
    queryKey: ["details", id],
    queryFn: async () => {
      const { data } = await axiosSecure(`/details/${id}?email=${user.email}`);
      return data;
    },
  });

  // Fetch payment status
  const { data: checkPaymentData = [], isLoading: checkPaymentLoading, isError: checkPaymentError, error: chekPaymentError } = useQuery({
    queryFn: async () => {
      const { data } = await axiosSecure(`${import.meta.env.VITE_URL}/checkPayment?email=${user.email}&id=${id}`);
      return data;
    },
    queryKey: ["checkPayment", id],
  });

  // Fetch reviews for the scholarship
  const { data: reviews = [], isLoading: reviewsLoading, isError: reviewsError, error: reviewsErrorObj } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const { data } = await axiosSecure(`/reviews/${id}?email=${user.email}`);
      return data;
    },
  });

  // Fetch average rating for the scholarship
  const { data: averageRatingData, isLoading: averageRatingLoading, isError: averageRatingError, error: averageRatingErrorObj } = useQuery({
    queryKey: ["averageRating", id],
    queryFn: async () => {
      const { data } = await axios(`${import.meta.env.VITE_URL}/reviews/${id}/average-rating?email=${user.email}`);
      return data;
    },
  });

  if (scholarshipLoading || checkPaymentLoading || reviewsLoading || averageRatingLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
        <Lottie animationData={loading} loop={true} className="h-44"></Lottie>
      </div>
    );
  }

  if (scholarshipError || scholarshipErrorObj) {
    console.error(scholarshipErrorObj);
  }

  if (checkPaymentError || chekPaymentError) {
    console.error(chekPaymentError);
  }

  if (reviewsError || reviewsErrorObj) {
    console.error(reviewsErrorObj);
  }

  if (averageRatingError || averageRatingErrorObj) {
    console.error(averageRatingErrorObj);
  }

  // Destructure scholarship details object to access necessary fields
  const {
    universityName,
    universityImage,
    scholarshipCategory,
    universityCountry,
    universityCity,
    applicationDeadline,
    subjectCategory,
    applicationFees,
    details,
    stipend,
    postDate,
    serviceCharge,
  } = scholarshipData;

  const averageRating = averageRatingData?.averageRating;

  const handleApplyNow = () => {
    if (checkPaymentData) {
      navigate('/apply', { state: { scholarshipDetails: scholarshipData } });
    } else {
      navigate('/payment', { state: { fee: applicationFees, universityName, scholarshipId: id, scholarshipDetails: scholarshipData } });
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <img
          src={universityImage}
          className="max-w-sm rounded-lg shadow-2xl"
          alt={universityName}
        />
        <div>
          <h1 className="text-5xl font-bold">{universityName}</h1>
          <p className="py-6">{details}</p>

          {/* Scholarship details */}
          <div className="my-4">
            <p><strong>Scholarship Category:</strong> {scholarshipCategory}</p>
            <p><strong>Country:</strong> {universityCountry}</p>
            <p><strong>City:</strong> {universityCity}</p>
            <p><strong>Subject Category:</strong> {subjectCategory}</p>
            <p><strong>Application Deadline:</strong> {formatDateToDdmmyyyy(applicationDeadline)}</p>
            <p><strong>Application Fees:</strong> {applicationFees} USD</p>
            <p><strong>Average Rating:</strong> {averageRating}</p>
            <p><strong>Stipend:</strong> {stipend} USD</p>
            <p><strong>Post Date:</strong> {formatDateToDdmmyyyy(postDate)}</p>
            <p><strong>Service Charge:</strong> {serviceCharge} USD</p>
          </div>

          {/* Reviews section */}
          <div className="my-4">
            <h2 className="text-2xl font-bold mb-2">Reviews</h2>
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md mb-4"
              >
                <div className="flex items-center mb-2">
                  <img
                    src={review.reviewerImage}
                    alt={review.reviewerName}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{review.reviewerName}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(review.reviewDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800">{review.comments}</p>
                <p className="text-sm text-gray-600 mt-2">Rating: {averageRating}</p>
              </div>
            ))}
          </div>
          <button onClick={handleApplyNow} className="btn btn-primary">Apply Now</button>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetails;
