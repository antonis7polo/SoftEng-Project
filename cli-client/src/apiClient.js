const axios = require('axios');
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();


const { storeToken, getToken, clearToken } = require('./utils/tokenStorage');


const apiInstance = axios.create({
  baseURL: 'https://localhost:9876/ntuaflix_api', 
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});

const login = async (username, password) => {
  try {
    const response = await apiInstance.post('/login', {
      username,
      password,
    });
    storeToken(response.data.token); // Store the token
    return response.data; 
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response was received from the API');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Error: ${error.message}`);
    }
  }
};

const logout = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  try {
    await apiInstance.post('/logout', {}, {
      headers: {
        'x-observatory-auth': token
      }
    });
  } catch (error) {
    if (error.response) {

      throw new Error(error.response.data.message);
    } else if (error.request) {
      throw new Error('No response was received from the API');
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  } finally {
    clearToken(); 
  }
};

const addUser = async (username, password, email, isAdmin) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }
  try {
    const response = await apiInstance.post(`/admin/usermod/${username}/${password}`, {
      email,
      isAdmin
    }, {
      headers: {
        'x-observatory-auth': token
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};


const getUser = async (username, format) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  try {
    const response = await apiInstance.get(`/admin/users/${username}`, {
      params: { format },
      headers: { 'x-observatory-auth': token }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};

const healthCheck = async (format) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  try {
    const response = await apiInstance.get('/admin/healthcheck', {
      params: { format },
      headers: { 'x-observatory-auth': token }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.data && error.response.data.status) {
        return error.response.data;
      } else{
        throw new Error(error.response.data.message);
      }
    } else {
      throw new Error('Failed to perform health check');
    }
  }
};

const resetAll = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  try {
    const response = await apiInstance.post('/admin/resetall', {}, {
      headers: { 'x-observatory-auth': token }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to perform reset all operation');
    }
  }
};

const uploadTitleBasics = async (filePath) => {
  
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  const formData = new FormData();

  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await apiInstance.post('/admin/upload/titlebasics', formData, {
      headers: { 
        'x-observatory-auth': token,
        ...formData.getHeaders()
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to upload file');
    }
  }
};

const uploadTitleAkas = async (filePath) => {
  
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  const formData = new FormData();

  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await apiInstance.post('/admin/upload/titleakas', formData, {
      headers: { 
        'x-observatory-auth': token,
        ...formData.getHeaders()
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to upload file');
    }
  }
};

const uploadNameBasics = async (filePath) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await apiInstance.post('/admin/upload/namebasics', formData, {
      headers: { 
        'x-observatory-auth': token,
        ...formData.getHeaders()
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to upload file');
    }
  }
};

const uploadTitleCrew = async (filePath) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await apiInstance.post('/admin/upload/titlecrew', formData, {
      headers: { 
        'x-observatory-auth': token,
        ...formData.getHeaders()
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to upload file');
    }
  }
};

const uploadTitleEpisode = async (filePath) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await apiInstance.post('/admin/upload/titleepisode', formData, {
      headers: { 
        'x-observatory-auth': token,
        ...formData.getHeaders()
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to upload file');
    }
  }
};

const uploadTitlePrincipals = async (filePath) => {
  
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await apiInstance.post('/admin/upload/titleprincipals', formData, {
      headers: { 
        'x-observatory-auth': token,
        ...formData.getHeaders()
      }
    });
    return response.data;
  }

  catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to upload file');
    }
  }
};

const uploadTitleRatings = async (filePath) => {

  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));

  try {
    const response = await apiInstance.post('/admin/upload/titleratings', formData, {
      headers: { 
        'x-observatory-auth': token,
        ...formData.getHeaders()
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to upload file');
    }
  }
};

const getTitleByID = async (titleID, format = 'json') => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  try {
    const response = await apiInstance.get(`/title/${titleID}`, {
      params: { format },
      headers: { 'x-observatory-auth': token }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(`Error: ${error.message}`);
    }
  }
};


const searchTitleByPart = async (titlePart, format = 'json') => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  try {
    const response = await apiInstance.get('/searchtitle', {
      headers: {
        'x-observatory-auth': token,
        'Content-Type': 'application/json'
      },
      params: { format },
      data: {
        titlePart
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Error searching for title');
    }
  }
};

const getTitlesByGenre = async (qgenre, minrating, yrFrom, yrTo, format = 'json') => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  try {
    const response = await apiInstance.get('/bygenre', {
      headers: {
        'x-observatory-auth': token,
        'Content-Type': 'application/json'
      },
      params: { format },
      data: {
        qgenre,
        minrating,
        yrFrom,
        yrTo
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Error retrieving titles');
    }
  }
};

const getNameByID = async (nameID, format = 'json') => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }
  try {
    const response = await apiInstance.get(`/name/${nameID}`, {
      params: { format },
      headers: { 'x-observatory-auth': token }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    else {
      throw new Error('Error retrieving person details');
    }
  }
}

const searchNameByPart = async (namePart, format = 'json') => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }
  try {
    const response = await apiInstance.get('/searchname', {
      headers: {
        'x-observatory-auth': token,
        'Content-Type': 'application/json'
      },
      params: { format },
      data: {
        namePart
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    else {
      throw new Error('Error searching for name');
    }
  }
};

const uploadUserRating = async (userID, titleID, userRating) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  try {
    const response = await apiInstance.post('/uploadrating', {
      userID,
      titleID,
      userRating
    }, {
      headers: { 'x-observatory-auth': token }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Error uploading rating');
    }
  }
};

const getUserRatings = async (userID, format = 'json') => {

  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }
  try {
    const response = await apiInstance.get(`/ratings/${userID}`, {
      params: { format },
      headers: { 'x-observatory-auth': token }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    else {
      throw new Error('Error retrieving user ratings');
    }
  }
};

const deleteUserRating = async (userID, titleID) => {

  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }
  try {
    const response = await apiInstance.delete(`/ratings/${userID}/${titleID}`, {
      headers: { 'x-observatory-auth': token }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    else {
      throw new Error('Error deleting user rating');
    }
  }
};

const getMovieRecommendations = async (genres, actors, director, format = 'json') => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  try {
    const response = await apiInstance.get('/recommendations', {
      headers: {
        'x-observatory-auth': token,
        'Content-Type': 'application/json'
      },
      params: { format },
      data: {
        genres,
        actors,
        director
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    else {
      throw new Error('Error retrieving recommendations');
    }
  }
};

const getTitleDetails = async (titleID, format = 'json') => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }

  try {
    const response = await apiInstance.get(`/titles/${titleID}/details`, {
      params: { format },
      headers: { 'x-observatory-auth': token }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Error retrieving title details');
    }
  }
};

const getHomepageData = async (format = 'json') => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }
  try {
    const response = await apiInstance.get('/home', {
      params: { format },
      headers: { 'x-observatory-auth': token }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    else {
      throw new Error('Error retrieving homepage data');
    }
  }
};

const getAllTvShowsEpisodes = async (format = 'json') => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found. You are not logged in.');
  }
  try {
    const response = await apiInstance.get('/tv-shows/episodes', {
      params: { format },
      headers: { 'x-observatory-auth': token }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    else {
      throw new Error('Error retrieving TV shows episodes');
    }
  }
}




module.exports = {
  login,
  logout,
  addUser,
  getUser,
  healthCheck,
  resetAll,
  uploadTitleBasics,
  uploadTitleAkas,
  uploadNameBasics,
  uploadTitleCrew,
  uploadTitleEpisode,
  uploadTitlePrincipals,
  uploadTitleRatings,
  getTitleByID,
  searchTitleByPart,
  getTitlesByGenre,
  getNameByID,
  searchNameByPart,
  uploadUserRating,
  getUserRatings,
  deleteUserRating,
  getMovieRecommendations,
  getTitleDetails,
  getHomepageData,
  getAllTvShowsEpisodes
};
