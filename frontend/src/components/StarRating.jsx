import React, { useState } from 'react';

const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl ${
            star <= (hoverRating || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          } ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default StarRating;
