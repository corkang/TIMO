import React from 'react';
import { makeStyles } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarHalfIcon from '@material-ui/icons/StarHalf';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  star: {
    color: '#F0CC18',
    fontSize: ({ size }) => size || 18,
  },
  emptyStar: {
    color: '#F0CC18',
    fontSize: ({ size }) => size || 18,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: ({ textSize }) => textSize || 14,
    color: '#ababab',
    fontFamily: 'Lato, sans-serif',
  },
  clickable: {
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.8,
    },
  },
}));

export default function StarRating({
  rating = 0,
  maxRating = 5,
  showText = false,
  reviewCount = null,
  size = 18,
  textSize = 14,
  editable = false,
  onChange,
}) {
  const classes = useStyles({ size, textSize });

  const handleClick = (value) => {
    if (editable && onChange) {
      onChange(value);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      const className = editable ? `${classes.star} ${classes.clickable}` : classes.star;
      const emptyClassName = editable
        ? `${classes.emptyStar} ${classes.clickable}`
        : classes.emptyStar;

      if (i <= Math.floor(rating)) {
        stars.push(
          <StarIcon key={i} className={className} onClick={() => handleClick(i)} />,
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(
          <StarHalfIcon key={i} className={className} onClick={() => handleClick(i)} />,
        );
      } else {
        stars.push(
          <StarBorderIcon
            key={i}
            className={emptyClassName}
            onClick={() => handleClick(i)}
          />,
        );
      }
    }
    return stars;
  };

  return (
    <div className={classes.container}>
      {renderStars()}
      {showText && (
        <span className={classes.ratingText}>
          {rating.toFixed(1)}
          {reviewCount !== null && ` (${reviewCount})`}
        </span>
      )}
    </div>
  );
}
