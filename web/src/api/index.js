import axios from 'axios';

const devUrl = 'http://localhost:5000';
const prodUrl = 'http://localhost:5000';

// const url = devUrl     //process.env.NODE_ENV === 'production'

const API = axios.create({ baseURL: devUrl})

API.interceptors.request.use((req)=>{
    if(localStorage.getItem('profile')){
        req.headers.Authorization =  `Bearer ${JSON.parse(localStorage.getItem('profile')).token }`
    }
    return req;
})

export const fetchPosts = () => API.get('/posts');
export const creatPost = (newPost) => API.post('/posts', newPost);
export const updatePost = (postId,postToUpdate) => API.patch(`${'/posts'}/${postId}`, postToUpdate);
export const deletePost = (postId) => API.delete(`${'/posts'}/${postId}`);
export const likePost = (postId) => API.patch(`${'/posts'}/${postId}/likePost`);

export const signIn = (formData) => API.post('/user/signin', formData)
export const signUp = (formData) => API.post('/user/signup', formData)