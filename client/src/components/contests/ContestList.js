// client/src/components/contests/ContestList.js
import React from 'react';
import { motion } from 'framer-motion';
import ContestCard from './ContestCard';

const ContestList = ({ contests, loading }) => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
      </div>
    );
  }
  
  if (contests.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
          No contests found matching your filters.
        </h3>
        <p className="text-gray-500 dark:text-gray-500 mt-2">
          Try adjusting your filter criteria or check back later.
        </p>
      </div>
    );
  }
  
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {contests.map((contest) => (
        <motion.div key={contest._id} variants={item}>
          <ContestCard contest={contest} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ContestList;