import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Table.css';


function Table({ refreshKey }) {
  const [sortOrder, setSortOrder] = useState('asc')
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState({
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
  const [columnVisibility, setColumnVisibility] = useState({
    FirstName: true,
    LastName: true,
    NickName: true,
    Email: true,
    Phone: true,
    WorkAddress: true,
    Address: true,
    Groups: true,
    Relationship: true,
    Notes: true,
    Websites: true
  });

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    console.log(contacts);
  }, [contacts]);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);

      try {
        const visibleColumns = Object.keys(columnVisibility).filter(column => columnVisibility[column]);

        const searchParams = Object.fromEntries(
          Object.entries(searchQuery).filter(([key, value]) => value.trim() !== '')
        );

        const response = await axios.get('http://localhost:5000/api/contacts', {
          params: {
            page: currentPage,
            limit: 10,
            sort: sortOrder,
            columns: visibleColumns,
            ...searchParams,
          },
        });

        if (
          response.data &&
          Array.isArray(response.data.contacts) &&
          response.data.totalPages !== undefined
        ) {
          setContacts(response.data.contacts);
          setTotalPages(response.data.totalPages);
        } else {
          setError('Unexpected response structure');
        }
      } catch (error) {
        console.error('Error fetching contacts:', error.response?.data || error.message);
        setError(error.response?.data?.message || 'Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [currentPage, searchQuery, refreshKey, sortOrder, columnVisibility]);

  const handleColumnToggle = (column) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [column]: !prevVisibility[column],
    }));
  };

  const handleDelete = async (id) => {
    console.log("Deleting contact with ID:", id);
    if (!id) {
      alert('Invalid contact ID');
      return;
    }

    try {
      // Perform the deletion request
      await axios.delete(`http://localhost:5000/api/contacts/${id}`);
      alert('Contact deleted successfully');

      // Update the state by filtering out the deleted contact
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) {

      console.error('Error deleting contact:', error.response?.data || error.message);
      alert('Failed to delete contact');
    }
  };


  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setDropdownVisible(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="table-container">
      <div className="column-toggle">
        {Object.keys(columnVisibility).map((column) => (
          <label className='col-toggle' key={column}>
            <input
              className='col-check'
              type="checkbox"
              checked={columnVisibility[column]}
              onChange={() => handleColumnToggle(column)}
            />
            {column}
          </label>
        ))}
      </div>

      <div className="search-container">
        {Object.keys(searchQuery).map((key) => (
          <input
            key={key}
            type="text"
            id={key}
            value={searchQuery[key]}
            onChange={(e) => setSearchQuery({ ...searchQuery, [key]: e.target.value })}
            placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}`}
          />
        ))}
      </div>

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : contacts.length === 0 ? (
        <p>No contacts available.</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                {columnVisibility.FirstName && <th>First Name</th>}
                {columnVisibility.LastName && <th>Last Name</th>}
                {columnVisibility.NickName && <th>Nick Name</th>}
                {columnVisibility.Email && (
                  <th>
                    Email
                    <div className={`dropdown ${dropdownVisible ? 'show' : ''}`} ref={dropdownRef}>
                      <button className="dropdown-button" onClick={toggleDropdown}>
                        <i className="fa-solid fa-filter"></i>
                      </button>
                      {dropdownVisible && (
                        <ul className="dropdown-menu">
                          <li>
                            <a className="dropdown-item" onClick={() => handleSortChange('asc')}>Ascending</a>
                          </li>
                          <li>
                            <a className="dropdown-item" onClick={() => handleSortChange('desc')}>Descending</a>
                          </li>
                        </ul>
                      )}
                    </div>
                  </th>

                )}
                {columnVisibility.Phone && <th>Phone</th>}
                {columnVisibility.WorkAddress && <th>Work Address</th>}
                {columnVisibility.Address && <th>Address</th>}
                {columnVisibility.Groups && <th>Groups</th>}
                {columnVisibility.Relationship && <th>Relationship</th>}
                {columnVisibility.Notes && <th>Notes</th>}
                {columnVisibility.Websites && <th>Websites</th>}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>

              {contacts.map((contact, index) => (
                <tr key={contact.id || index}>
                  {columnVisibility.FirstName && <td>{contact.FirstName}</td>}
                  {columnVisibility.LastName && <td>{contact.LastName}</td>}
                  {columnVisibility.NickName && <td>{contact.NickName}</td>}
                  {columnVisibility.Email && <td>{contact.Email}</td>}
                  {columnVisibility.Phone && <td>{contact.Phone}</td>}
                  {columnVisibility.WorkAddress && <td>{contact.WorkAddress}</td>}
                  {columnVisibility.Address && <td>{contact.Address}</td>}
                  {columnVisibility.Groups && <td>{contact.Groups}</td>}
                  {columnVisibility.Relationship && <td>{contact.Relationship}</td>}
                  {columnVisibility.Notes && <td>{contact.Notes}</td>}
                  {columnVisibility.Websites && <td>{contact.Websites}</td>}
                  <td>
                    <ul className="action-list">
                      <li>
                        <Link to={`/update-contact/${contact.id}`} className="update-btn">Update Contact</Link>
                      </li>
                      <li>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="delete-btn"
                        >
                          Delete Contact
                        </button>
                      </li>
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Table;
