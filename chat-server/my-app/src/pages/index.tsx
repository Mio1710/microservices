import { NavLink } from 'react-router';
import TodoAPI from '../api/todo';

import { useState } from 'react';

export default function Index() {
  const [todos, setTodos] = useState([]);
  const getTodos = () => {
    TodoAPI()
      .getTodos()
      .then((data) => {
        console.log('Fetched todos:', data);
        setTodos(data);
      })
      .catch((error) => {
        console.error('Error fetching todos:', error);
      });
  };

  return (
    <div>
      <h1>Welcome to the Index Page</h1>
      <p>This is the main entry point of the application.</p>
      <button onClick={getTodos}>Fetch Todos</button>
      <h2>Todos:</h2>
      {JSON.stringify(todos, null, 2) || 'No todos fetched yet.'}
      <ul>
        <li>
          <a href="/about">About Us</a>
          <NavLink to="/about" end>
            About us
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" end>
            Contact us
          </NavLink>
        </li>
        {/* Add more links as needed */}
      </ul>
    </div>
  );
}
