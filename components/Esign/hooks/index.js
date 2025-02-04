import axios from 'axios';

export const uploadFileRequest = async (action, values) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'multipart/form-data',
      'Application-Name': action.header['Application-Name'],
      charset: 'utf-8',
      boundary: 'another cool boundary',
    },
  };
  return await axios.post(action.url, values, config);
};
