import React, { useState, useEffect } from "react";
import { food_items } from "../food";
import api from "../utils/api";
import { dataContext } from "./DataContext";

const UserContext = ({ children }) => {
  const [cate, setCate] = useState(food_items);
  const [input, setInput] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      api
        .get("/accounts/profile/") // no need to add headers if api.js interceptor handles it
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("Failed to fetch current user:", err);
          setUser(null);
        });
    }
  }, []);

  const data = {
    input,
    setInput,
    cate,
    setCate,
    showCart,
    setShowCart,
    user,
    setUser,
  };

  return <dataContext.Provider value={data}>{children}</dataContext.Provider>;
};

export default UserContext;
