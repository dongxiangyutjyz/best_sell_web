const axios = require('axios');
const {FETCH_USER} = require('./types');

const fetchUser = module.exports = () => {
  return function(dispatch) {
    axios
      .get('/api/current_user')
      .then(res => dispatch({type:FETCH_USER,payload:res.data }));
  };
};
