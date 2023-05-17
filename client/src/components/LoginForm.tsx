import { FC, useContext, useState } from "react";
import { Context } from "../main";
import { observer } from "mobx-react-lite"

const LoginForm: FC = () => {

    const [user, setUser] = useState({
        email: '',
        password: '',
    })

    const {store} = useContext(Context)

    return (
        <div>
            <input
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
                type="text"
                placeholder="Email"
            />
            <input
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
                type="text"
                placeholder="Пароль"
            />
            <button onClick={() => store.login(user.email, user.password)}>Логин</button>
            <button onClick={() => store.registration(user.email, user.password)}>Регистрация</button>
        </div>
    )
}

export default observer(LoginForm)