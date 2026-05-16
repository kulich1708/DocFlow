import { useEffect, useState } from 'react';
import { api, type UserDTO } from './api/api';
function App() {
	const [data, setData] = useState<UserDTO>();

	useEffect(() => {
		const fetchUsers = async () => {
			setData(await api.getUserById);
		}
		fetchUsers();
	}, [])
	console.log(data);
	return (
		<p>{data?.email}</p>
	)
}

export default App
