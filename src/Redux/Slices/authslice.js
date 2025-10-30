import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

import axiosInstance from "../../helper/axiosinstance";
const initialState = {
    // isLoggedIn check ki user login hai ya nhi
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    // isLoggedIn:false,
    // role show about the role of user
    role: localStorage.getItem("role") || "user",
    // data me extra data regarding user store karaenge
    data: localStorage.getItem("data")!=="undefined"?JSON.parse(localStorage.getItem("data")) :{},
};
export const createAccount = createAsyncThunk("/auth/signup", async (data) =>{
    //create account itself an object
    try {
        const res = axiosInstance.post("/user/register", data,{
            withCredentials: true
        });
        // const res=await axiosInstance.post('user/register',data);
        //when toast give according to state of promise
        //res is promise
        toast.promise(res, {
            loading: "wait! your account creating",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to create account",
        });

        return (await res).data;
    } catch (error) {
      
        toast.error(error?.response?.data?.message);
    }
});

//login is a functuion which actually return a promise
export const login = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = axiosInstance.post("/user/login", data,{
            withCredentials: true
        }); //yahan await lagate to toast aane me bhi time lagta
        toast.promise(res, {
            loading: "wait! authentication in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to login ",
        });
        return (await res).data; //yahan se jo bhi return karega woh as it is action ke payload me exists karega extrareducer me jo action hai uske payload me .
    } catch (error) {
      
        toast.error(error?.response?.data?.message);
    }
});

export const Logout = createAsyncThunk("auth/logout", async () => {
    try {
        const res = axiosInstance.get("user/logout");

        toast.promise(res, {
            loading: "wait! logout in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to logout ",
        });

        return (await res).data;
    } catch (err) {
       
        toast.error(err?.responce?.data?.message);
    }
});

export const updateProfile = createAsyncThunk(
    "/user/update/profile",
    async (data) => {
        try {
            const res = axiosInstance.put(`/user/update/${data[0]}`, data[1]); //user ki id url me deni hogi n

            toast.promise(res, {
                loading: "wait! profile update in progress...",
                success: (data) => {
                    return data?.data?.message;
                },
                error: "Failed to update the profile ",
            });

            return (await res).data;
        } catch (err) {
          
            toast.error(err?.responce?.data?.message);
        }
    }
);
export const getUserData = createAsyncThunk(
    "/user/details",
    async () => {
        try {
            const res = axiosInstance.get('/user/me'); 
            // const res = axios.get(`${import.meta.env.VITE_APP_BASE_URL_WEB}/api/v1/user/me`,{
            //     withCredentials:true
            // }); 
            return (await res).data;
        } catch (err) {
  
            toast.error(err?.message);
        }
    }
);

export const changeUserPassword=createAsyncThunk("/user/changeUserPassword",async (data)=>{

    try {

        const res=axiosInstance.post('/user/changepassword',data);

        toast.promise(res,{

            loading:"Changing your passsword...",
            success:(data)=>{
return data?.data?.message;
            },
            error:(err)=>{
                // console.log("err in authslice=",err)
return err?.response?.data?.message;
            },

        })

        return (await res).data;
        
    } catch (err) {

    
        toast.error(err?.responce?.data?.message);
        
    }

})

export const googleAuth=createAsyncThunk("google/auth",async ()=>{

    try{
        const res=axios.get(`${import.meta.env.VITE_APP_BASE_URL_WEB}/auth/google`,{
            withCredentials:true
        })
    toast.promise(res,{
        loading:"Authentication is in process...",
        success:(data)=>{
            return data?.data?.message;
                        },
     error:"Failed to authenticate"
  
    })

    return (await res).data;

    }
    catch(err){
        toast.error(err?.responce?.data?.message)
    }
})

export const forgetPassword=createAsyncThunk("auth/forget",async(data)=>{

try {
    
const res=axiosInstance.post('user/forgot-password',data);

toast.promise(res,{
    loading:"sending mail...",
    success:(state)=>{
        return state?.data?.message;
    },
    error:"Failed to send mail"
})


return (await res).data;


} catch (error) {
    
    toast.error(err?.responce?.data?.message);

}

})

export const resetPassword=createAsyncThunk("auth/reset-password",async(data)=>{

    try{

        const res=axiosInstance.post(`user/reset-password/${data[0]}`,data[1]);//data[0]=>token data[1]=newpasssword
        
        toast.promise(res,{
            loading:"reseting password...",
            success:(state)=>{
                return state?.data?.message;
            },
            error:"Failed to reset password"
        })
        return (await res).data;
        
    }
    catch(err){
        toast.error(err?.responce?.data?.message);
        
    }

})

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers: {},
    //state means initial state
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action)=>{
                //yeh action object redux toolkit bna kar deti hai humne nhi bnaya and iska format fix hota hai
                //thunk jo return kar rha hai n woh action ke payload me chla jata hai

                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role;
            })
            .addCase(Logout.fulfilled, (state) => {
                localStorage.clear();

                state.isLoggedIn = false;
                state.data = {};
                state.role = "user";
            })
            .addCase(getUserData.fulfilled,(state,action)=>{
               
                if(!action?.payload?.user){
                    return 
                }
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role;


            }).addCase(createAccount.fulfilled,(state,action)=>{
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role;

            })
            .addCase(googleAuth.fulfilled,(state,action)=>{
                localStorage.setItem("data", JSON.stringify(action?.payload?.user));
                localStorage.setItem("isLoggedIn", true);
                localStorage.setItem("role", action?.payload?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role;

            })
    },
});

// export {}=authSlice.actions;
export default authSlice.reducer;
