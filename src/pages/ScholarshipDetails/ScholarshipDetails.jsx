import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is imported
import useAuth from "../../Hooks/useAuth";

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useQuery({
    queryFn: async () => {
      const { data } = await axios(`${import.meta.env.VITE_URL}/details/${id}`);
      return data;
    },
    queryKey: ["details", id],
  });
  const { data: checkPayment = [], isLoading: isChekPaymentLoading, isError: isChekPaymentError, error: chekPaymentError } = useQuery({
    queryFn: async () => {
      const { data } = await axios(`${import.meta.env.VITE_URL}/checkPayment?email=${user.email}&id=${id}`);
      return data;
    },
    queryKey: ["checkPayment", id],
  });

  console.log(checkPayment);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  // Destructure data object to access scholarship details
  const {
    _id,
    universityName,
    universityImage,
    scholarshipCategory,
    universityCountry,
    universityCity,
    applicationDeadline,
    subjectCategory,
    applicationFees,
    rating,
    details,
    stipend,
    postDate,
    serviceCharge,
    reviews,
  } = data;
 
  const handleApplyNow = () => {
    if (checkPayment) {
      navigate('/apply', { state: { scholarshipDetails: data } });
    }
    else {
      navigate('/payment', { state: { fee: applicationFees, universityName: universityName, scholarshipId: _id, scholarshipDetails: data } });
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col ">
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
            <p>
              <strong>Scholarship Category:</strong> {scholarshipCategory}
            </p>
            <p>
              <strong>Country:</strong> {universityCountry}
            </p>
            <p>
              <strong>City:</strong> {universityCity}
            </p>
            <p>
              <strong>Subject Category:</strong> {subjectCategory}
            </p>
            <p>
              <strong>Application Deadline:</strong>{" "}
              {new Date(applicationDeadline).toLocaleDateString()}
            </p>
            <p>
              <strong>Application Fees:</strong> {applicationFees} USD
            </p>
            <p>
              <strong>Rating:</strong> {rating}
            </p>
            <p>
              <strong>Stipend:</strong> {stipend} USD
            </p>
            <p>
              <strong>Post Date:</strong>{" "}
              {new Date(postDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Service Charge:</strong> {serviceCharge} USD
            </p>
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
                <p className="text-sm text-gray-600 mt-2">
                  Rating: {review.ratingPoint}
                </p>
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
