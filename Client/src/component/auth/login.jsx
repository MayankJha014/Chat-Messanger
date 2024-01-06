import React, { useEffect, useState } from "react";
import backgroundImg from "../../assets/background.webp";
import profileImg from "../../assets/profileimg.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, signup } from "../../redux/action/auth";
import toast from "react-hot-toast";

const Login = (props) => {
  const [register, setRegister] = useState(false);
  const [formData, setFormData] = useState();
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, isMessage, authData, isSuccess } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (authData) {
      props.socket.emit("setup", authData);
      navigate("/home");
    }
  }, [authData, dispatch]);

  useEffect(() => {
    if (isMessage && isSuccess == false) {
      toast.error(isMessage);
    }

    if (isSuccess == true) {
      toast.success("User successfully created");
    }
  }, [isMessage, authData, dispatch]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const handleImg = async (e) => {
    const presetKey = "chat_app1";
    const cloudName = "dfzhy0jqv";
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", presetKey);
    setLoading(true);
    let res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    setLoading(false);

    res = await res.json();
    console.log(res.url);
    setImage(res.url);
    setFormData((prevFormData) => ({
      ...prevFormData,
      profilePic: res.url,
    }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    register ? dispatch(signup(formData)) : dispatch(login(formData));
  };
  return (
    <>
      <div className="h-screen w-full flex">
        <img
          src={backgroundImg}
          alt=""
          className="w-screen h-screen absolute z-[-1]"
        />
        <div className="bg-blackCu m-auto sm:w-1/2 lg:w-[30rem]  z-10 p-10 ">
          <h1 className="font-bold text-3xl text-center font-noto-sans text-white p-2">
            Welcome back!
          </h1>
          <h3 className=" text-grey text-center font-robot">
            We{"'"}re so excited to see you again!
          </h3>
          <div className="h-5"></div>
          <form action="">
            <div className="flex flex-col justify-start text-left">
              {register ? (
                <>
                  <input
                    type="file"
                    name="profilePic"
                    id="file"
                    className="hidden"
                    onChange={handleImg}
                  />
                  <label htmlFor="file">
                    <img
                      src={image ?? profileImg}
                      alt=""
                      className="w-20 h-20 object-cover mx-auto my-2 rounded-full"
                    />
                  </label>
                  <label
                    htmlFor="name"
                    className=" text-grey mt-4 text-base font-semibold  font-noto-sans"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    onChange={handleChange}
                    className="rounded-md  text-white pl-4 h-9 w-11/12 mt-1 bg-black/60"
                  />
                </>
              ) : (
                <></>
              )}
              <label
                htmlFor="email"
                className=" text-grey mt-4 text-base font-semibold  font-noto-sans"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                className="rounded-md h-9 text-white pl-4 w-11/12 mt-1 bg-black/60"
              />
              <label
                htmlFor="password"
                className=" text-grey text-base mt-4 font-semibold font-noto-sans"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                onChange={handleChange}
                className="rounded-md h-9 text-white pl-4 w-11/12 mt-1 mb-10 bg-black/60"
              />
              {/* <Link to="/home"> */}
              <button
                className="bg-voilet text-white font-noto-sans p-2.5 rounded-lg font-medium w-11/12"
                onClick={handleSubmit}
              >
                {" "}
                {register ? (
                  loading ? (
                    <div role="status" className="text-center">
                      <svg
                        aria-hidden="true"
                        className="w-8 h-8 m-auto text-gray-200 animate-spin  fill-indigo-700"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    <p>Sign Up</p>
                  )
                ) : (
                  <p> Log In</p>
                )}
              </button>
              {/* </Link> */}
              <p className=" text-grey text-center font-robot my-3 text-sm ">
                Need an account?
                <span
                  className="text-voilet cursor-pointer mx-1"
                  onClick={() => setRegister(!register)}
                >
                  Register
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
