const express = require('express');
const cors = require('cors');
const app = express();
const contactRoutes = require('./Routes/contactRoutes');
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); 
app.use('/api', contactRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
