import axios from 'axios';

const API_URL = 'https://task-management-server-b1iq.onrender.com/api/tasks';

export const fetchTasks = (userId) => axios.get(`${API_URL}/get-task/${userId}`);
export const createTask = (task) => axios.post(`${API_URL}/add-task`, task);
export const updateTask = (id, task) => axios.put(`${API_URL}/${id}`, task);
export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`);
