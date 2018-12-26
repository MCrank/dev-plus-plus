import axios from 'axios';
import apiKeys from '../apiKeys';

const fireBaseUrl = apiKeys.firebaseConfig.databaseURL;

const getArticles = uid => new Promise((resolve, reject) => {
  axios
    .get(`${fireBaseUrl}/articles.json?orderBy="uid"&equalTo="${uid}"`)
    .then((res) => {
      const articles = [];
      if (res.data !== null) {
        Object.keys(res.data).forEach((key) => {
          res.data[key].id = key;
          articles.push(res.data[key]);
        });
      }
      resolve(articles);
    })
    .catch(error => reject(error));
});

const postRequest = article => axios.post(`${fireBaseUrl}/articles.json`, article);

const deleteArticle = articleId => axios.delete(`${fireBaseUrl}/articles/${articleId}.json`);

export default { getArticles, postRequest, deleteArticle };
