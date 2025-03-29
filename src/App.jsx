import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import FormToAddContact from './components/FormToAddContact';
import Navbar from './components/Navbar';
import Table from './components/Table';
import UpdateToContact from './components/UpdateToContact';

function App() {
  const [refreshKey, setRefreshKey] = useState(0); 
  const refreshContacts = () => {
    setRefreshKey(prevKey => prevKey + 1); 
  };

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Table refreshKey={refreshKey} />} />
        <Route path="/add-contact" element={<FormToAddContact refreshContacts={refreshContacts} />} />
        <Route path="/update-contact/:id" element={<UpdateToContact />} />


      </Routes>
    </div>
  );
}

export default App;
