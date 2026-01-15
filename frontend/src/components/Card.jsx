import React from 'react';
import { useDispatch } from 'react-redux';
import { LuLeafyGreen } from 'react-icons/lu';
import { GiChickenOven } from "react-icons/gi";
import { Additem } from '../redux/cartSlice';
import { toast } from 'react-toastify';

const Card = ({ name, image, id, price, is_vegetarian, is_vegan }) => {
  let dispatch = useDispatch();

  const getTypeIcon = () => {
    if (is_vegan) return <LuLeafyGreen className="text-xl" />;
    if (is_vegetarian) return <LuLeafyGreen className="text-xl" />;
    return <GiChickenOven className="text-xl" />;
  };

  const getTypeText = () => {
    if (is_vegan) return 'Vegan';
    if (is_vegetarian) return 'Vegetarian';
    return 'Non-Veg';
  };

  return (
    <div
      className="w-[280px] sm:w-[300px] h-auto bg-white dark:bg-gray-800 rounded-xl
                 shadow-lg hover:shadow-2xl flex flex-col p-5 justify-between
                 transition-all duration-300 hover:scale-[1.02] cursor-pointer
                 hover:border-2 border-green-400 dark:border-gray-600 group
                 border border-gray-200 dark:border-gray-700"
    >
      {/* Image */}
      <div
        className="w-full h-[200px] rounded-lg overflow-hidden 
                   flex items-center justify-center bg-gray-200 group"
      >
        <img
          src={image || '/default-image.jpg'}
          alt={name}
          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Title */}
      <div className="text-xl font-semibold mt-4 text-gray-800">{name}</div>

      {/* Price and Type */}
      <div className="w-full flex items-center justify-between mt-4">
        <div className="text-lg font-bold text-green-600">₹{price}</div>
        <div className="flex items-center gap-1 text-green-500 font-medium">
          {getTypeIcon()}
          <span className="capitalize">{getTypeText()}</span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={()=>{ dispatch(Additem({id:id, name:name, image:image, price:price, qty:1 }))
      toast.success("Item added to cart")}}
        className="mt-6 bg-green-500 hover:bg-green-600 text-white 
                   font-semibold py-2 rounded-md shadow w-full 
                   transition-all duration-200"
      >
        Add to Dish
      </button>
    </div>
  );
};

export default Card;