const express = require('express');
const connection = require('./config');
//PORT 3306 in production
const PORT = process.env.PORT || 3001;

const app = express();

// turn on body-parser
// makes req.body existing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST - create todo
// ASYNC -declaring a function as "async" allows us to use "await" syntax within that function
app.post('/api/todos', async (req, res) => {
    const { task } = req.body;

    if (!task) {
        return res.status(400).json({ error: 'You must provide a task' });
    }
// if there is a task save it to the database 
// js will try to run evry single line of code inside the try block,
// if any lines of code throws an error, js will take the error and run the code in the catch block
try {
    const insertQuery = "INSERT INTO todos(task) VALUES(?);";
    const getTodoById = "SELECT * FROM todos WHERE id = ?;";
    const [result] = await connection.query(insertQuery, [task]);
    // Whenever we do an INSERT, UPDATE, OR DELETE query in mysql2 or mysql npm package
    // it doesn't give us the data that was interacted with. it instead tells us information
    // about how many rows were affected and maybe the insertId or updateId of the regarding data.
    // It also gives us an array with 2 elements. The 1st one is an object where we have the information we need
    // 2nd one is null or information about the fields of that row
    const todosResult = await connection.query(getTodoById, [result.insertId]);
    res.json(todosResult);

} catch (e) {
res.status(400).json(e);
}
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

// [
//   {
//     "fieldCount": 0,
//     "affectedRows": 1,
//     "insertId": 1,
//     "info": "",
//     "serverStatus": 2,
//     "warningStatus": 0
//   },
//   null
// ]