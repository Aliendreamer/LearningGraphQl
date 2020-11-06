import axios from "axios";
import {useState} from "react";


export default ({url,method,body,onSuccess})=>{
   const [errors,setErrors]= useState(null);
   const doRequest = async()=>{
      try {
         setErrors(null);
         const response =  await axios[method](url,body);
         if(onSuccess)
            onSuccess(response.data)
      } catch (error) {
       setErrors(
       <div className="alert alert-danger">
         <ul className="my-0">
             {error.response.data.errors.map((err,i)=><li key={i}>{err.message} </li>)}
         </ul>
       </div>
       );
      }
   }

   return {doRequest,errors};
}
