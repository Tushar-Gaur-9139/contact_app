import React, { useEffect, useState } from 'react';
import api from './api';
import FormToAddContact from './FormToAddContact';

function ContactApp() {
    const [contacts, setContacts] = useState([]);

    
    const refreshContacts = async () => {
        try {
            const response = await api.get('/contacts');
            setContacts(response.data); 
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    useEffect(() => {
        refreshContacts();
    }, []);

    return (
        <div>
            <FormToAddContact refreshContacts={refreshContacts} />
            <div>
                <h2>Contact List</h2>
                <ul>
                    {contacts.map((contact) => (
                        <li key={contact.id}>
                            {contact.firstName} {contact.lastName}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ContactApp;
