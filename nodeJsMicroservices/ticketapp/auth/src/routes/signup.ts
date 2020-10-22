import { BadRequestError } from './../errors/badRequestError';
import { RequestValidationError } from './../errors/requestValidationError';

import  express,{Request,Response} from "express";
import {body,validationResult} from "express-validator";
import { User } from '../models/user';

const router = express.Router();

router.post("/api/users/signup",[
   body('email').isEmail().withMessage("Email must be valid"),
   body('password').trim().isLength({min:4,max:20}).withMessage("Password must be between 4 and 20 characters")
],async(req:Request,res:Response)=>{
   const errors = validationResult(req);
   if(!errors.isEmpty()){
     const error = new RequestValidationError(errors.array());
     throw error;
   }
   const {email,password}= req.body;
   const existingUser = await User.findOne({email});
   if(existingUser)
      throw new BadRequestError("Email in use already")

    const user = await User.build({email,password}).save();
    return res.status(200).send(user)
})

export {router as signUpRouter}