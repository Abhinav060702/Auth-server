const userModel=require('../model/userSchema')
const emailValidator=require('email-validator')
const bcrypt=require('bcrypt')

const signup=async (req,res)=>{

    const {name,email,password}=req.body;   
    try{
        
        if(!name || ! email || ! password)
        {
            return res.status(400).json({
                success:false,
                message:"Every field is required"
            })
        }

        var validEmail=emailValidator.validate(email);
        if(!validEmail){

            return res.status(400).json({
                success:false,
                message:"Wrong Email type"
            })

        }

        const userInfo=userModel(req.body);
        const result=await userInfo.save(); //save into the database

        return res.status(200).json({
            success:true,
            data:result
    })

   }
    catch(e){

        if(e.code===11000)
        {

            return res.status(400).json({
                succes:false,
                message:"Account already registered"
            })
        }
        return res.status(400).json({
            succes:false,
            message:e.message
        })
    }

}    




const signin= async (req,res)=>{

    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Every field is required"
        })
    }

    try{

        const user=await userModel
        .findOne({email})
        .select('+password');

        if(!user || !(await bcrypt.compare(password,user.password))){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            })
        }


        const cookieOptions={

            maxAge:24*60*60*1000,
            httpOnly:true  //security purpose
        }
        const token=user.jwtToken();
        user.password=undefined;

        res.cookie("token",token,cookieOptions);
        res.status(200).json({
            succes:true,
            data:user
        })



    }catch(e){
        return res.status(400).json({
            success:false,
            message:"e.message"
        })
    }


}

const getuser =async(req,res)=>{

    const userId=req.user.id;
    try{

        const user= await userModel.findById(userId);
        return res.status(200).json({
            success:true,
            data:user
        })

    }
    catch(e)
    {
        return res.status(400).json({
            success:false,
            message:error.message
        })

    }


}

const logout=(req,res)=>{

    try{
      const cookieOptions={
        expires:new Date(),
        httpOnly:true
      }  

    res.cookie("token",null,cookieOptions);
    return res.status(200).json({
        success:true,
        data:"Logged out "
    })
    }
    catch(e){
        return res.status(400).json({
            success:false,
            message:e.message
        })
    }



}
module.exports={signup,signin,getuser,logout};