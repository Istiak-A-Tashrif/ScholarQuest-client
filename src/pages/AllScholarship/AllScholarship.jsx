import React from 'react';
import ScholarshipCard from '../Home/ScholarshipCard';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const AllScholarship = () => {
    const {data: alllScholarship = [], isError, error} = useQuery({
        queryFn: async () => {
            const {data} = await axios (`${import.meta.env.VITE_URL}/allScholarship`)
            return data;
          },
        queryKey: ['allScholarships'],
      })
    return (
        <div className='grid lg:grid-cols-3 md:grid-cols-2 gap-4'>
            {
                alllScholarship.map((scholarship, idx) => <ScholarshipCard scholarship={scholarship} key={idx}></ScholarshipCard>)
            }
        </div>
    );
};

export default AllScholarship;