import React, { useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import useStyles from "./styles";
import { createPost, updatePost } from "../../actions/posts";

const Form = ({currentId, setCurrentId}) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const post = useSelector((state)=> currentId ? state.posts.find(post=> post._id === currentId) : null)
  const user = JSON.parse(localStorage.getItem("profile"))

  const [postData, setPostData] = useState({
      title:'',
      message:'',
      tags:'',
      selectedFiles : ''
  })


  const handleSubmit = (e) => {
    e.preventDefault();
    if(currentId){
      dispatch(updatePost(currentId, {...postData, name: user?.result?.name}));
    }
    else{
      dispatch(createPost({...postData, name : user?.result?.name}));
    }
    clear();
  };

  const handleChange = (e) =>{
    const { target} = e;
    let data = {...postData};
    if(target.name === 'tags'){
      data[target.name] = target.value.split(",");
    }
    else{
      data[target.name] = target.value;
    }
    setPostData(data)

  }

  const fileChangedHandler = (event) => {
    
    /* Get files in array form */
    const files = Array.from(event.target.files);

    /* Map each file to a promise that resolves to an array of image URI's */

    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.addEventListener("load", (ev) => {
            resolve(ev.target.result);
          });
          reader.addEventListener("error", reject);
          reader.readAsDataURL(file);
        });
      })
    ).then(
      (images) => {
        /* Once all promises are resolved, update state with image URI array */ 
        if(images.length > 0){
            setPostData({
                ...postData,
                selectedFiles: images[0]
            })
        } 
      },
      (error) => {
        console.error("error occured while changing the image", error);
      }
    );
  };


  const clear = () =>{
    setCurrentId(null);
    setPostData({title:'',message:'',tags:'',selectedFiles : ''});
  }

  useEffect(() =>{
    if(post) setPostData(post)
  },[post])
  
   if(!user?.result?.name){
     return (
       <Paper className={classes.paper}>

        <Typography variant="h6" align="center">
          Please Sign in to create your own memory and to like others posts
        </Typography>
       </Paper>
     )
   }
   
   return (
    <Paper className={classes.paper}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">{currentId ? 'Editing':'Creating'} a Memory</Typography>
        
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={ e=> handleChange(e)}
        />

        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          value={postData.message}
          onChange={ e=> handleChange(e)}
        />

        <TextField
          name="tags"
          variant="outlined"
          label="Tags"
          fullWidth
          value={postData.tags}
          onChange={ e=> handleChange(e)}
        />
        <div className={classes.fileInput}>
            <input type="file" name="selectedFiles" onChange={fileChangedHandler} />
        </div>
        <Button className={ classes.buttonSubmit } variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small"  fullWidth onClick={clear}>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;
