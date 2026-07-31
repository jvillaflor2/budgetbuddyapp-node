const express = require('express');
const cors = require('cors');
const categoriesRouter = require('./routes/categories');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/categories', categoriesRouter);app.use('/categories', categoriesRouter);

app.get('/', (req, res) => {
    res.send('BudgeBuddyapp Node API is running');

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});