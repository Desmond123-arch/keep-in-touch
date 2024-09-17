import axios from "axios";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface ValidationErrors{
  [key: string]: string;
}
interface LoginResponse {
  status: string;
  user?: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  }; 
  // token?: string;
  // error?: string;
}



async function Authenticate(userEmail:string, password:string)
{
    const base_url = "http://localhost:3000"
    try
    {
        const response = await axios.post<LoginResponse>(`${base_url}/users/auth/login`, {
            email: userEmail,
            password: password,
        });
        console.log(response);
        localStorage.setItem('currentUserId', response.data.user._id)
        return response.data;
    }
    catch (err){
        console.log(err);
        return false;
    }
}
function Login() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<ValidationErrors>({});
  let validationErrors:ValidationErrors = {};

  const  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.log(password, confirm);
    const re:RegExp = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
    if (!re.test(email))
    {
      validationErrors.email = "Invalid email was entered";
    }

    if (Object.keys(validationErrors).length > 0)
    {
      setErrors(validationErrors);
      console.log(validationErrors);
    }
    else{
        const response = await Authenticate(email, password) as loginResponse
        if (response)
            {
                console.log(response)
                navigate("/home")
            }
      setErrors({});
    }
  }
  return (
    <div className="mx-auto border-2 shadow-md shadow-gray-300 w-[100%] rounded-lg text-center p-4 md:w-[60%] lg:w-[35%] center">
      <h1 className="text-start pl-2 font-bold text-2xl">
       Login to an account
      </h1>
      <div className="my-5">
        <button className=" mx-auto w-[70%] border-2 rounded-2xl border-gray-200 shadow-sm shadow-gray-100 flex items-center justify-center gap-2">
          <FcGoogle size={35} />
          Sign In with Google
        </button>
      </div>
      <div className="relative flex py-3 items-center w-[70%] mx-auto">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="flex-shrink mx-4 text-gray-400">OR</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-[70%] mx-auto mb-3">
          <label className="text-start font-semibold " htmlFor="email">Email</label>
          <input type="email" name="email" id="email" placeholder="Enter your email" className="placeholder:text-gray-400 w-full rounded-2xl text-md p-2 border border-gray-300" required></input>
          {errors.email && <p className="text-sm text-start font-bold text-red-600">{errors.email}</p>}
        </div>
        <div className="flex flex-col w-[70%] mx-auto mb-3">
          <label className="text-start font-semibold " htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="Enter your name" className="placeholder:text-gray-400 w-full rounded-2xl text-md p-2 border border-gray-300" required></input>
        </div>
        <button type="submit" className="text-white bg-black rounded-2xl text-md p-2 border border-gray-300 w-[70%] my-5" >Log In</button>
      </form>
      <p>Don't have an account? <Link to="/" className="font-bold hover:underline hover:text-gray-300">Sign up</Link></p>
    </div>
  );
}
export default Login;