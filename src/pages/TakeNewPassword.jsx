import { useNavigate, useParams } from "react-router-dom";
import BlogLayout from '../Layout/BlogLayout';
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff } from 'lucide-react';
import {resetPassword} from "../store/authSlice.js";


function TakeNewPassword(){

    const {resetPasswordToken}=useParams();
const [password,setpassword]=useState("");
const [showPassword, setShowPassword] = useState(false);
const dispatch=useDispatch();
const navigate=useNavigate();

   async function onReset(e){
e.preventDefault();

if(!password){
    toast.error("please enter new password");
    return ;
}

const response=await dispatch(resetPassword({ resetToken: resetPasswordToken, password }));

if (response?.payload?.success) {
    navigate("/");
  }

    }
function handleUserInput(e){

    e.preventDefault();
    setpassword(e.target.value);

}


    return(
<BlogLayout>
  <div className="min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-full p-4">
            <Lock className="text-gray-800" size={40} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900">Reset your password</h1>
        <p className="text-center text-gray-600 mt-2 mb-8">Create a new password to regain access to your account.</p>

        <form noValidate onSubmit={onReset} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                name="password"
                id="password"
                placeholder="Enter new password"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder-gray-400"
                onChange={handleUserInput}
                value={password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">Use at least 8 characters, including letters and numbers.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-black py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  </div>
</BlogLayout>
    )

}

export default TakeNewPassword;