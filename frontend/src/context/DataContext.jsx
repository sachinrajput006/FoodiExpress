import { useState, useEffect } from "react";
import { getMenus, getCategories } from "../api/axios";
import { dataContext } from "./context";

export const DataProvider = ({ children }) => {
  const [cate, setCate] = useState([]);
  const [categories, setCategories] = useState([]);
  const [input, setInput] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menusResponse, categoriesResponse] = await Promise.all([
          getMenus(),
          getCategories()
        ]);
        setCate(menusResponse.data);
        setCategories([...categoriesResponse.data, { id: categoriesResponse.data.length + 1, name: 'Dinner' }]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterByCategory = (categoryName) => {
    if (categoryName === 'all') {
      getMenus().then(response => setCate(response.data));
    } else {
      getMenus({ category: categoryName }).then(response => setCate(response.data));
    }
  };

  return (
    <dataContext.Provider value={{
      cate,
      setCate,
      categories,
      input,
      setInput,
      showCart,
      setShowCart,
      loading,
      filterByCategory,
      user,
      setUser
    }}>
      {children}
    </dataContext.Provider>
  );
};
