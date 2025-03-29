import React, { useState } from 'react';
import api from './api';
import './FormToAddContact.css';

function FormToAddContact({ refreshContacts }) {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    NickName: '',
    Email: '',
    Phone: '',
    WorkAddress: '',
    Address: '',
    Groups: '',
    Relationship: '',
    Notes: '',
    Websites: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.FirstName) newErrors.FirstName = 'First name is required';
    if (!formData.LastName) newErrors.LastName = 'Last name is required';
    if (!formData.NickName) newErrors.NickName = 'Nick name is required';
   
    if (!formData.Phone) {
      newErrors.Phone = 'Phone number is required';
    } else if (formData.Phone.length !== 10) { 
      newErrors.Phone = 'Phone number must be 10 digits long';
    } else if (!/^\d+$/.test(formData.Phone)) { 
      newErrors.Phone = 'Phone number can only contain numbers';
    }
    if (!formData.Email || !/\S+@\S+\.\S+/.test(formData.Email)) newErrors.Email = 'Valid email is required';
    if (!formData.Relationship) newErrors.Websites = 'Relationship is required';
    if (!formData.Websites) newErrors.Websites = 'enter valid websites';
    if (!formData.Notes) newErrors.Notes = 'Notes is required';
    if (!formData.Groups) newErrors.Groups = 'Groups  is required';
  
  const addressPattern = /^[A-Za-z0-9\s-]+$/;
  if (!formData.Address) {
    newErrors.Address = 'Address is required';
  } else if (!addressPattern.test(formData.Address)) {
    newErrors.Address = 'Address can only contain letters, numbers, spaces, and hyphens';
  }

  if (!formData.WorkAddress) {
    newErrors.WorkAddress = 'Work Address is required';
  } else if (!addressPattern.test(formData.WorkAddress)) {
    newErrors.WorkAddress = 'Work Address can only contain letters, numbers, spaces, and hyphens';
  }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = validateForm();
    setErrors(validationErrors);
 
    if (Object.keys(validationErrors).length > 0) {
      return; 
    }
  
    setIsLoading(true);
  
    try {
      console.log('Form Data:', formData);
  
      await api.post('http://localhost:5000/api/contacts', formData);
  
      alert('✅ Contact added successfully!');
  
      setFormData({
        FirstName: '',
        LastName: '',
        NickName: '',
        Email: '',
        Phone: '',
        WorkAddress: '',
        Address: '',
        Groups: '',
        Relationship: '',
        Notes: '',
        Websites: ''
      });
  
      if (refreshContacts) {
        await refreshContacts();
      } else {
        console.warn('⚠️ refreshContacts function is missing!');
      }
    } catch (error) {
   
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = {};
        
        error.response.data.errors.forEach(err => {
          backendErrors[err.param] = err.msg;
        });
  
        setErrors(backendErrors); 
      } else {
        alert('❌ Failed to add contact. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
 

  return (
    <div className="form-container">
    <h2>Add New Contact</h2>
    <form onSubmit={handleSubmit}>
      {[
        { id: 'FirstName', label: 'First Name', type: 'text', placeholder: 'Enter First Name'},
        { id: 'LastName', label: 'Last Name', type: 'text', placeholder: 'Enter Last Name' },
        { id: 'NickName', label: 'Nick Name', type: 'text', placeholder: 'Enter Nick Name' },
        { id: 'Email', label: 'Email ID', type: 'email', placeholder: 'abc@abc.com'},
        { id: 'Phone', label: 'Phone', type: 'number', placeholder: 'Enter Phone Number',MinLenght:10,MaxLength:10 },
        { id: 'WorkAddress', label: 'Work Address', type: 'text', placeholder: 'Enter Work Address'},
        { id: 'Address', label: 'Home Address', type: 'text', placeholder: 'Enter Home Address'},
        { id: 'Groups', label: 'Groups', type: 'text', placeholder: 'Enter Groups' },
        { id: 'Relationship', label: 'Relationship', type: 'text', placeholder: 'Enter Relationship'},
        { id: 'Notes', label: 'Notes', type: 'text', placeholder: 'Enter Notes'},
        { id: 'Websites', label: 'Websites', type: 'text', placeholder: 'Enter Websites'}
      ].map(({ id, label, type, placeholder }) => (
        <div key={id}>
          <label htmlFor={id}>{label}:</label>
          <input
            type={type}
            id={id}
            value={formData[id]}
            onChange={handleChange}
            placeholder={placeholder}
          />
        
          {errors[id] && <span className='error-message'>{errors[id]}</span>}
        </div>
      ))}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Contact'}
      </button>
    </form>
  </div>
  
  );
}

export default FormToAddContact;
