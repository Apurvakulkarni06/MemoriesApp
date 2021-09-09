import bcrypt from 'bcryptjs'; // to create hash passwords
import jwt from 'jsonwebtoken';

import UserModel from '../models/user.js'; 

// in code test is the secret key used to create token

export const signin = async(req, res) =>{
    const { email, password} = req.body;
    try {

        const existingUser = await UserModel.findOne({ email });
        if(!existingUser) return res.status(404).json({message :"User doesn't exists"})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentials "})

        const token = await jwt.sign({ email: existingUser.email, id: existingUser._id}, 'test', { expiresIn: '1h'})

        return res.status(200).json({ result: existingUser, token})
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"})
    }

}

export const signup = async(req, res) =>{
    console.log("user wants to register into system")
    const { email, password, confirmPassword, firstName, lastName} = req.body;
    console.log(email)
    try {
        
        const existingUser = await UserModel.findOne({ email });
        // console.log(existingUser);
        if(existingUser) {
            console.log(existingUser.length)
            console.log(existingUser.email)
            return res.status(400).json({message :"User already exists"});

        }
        
        if(password !== confirmPassword) return res.status(400).json({message :"Password doesn't match"});
        
        const hashedPassword = await bcrypt.hash(password, 12)// here 12 is salt( length of hashed passowrd)
        const result = await UserModel.create({email, password: hashedPassword, name: `${firstName} ${lastName}`})
        
        const token = jwt.sign({email: result.email, id: result._id}, 'test', { expiresIn: '1h'});
        console.log("token created", token)
        
        return res.status(201).json({result, token})
    } catch (error) {
        return res.status(500).json({message:"Something went wrong"})
    }
}


