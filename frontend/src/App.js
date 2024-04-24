import {
  TextField,
  Button,
  Typography,
  Checkbox,
  List,
  ListItem,
  Container,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [inputVal, setInputVal] = useState("");
  const [todos, setTodos] = useState([]);
  const [isEdited, setIsEdited] = useState(false);
  const [editedId, setEditedId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [text, setText] = useState("");
  const [searchText, setSeachText] = useState();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/todos")
      .then((res) => {
        setTodos(res.data.reverse());
      })
      .catch((err) => console.log(err));
  }, [refresh]);

  const searcHandler = async () => {
    const values = todos.filter((todo) => todo.title.includes(searchText));
    setTodos(values);
  };

  const onChange = (e) => {
    setInputVal(e.target.value);
  };

  const handleClick = () => {
    if (!isEdited) {
      axios
        .post("http://127.0.0.1:8000/api/todos", {
          title: inputVal,
          descriptions: "test",
          amount: 100,
        })
        .then((res) => setRefresh(!refresh))
        .catch((err) => console.log(err));
    } else {
      axios
        .put(`http://127.0.0.1:8000/api/todos/${editedId}/`, {
          title: inputVal,
          descriptions: "test",
          amount: 100,
        })
        .then((res) => setRefresh(!refresh))
        .catch((err) => console.log(err));
    }
    setInputVal("");
    setIsEdited(false);
  };

  const onDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/todos/${id}/delete`)
      .then((res) => setRefresh(!refresh))
      .catch((err) => console.log(err));
  };

  const handleEdit = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    const editVal = todos.find((todo) => todo.id === id);
    setEditedId(editVal.id);
    setInputVal(editVal.title);
    setTodos(newTodos);
    setIsEdited(true);
  };

  return (
    <Container sx={{ textAlign: "center", marginTop: 10 }}>
      <TextField
        variant="outlined"
        onChange={(e) => setSeachText(e.target.value)}
        label="search your task"
        value={searchText}
        sx={{ width: "90%", marginBottom: 5 }}
      />
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={searcHandler}
        sx={{ height: 55, marginBottom: 3 }}
        disabled={searchText ? false : true}
      >
        Search
      </Button>
      <TextField
        variant="outlined"
        onChange={onChange}
        label="type your task"
        value={inputVal}
        sx={{ width: "70%", marginBottom: 3 }}
      />
      <Button
        size="large"
        variant={isEdited ? "outlined" : "contained"}
        color="primary"
        onClick={handleClick}
        sx={{ height: 55, marginBottom: 3 }}
        disabled={inputVal ? false : true}
      >
        {isEdited ? "Edit Task" : "Add Task"}
      </Button>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id} divider>
            <Typography
              sx={{ width: "70%", color: todo.isDone ? "green" : "" }}
            >
              {todo.title}
            </Typography>
            {/* <TextField
              variant="outlined"
              onChange={(e)=>setText(e.target.value)}
              label="Update the todo"
              value={text}
              defaultValue={todo.title}
              sx={{ width: "70%", marginBottom: 3 }}
            /> */}
            <Button
              onClick={() => handleEdit(todo.id)}
              variant="contained"
              sx={{ marginLeft: 1 }}
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(todo.id)}
              color="secondary"
              variant="contained"
              sx={{ marginLeft: 1 }}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;
