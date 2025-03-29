import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './FormToAddContact.css';

function UpdateToContact() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [contact, setContact] = useState({
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
  const [loading, setLoading] = useState(true);

  const validateForm = () => {
    const newErrors = {};
    if (!contact.FirstName.trim()) newErrors.FirstName = 'First name is required';
    if (!contact.LastName.trim()) newErrors.LastName = 'Last name is required';
    if (!contact.NickName.trim()) newErrors.NickName = 'Nick name is required';
    if (!contact.Email || !/\S+@\S+\.\S+/.test(contact.Email)) newErrors.Email = 'Valid email is required';
    if (!contact.Phone.trim()) newErrors.Phone = 'Phone is required';
    if (!contact.WorkAddress.trim()) newErrors.WorkAddress = 'Work address is required';
    if (!contact.Address.trim()) newErrors.Address = 'Address is required';
    if (!contact.Groups.trim()) newErrors.Groups = 'Groups are required';
    if (!contact.Relationship.trim()) newErrors.Relationship = 'Relationship is required';
    if (!contact.Notes.trim()) newErrors.Notes = 'Notes are required';
    if (!contact.Websites.trim()) newErrors.Websites = 'Websites are required';

    return newErrors;
  };

  const fetchContact = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/getContact/${id}`);
      setContact(response.data);
    } catch (error) {
      console.error('Error fetching contact details:', error.response?.data || error.message);
      alert('Failed to fetch contact details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchContact();  
    } else {
      console.error('Contact ID is missing!');
    }
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/contacts/${id}`, contact);
      alert('Contact updated successfully');
      navigate('/');
    } catch (error) {
      console.error('Error updating contact:', error.response?.data || error.message);
      alert('Failed to update contact');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading contact...</p>;

  return (
    <div>
      <h2>Update Contact</h2>
      <form onSubmit={handleSubmit}>
        {[
          { id: 'FirstName', label: 'First Name', type: 'text' },
          { id: 'LastName', label: 'Last Name', type: 'text' },
          { id: 'NickName', label: 'Nick Name', type: 'text' },
          { id: 'Email', label: 'Email', type: 'email' },
          { id: 'Phone', label: 'Phone', type: 'text' },
          { id: 'WorkAddress', label: 'Work Address', type: 'text' },
          { id: 'Address', label: 'Home Address', type: 'text' },
          { id: 'Groups', label: 'Groups', type: 'text' },
          { id: 'Relationship', label: 'Relationship', type: 'text' },
          { id: 'Notes', label: 'Notes', type: 'text' },
          { id: 'Websites', label: 'Websites', type: 'text' }
        ].map(({ id, label, type }) => (
          <div key={id} className="input-container">
            <label htmlFor={id}>{label}:</label>
            <input
              type={type}
              name={id}
              value={contact[id]}
              onChange={handleChange}
              placeholder={label}
              className={errors[id] ? 'error' : ''}
            />
            {errors[id] && <span className="error-message">{errors[id]}</span>}
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Contact'}
        </button>
      </form>
    </div>
  );
}

export default UpdateToContact;
