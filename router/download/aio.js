const axios = require('axios');

// Sebaiknya simpan di environment variable
const API_KEY = process.env.PITUCODE_API_KEY || '7C0dEf99730';
const TARGET_URL = 'https://www.youtube.com/watch?v=example'; // Ganti dengan URL yang valid

axios.post('https://api.pitucode.com/aio-downloader-v2', {
  url: TARGET_URL
}, {
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json'
  }
})
.then(res => {
  console.log('Success:', res.data);
})
.catch(error => {
  if (error.response) {
    console.error('Error:', error.response.status, error.response.data);
  } else {
    console.error('Error:', error.message);
  }
});
