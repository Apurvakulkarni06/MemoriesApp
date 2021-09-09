import * as api from '../api';
import { FETCH_ALL, CREATE, UPDATE, DELETE, LIKED } from '../constants/actionTypes';

// Action Creators
const getPosts = () => async(dispatch) =>{
    try {

        const { data } = await api.fetchPosts();
        dispatch({type: FETCH_ALL, payload: data})
        
    } catch (error) {
        console.log(error.message)
    }
    // type is action name and payload for data storage;
    
}

const createPost = (post) => async(dispatch) =>{
    try {

        const { data } = await api.creatPost(post);
        dispatch({type: CREATE, payload: data})
        
    } catch (error) {
        console.log(error.message)
    }
    // type is action name and payload for data storage;
    
}

const updatePost = (id, post) => async(dispatch) =>{

    try {

        const { data } = await api.updatePost(id, post);
        dispatch({type: UPDATE, payload: data})
        
    } catch (error) {
        console.log(error.message)
    }

}

const deletePost = (id) => async(dispatch) =>{

    try {
        await api.deletePost(id)
        dispatch({ type: DELETE, payload: id})
    } catch (error) {
        console.log(error)
    }
}

const likePost = (id) => async(dispatch) =>{
    try {

        const { data }  = await api.likePost(id);
        dispatch({ type:LIKED, payload: data})
        
    } catch (error) {
        console.log(error)
    }
}

export { getPosts, createPost, updatePost, deletePost, likePost }