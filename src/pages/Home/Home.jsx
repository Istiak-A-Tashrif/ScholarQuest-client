import React from 'react';
import Banner from './Banner';
import ScholarshipCard from './ScholarshipCard';
import Review from './Review';
import Newsletter from './Newsletter';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Home = () => {
    const {data: scholarships = [], isLoading, isError, error} = useQuery({
        queryFn: () => getData(),
        queryKey: ['home'],
      })
    
      const getData = async () => {
        const {data} = await axios (`${import.meta.env.VITE_URL}`)
        return data;
      }

      const {data: reviews = [], isLoading: isReviewsLoading, isError: isReviewsError, error: reviewsError} = useQuery({
        queryFn: async () => {
            const {data} = await axios (`${import.meta.env.VITE_URL}/reviews`)
            return data;
          },
        queryKey: ['review'],
      })
    return (
        <>
            <Banner></Banner>
            <h1 className='my-10 text-2xl font-merriweather text-center'>Top Scholarships <br />
            <span className='text-base'> Discover the most sought-after scholarships, offering full accommodations, tuition fees, and more. Explore top opportunities recently posted with low application fees.</span>
            </h1>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
           {
                scholarships.map((scholarship, idx) => <ScholarshipCard scholarship={scholarship} key={idx}></ScholarshipCard>)
            }

            <div className="flex justify-center container items-center mt-4 mb-6 w-screen "><Link to={'/allScholarship'} className='btn btn-primary'>All Scholarship</Link></div>
           </div>
            <div className="divider divider-primary w-1/2 mx-auto my-10 text-2xl font-merriweather">Student Reviews</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3  gap-5">
            {
                reviews.map((review, idx) => <Review key={idx} review={review}></Review>)
            }
            </div>
            <Newsletter></Newsletter>
        </>
    );
};

export default Home;