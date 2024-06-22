import { Link } from "react-router-dom";

const ScholarshipCard = ({ scholarship }) => {
  return (
    <>
      <div className="card card-compact bg-[#FFCBCB40]">
        <div className="p-4">
          <img src={scholarship.universityImage} alt="Shoes" className="rounded-t-xl" />
        </div>
        <div className="card-body ">
          <h2 className="card-title font-merriweather">
            {scholarship.universityName} <br /> { scholarship.universityCity}, {scholarship.universityCountry}
          </h2>
          <div className="text-lg">
            <p className="font-semibold"> 
              Scholarship Category: {scholarship.scholarshipCategory}
            </p>
            <p>
              <span className="font-semibold">Subject Category: </span> {scholarship.subjectCategory}
            </p>
            <p>
              <span className="font-semibold">Rating: </span> {scholarship.rating}
            </p>
            <p>
              <span className="font-semibold">Application Deadline: </span> {new Date(scholarship.applicationDeadline).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold"> Application Fees: </span> {scholarship.applicationFees}
            </p>
          </div>
          <div className="card-actions justify-end">
            <Link to={`/details/${scholarship.id}`}><button className="btn btn-info">View Details</button></Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScholarshipCard;
