import { TiThSmallOutline } from "react-icons/ti";
import { MdOutlineFreeBreakfast } from "react-icons/md";
import { TbSoup } from "react-icons/tb";
import { CiBowlNoodles } from "react-icons/ci";
import { MdOutlineFoodBank } from "react-icons/md";
import { GiFullPizza } from "react-icons/gi";
import { FaHamburger } from "react-icons/fa";

export const Categories = [
    {
        id: 1,
        name: "All",
        filterKey: "all",
        image: <TiThSmallOutline className="w-[60px] h-[60px] text-green-500" />
    },
    {
        id: 2,
        name: "breakfast",
        filterKey: "breakfast", 
        image: <MdOutlineFreeBreakfast className="w-[60px] h-[60px] text-green-500" />
    },
    {
        id: 3,
        name: "soups",
        filterKey: "soups",
        image: <TbSoup className="w-[60px] h-[60px] text-green-500" />
    },
    {
        id: 4,
        name: "pasta",
        filterKey: "pasta",
        image: <CiBowlNoodles className="w-[60px] h-[60px] text-green-500" />
    },
    {
        id: 5,
        name: "main_course",
        filterKey: "main_course",
        image: <MdOutlineFoodBank className="w-[60px] h-[60px] text-green-500" />
    },
    {
        id: 6,
        name: "pizza",
        filterKey: "pizza",
        image: <GiFullPizza className="w-[60px] h-[60px] text-green-500" />
    },
    {
        id: 7,
        name: "burger",
        filterKey: "burger",
        image: <FaHamburger className="w-[60px] h-[60px] text-green-500" />
    },
];
