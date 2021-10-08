const express = require("express");
const pool = require("./db");
const cors = require("cors");

const app = express();
const PORT = 5000;

// middleware
app.use(cors());
app.use(express.json());

// ROUTES

app.get("/smt", (req, res) => {
  res.send("SMT!");
});

// create a todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// get all todos

app.get("/todos", async (req, res) => {
  try {
    const alltodos = await pool.query("SELECT * FROM todo");
    res.json(alltodos.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// get a todo

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);

    res.json(todo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// update a todo

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );

    res.json("Todo was updated");
  } catch (error) {
    console.log(err.message);
  }
});

// delete a todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id,
    ]);

    res.json("todo was deleted")
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
