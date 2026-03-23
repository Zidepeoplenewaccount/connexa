const express = require('express');
const path = require('path');
const app = express();

// Serve React build
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
