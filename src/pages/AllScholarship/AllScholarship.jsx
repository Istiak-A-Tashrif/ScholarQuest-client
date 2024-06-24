import React, { useState, useEffect } from 'react';
import ScholarshipCard from '../Home/ScholarshipCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';

const AllScholarship = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [count, setCount] = useState(0);
  const itemsPerPage = 6;

  const fetchScholarships = async ({ queryKey }) => {
    const [_key, page, search] = queryKey;
    const { data } = await axios.get(`${import.meta.env.VITE_URL}/allScholarship`, {
      params: { page, size: itemsPerPage, search }
    });
    return data;
  };

  const fetchCount = async (search) => {
    const { data } = await axios.get(`${import.meta.env.VITE_URL}/countScholarship`, {
      params: { search }
    });
    return data.count;
  };

  const { data: allScholarships = [], isError, error } = useQuery({
    queryKey: ['allScholarships', currentPage, search],
    queryFn: fetchScholarships,
  });

  useEffect(() => {
    fetchCount(search).then(count => setCount(count));
  }, [search]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearch(e.target[0].value); // Accessing the input value directly from form submission
    try {
      const data = await fetchScholarships({ queryKey: ['allScholarships', currentPage, search] });
    } catch (error) {
      console.error('Error searching scholarships:', error);
    }
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(count / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isError) {
    console.error(error);
    return <div>Error fetching scholarships.</div>;
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div className="join">
          <div>
            <div>
              <input
                type="text"
                className="input input-bordered join-item"
                placeholder="University Name"
              />
            </div>
          </div>
          <div className="indicator">
            <button type="submit" className="btn join-item">
              <FaSearch className="mr-1" />
              Search
            </button>
          </div>
        </div>
      </form>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 mt-4">
        {allScholarships.map((scholarship, idx) => (
          <ScholarshipCard scholarship={scholarship} key={idx} />
        ))}
      </div>

      <div className="flex justify-center gap-5 my-6">
        <button
          onClick={handlePrevious}
          className="btn btn-primary w-20"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(Math.ceil(count / itemsPerPage)).keys()].map((data) => (
          <button
            key={data + 1}
            className={`btn ${currentPage === data + 1 ? 'btn-info' : ''}`}
            onClick={() => setCurrentPage(data + 1)}
          >
            {data + 1}
          </button>
        ))}
        <button
          onClick={handleNext}
          className="btn btn-primary w-20"
          disabled={currentPage === Math.ceil(count / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllScholarship;
