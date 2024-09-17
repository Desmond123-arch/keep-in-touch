import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

interface ValidationErrors {
  [key: string]: string;
}
interface UserData {
  [key: string]: string;
}
interface CreationResponse {
  status: string;
  user?: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

async function CreateAccount(userData: UserData) {
  const base_url = "http://localhost:3000";
  try {
    const response = await axios.post<CreationResponse>(`${base_url}/users/auth/create`, {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
    });
    console.log(response);
    localStorage.setItem('currentUserId', response.data.user?._id || "");
    return response.data;
  } catch (err) {
    console.log(err);
    return false;
  }
}

function SignUp() {
  const [errors, setErrors] = useState<ValidationErrors>({});
  let validationErrors: ValidationErrors = {};
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    const re: RegExp = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    if (!re.test(email)) {
      validationErrors.email = "Invalid email was entered";
    }
    if (password !== confirm) {
      validationErrors.confirm = "Passwords don't match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log(validationErrors);
    } else {
      const result = await CreateAccount({ firstName, lastName, email, password });
      if (result && result.status === "success") {
        setErrors({});
        navigate("/home"); // Navigate to the home page on successful sign up
      } else {
        console.log("Account creation failed");
      }
    }
  };

  return (
    <div className="mx-auto border-2 shadow-md shadow-gray-300 w-[100%] rounded-lg text-center p-4 md:w-[60%] lg:w-[35%]">
      <h1 className="text-start pl-2 font-bold text-2xl">
        Create a free account
      </h1>
      <p className="text-start text-gray-400 font-medium text-sm pl-2">
        Talk with people around the world
      </p>
      {/* <div className="my-5">
        <button className="mx-auto w-[70%] border-2 rounded-2xl border-gray-200 shadow-sm shadow-gray-100 flex items-center justify-center gap-2">
          <FcGoogle size={35} />
          Sign Up with Google
        </button>
      </div> */}
      {/* <div className="relative flex py-3 items-center w-[70%] mx-auto">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="flex-shrink mx-4 text-gray-400">OR</span>
        <div className="flex-grow border-t border-gray-400"></div>
      </div> */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-[70%] mx-auto mb-3">
          <label className="text-start font-semibold" htmlFor="firstName">
            FirstName
          </label>
          <input
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            className="placeholder:text-gray-400 w-full rounded-2xl text-md p-2 border border-gray-300"
            required
          />
        </div>
        <div className="flex flex-col w-[70%] mx-auto mb-3">
          <label className="text-start font-semibold" htmlFor="lastName">
            LastName
          </label>
          <input
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            className="placeholder:text-gray-400 w-full rounded-2xl text-md p-2 border border-gray-300"
            required
          />
        </div>
        <div className="flex flex-col w-[70%] mx-auto mb-3">
          <label className="text-start font-semibold" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            className="placeholder:text-gray-400 w-full rounded-2xl text-md p-2 border border-gray-300"
            required
          />
          {errors.email && (
            <p className="text-sm text-start font-bold text-red-600">
              {errors.email}
            </p>
          )}
        </div>
        <div className="flex flex-col w-[70%] mx-auto mb-3">
          <label className="text-start font-semibold" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="placeholder:text-gray-400 w-full rounded-2xl text-md p-2 border border-gray-300"
            required
          />
        </div>
        <div className="flex flex-col w-[70%] mx-auto mb-3">
          <label className="text-start font-semibold" htmlFor="confirm">
            Confirm Password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            placeholder="Confirm your password"
            className="placeholder:text-gray-400 w-full rounded-2xl text-md p-2 border border-gray-300"
            required
            minLength={7}
          />
          {errors.confirm && (
            <p className="text-sm text-start font-bold text-red-600">
              {errors.confirm}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="text-white bg-black rounded-2xl text-md p-2 border border-gray-300 w-[70%] my-5"
        >
          Sign Up
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to="/login" className="font-bold hover:underline hover:text-gray-300">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default SignUp;
