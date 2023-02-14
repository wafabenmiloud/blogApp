import {useState} from "react";
import './RegisterPage.css';
export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState();

  async function register(ev) {
    ev.preventDefault();
    const response = await fetch('https://blogapp-d66m.onrender.com/register', {
      method: 'POST',
      body: JSON.stringify({username,password,email,age}),
      headers: {'Content-Type':'application/json'},
    });
    if (response.status === 200) {
      alert('registration successful');
    } else {
      alert('registration failed');
    }
  }
  return (
  <div className="auth">
      <form className="register" onSubmit={register}>
      <h3>Get started</h3>
      <input type="text"
             placeholder="username"
             value={username}
             onChange={ev => setUsername(ev.target.value)}/>
      <input type="email"
             placeholder="email"
             value={email}
             onChange={ev => setEmail(ev.target.value)}/>
       <input type="number"
             placeholder="age"
             value={age}
             onChange={ev => setAge(ev.target.value)}/>
      <input type="password"
             placeholder="password"
             value={password}
             onChange={ev => setPassword(ev.target.value)}/>
      <button>Register</button>
    </form>
  </div>
  );
}