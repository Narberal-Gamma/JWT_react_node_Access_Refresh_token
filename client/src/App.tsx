import { useContext, useEffect, useState } from "react"
import LoginForm from "./components/LoginForm"
import { Context } from "./main"
import { observer } from "mobx-react-lite"
import { IUser } from "./models/IUser"
import UserService from "./services/UserService"

function App() {

	const { store } = useContext(Context)
	const [users, setUsers] = useState<IUser[]>([])

	useEffect(() => {
		if (localStorage.getItem('token')) {
			store.checkAuth()
		}
	}, [])

	const getUsers = async () => {
		try {
			const response = await UserService.fetchUsers()
			setUsers(response.data)
		} catch (e) {
			console.log(e)
		}
	}

	if (store.isLoading) {
		return <h1>Идет загрузка...</h1>
	}

	if (!store.isAuth) {
		return (
			<div>
				<button onClick={getUsers}>Получить пользователей</button>
				<LoginForm />
			</div>
		)
	}

	return (
		<>
			<h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : `АВТОРИЗУЙТЕСЬ`}</h1>
			<h1>{store.user.isActivated ? `Аккаут активирован` : `АКТИВИРУЙТЕ АККАУНТ`}</h1>
			<button onClick={() => store.logout()}>Выйти</button>
			<button onClick={getUsers}>Получить пользователей</button>
			<div>
				{users.map(user =>
					<div key={user.email}>
						{user.email}
					</div>
				)}
			</div>
		</>
	)
}

export default observer(App)
