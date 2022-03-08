const express = require('express');
const app = express();
const port = 8000;

require('./routes/appRoutes')(app);

app.listen(port, () => console.log(`Server listening on port: ${port}`));