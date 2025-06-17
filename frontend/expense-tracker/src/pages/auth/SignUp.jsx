import React, { useState,useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate, Link } from 'react-router-dom'
import Input from '../../components/inputs/Input'
import { validateEmail } from '../../utils/helper'
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector'
import axiosInstance from '../../utils/axiosinstance'
import { API_PATHS } from '../../utils/apipath'
import { UserContext } from '../../context/UserContext'
import uploadImage from '../../utils/uploadImage'
const SignUp = () => {

  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const {updateUser}=useContext(UserContext)

  const navigate = useNavigate()

  //hadle login form submit
  const handleSignup = async (e) => {

    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return;
    }

    if (!password) {
      setError("Please enter the password")
      return;
    }

    setError("");

    //Sign up api call
    try {

      //upload image url if present
      if(profilePic){
        const imgUploadRes= await uploadImage(profilePic);
        profileImageUrl=imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    }

  }

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignup}>

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="jhon"
              type="text"
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder='john@gmail.com'
              type="text" />
            <div className="col-span-2">
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder='Min 8 characters'
                type="password" />
            </div>
          </div>

          {/* for showing error message */}
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type='submit' className='btn-primary'>
            Sign Up
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an accout?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp
