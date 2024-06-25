import { Link } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const ScholarshipCard = ({ scholarship }) => {
  const { user } = useAuth();

  // Fetch average rating for the scholarship
  const {
    data: averageRatingData,
    isLoading: averageRatingLoading,
    isError: averageRatingError,
    error: averageRatingErrorObj,
  } = useQuery({
    queryKey: ["averageRating", scholarship],
    queryFn: async () => {
      const { data } = await axios(
        `${import.meta.env.VITE_URL}/reviews/${scholarship._id}/average-rating?email=${user.email}`
      );
      return data;
    },
  });

  // Check if averageRatingData exists and is a number
  const averageRating = averageRatingData && typeof averageRatingData.averageRating === 'number'
    ? averageRatingData.averageRating
    : 'No rating available';

  return (
    <>
      <div className="card card-compact bg-[#FFCBCB40]">
        <div className="p-4">
          <img src={scholarship.universityImage} alt="University" className="rounded-t-xl" />
        </div>
        <div className="card-body">
          <h2 className="card-title font-merriweather">
            {scholarship.universityName} <br /> {scholarship.universityCity}, {scholarship.universityCountry}
          </h2>
          <div className="text-lg">
            <p className="font-semibold">
              Scholarship Category: {scholarship.scholarshipCategory}
            </p>
            <p>
              <span className="font-semibold">Subject Category: </span> {scholarship.subjectCategory}
            </p>
            <p>
              <span className="font-semibold">Rating: </span> {averageRating}
            </p>
            <p>
              <span className="font-semibold">Application Deadline: </span> {new Date(scholarship.applicationDeadline).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Application Fees: </span> {scholarship.applicationFees}
            </p>
          </div>
          <div className="card-actions justify-end">
            <Link to={`/details/${scholarship._id}`}>
              <button className="btn btn-info">View Details</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScholarshipCard;
