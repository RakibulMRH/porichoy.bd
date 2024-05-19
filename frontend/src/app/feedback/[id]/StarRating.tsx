import React, { useState, useEffect } from 'react';

interface StarRatingProps {
  initialRating: number;
  onRatingChange: (rating: number) => void;
  editable?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  initialRating,
  onRatingChange,
  editable = false,
}) => {
  const [rating, setRating] = useState(initialRating);
  const numStars = 5;

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleStarClick = (ratingValue: number) => {
    if (editable) {
      setRating(ratingValue);
      onRatingChange(ratingValue);
    }
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[...Array(numStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <span
              key={starValue}
              className={`text-2xl cursor-${
                editable ? 'pointer' : 'default'
              } ${starValue <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              onClick={() => handleStarClick(starValue)}
            >
              &#9733;
            </span>
          );
        })}
      </div>
      {!editable && (
        <span className="ml-2 text-gray-600">({rating.toFixed(1)})</span>
      )}
    </div>
  );
};

export default StarRating;