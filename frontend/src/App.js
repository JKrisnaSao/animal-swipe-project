import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [animals, setAnimals] = useState([]);
  const [likedAnimals, setLikedAnimals] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (userId) {
      axios.get('http://localhost:5000/animals')
        .then(res => setAnimals(res.data))
        .catch(err => console.error(err));
    }
  }, [userId]);

  const handleSignup = () => {
    axios.post('http://localhost:5000/signup', { email, password })
      .then(res => setUserId(res.data._id))
      .catch(err => console.error(err));
  };

  const handleLogin = () => {
    axios.post('http://localhost:5000/login', { email, password })
      .then(res => setUserId(res.data._id))
      .catch(err => console.error(err));
  };

  const handleLike = (animalId) => {
    axios.post('http://localhost:5000/like', { userId, animalId })
      .then(res => setLikedAnimals(res.data.likedAnimals))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>Animal Swipe App</h1>
      {userId ? (
        <div>
          <h2>Animals</h2>
          <div>
            {animals.map(animal => (
              <div key={animal.id}>
                <p>{animal.name}</p>
                <button onClick={() => handleLike(animal.id)}>Like</button>
                <button>Dislike</button>
              </div>
            ))}
          </div>
          <h2>Liked Animals</h2>
          <div>
            {likedAnimals.map(animalId => (
              <p key={animalId}>{animalId}</p>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleSignup}>Sign Up</button>
          <button onClick={handleLogin}>Log In</button>
        </div>
      )}
    </div>
  );
}

export default App;