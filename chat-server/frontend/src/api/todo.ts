import axiosInstance from '../plugins/axios';

export default function TodoAPI() {
  const getTodos = async () => {
    const response = await axiosInstance
      .get('/todos')
      .then((res) => res.data)
      .catch((error) => {
        console.error('Error fetching todos:', error);
        throw error;
      });
    return response;
  };
  return {
    getTodos
  };
}
