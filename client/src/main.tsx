import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Store from './store/store.ts'
import { createContext } from 'react'

const store = new Store()

interface State {
	store: Store
}

export const Context = createContext<State>({ store })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<Context.Provider value={{store}}>
		<App />
	</Context.Provider>
)
