import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onSearch }) {
  const [searchParams, setSearchParams] = useState({
    firstName: '',
    lastName: '',
    nickName:'',
    email: '',
    phone: '',
    workAddress: '',
    address: '',
    groups:'',
    relationship: '',
    notes:'',
    websites:''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSearchParams((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };
  const handleSearch = async (page = 1) => {
    if (!searchTerm.trim()) return;
  
    try {
      const response = await axios.get(
        `http://localhost:5000/api/search?query=${searchTerm}&page=${page}&limit=5`
      );
      
      console.log(response.data);  
  
      setSearchResults(response.data.data);
      setTotalPages(Math.ceil(response.data.total / response.data.limit));
      setCurrentPage(response.data.page);
    } catch (error) {
      console.error('Error searching contact:', error);
    }
  };
  
  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li className="navbar-brand">Contact-App</li>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/add-contact">Add Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
