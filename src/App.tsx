import React, {FC, useContext, useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '.';
import './App.css';
import LoginForm from './components/LoginForm';
import { IUser } from './models/IUser';
import UserService from './services/UserService';

const  App: FC = () => {
  const {store} = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth();
    }
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (e) {
      if (e){
        console.log(e);
      }
    }
  }

  if (store.isLoading) {
    return <div>Загрузка...</div>
  }

  if (!store.isAuth) {
    return (
      <>
        <LoginForm />
        <div>
          <button onClick={() => getUsers()}>Get all users</button>
        </div>
        {
          users.map(user => <div key={user.email}>{user.email}</div>)
        }
      </>
    )
  }

  return (
    <div>
      <h1>{store.isAuth ? `User authorized ${store.user.email}` : 'Authorize'}</h1>
      <h1>{store.user.isActivated ? 'Account eMail verified' : 'You need to verify your account'}</h1>
      <button onClick={() => store.logout()}>Logout</button>
      <div>
        <button onClick={() => getUsers()}>Get all users</button>
      </div>
      {
        users.map(user => <div key={user.email}>{user.email}</div>)
      }
    </div>
  );
}

export default observer(App);
