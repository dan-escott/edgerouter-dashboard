import { FormEvent, useState } from 'react';
import { Session } from '../services/Session';

export function Login(props: { session: Session }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLElement>) => {
    props.session.start(username, password);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="username" value={username} onChange={event => setUsername(event.target.value)} />
      <input name="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} type="password" />
      <input type="submit" value="Log in"></input>
    </form>
  );
}
