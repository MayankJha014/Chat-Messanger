import React, { useContext, useEffect, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { PiMoonBold } from "react-icons/pi";
import Dailog from "./dialog";
import { useDispatch, useSelector } from "react-redux";
import { searchUser } from "../redux/action/search";
import { createGroupChat, getAllChat } from "../redux/action/chat";
import toast from "react-hot-toast";
import { clearSearch } from "../redux/slice/search";
import { IoMdPerson } from "react-icons/io";
import { MdOutlineLightMode, MdPermContactCalendar } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import themeContext from "../theme/theme_context";

const Navbar = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [member, setMember] = useState();
  const [chatName, setChatName] = useState();
  const [memberList, setMemberList] = useState([]);
  const { searchData } = useSelector((state) => state.search);
  const { authData } = useSelector((state) => state.auth);
  const { chatData, isSuccess, isMessage } = useSelector((state) => state.chat);

  const theme = useContext(themeContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (member == "") {
      dispatch(clearSearch());
    } else {
      dispatch(searchUser(member));
    }
  }, [member]);

  useEffect(() => {
    if (isMessage && isSuccess == false) {
      toast.error(isMessage);
    }
    if (isMessage && isSuccess == true) {
      toast.success(isMessage);
    }
  }, [chatData]);

  useEffect(() => {
    if (open === false) {
      setMemberList([]);
      setChatName("");
      setMember("");
    }
  }, [open]);

  const addMember = (x) => {
    const isUnique = memberList.every((user) => user.email !== x.email);

    if (isUnique) {
      setMemberList((prevUsers) => [...prevUsers, x]);
    }
  };
  const removeUser = (email) => {
    setMemberList((prevUsers) =>
      prevUsers.filter((user) => user.email !== email)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: chatName,
      members: memberList,
    };
    dispatch(createGroupChat(data)).then(() => {
      dispatch(getAllChat());
      setOpen(false);
    });
  };

  return (
    <div className="flex w-full relative overflow-hidden ">
      <div
        className={` w-16 h-full p-2 ${
          theme.theme ? " bg-white shadow-xl z-40" : " bg-slate-950"
        } relative transition-colors duration-500`}
      >
        <div className="flex flex-col h-full  items-center">
          <img
            src={authData?.profilePic}
            alt=""
            className="rounded-full my-4 w-10 object-cover h-10"
          />
          {/* <div className="flex flex-grow flex-col items-center justify-between h-full my-10"> */}
          <div className="flex flex-col justify-around flex-grow mb-16">
            {/* <div className="h-24"></div> */}
            <div className="relative inline-flex self-center sidebar5">
              <IoMdPerson
                size={25}
                className={!theme.theme ? " text-white" : " text-[#6f7178]"}
              />

              <span className="absolute rounded-full  py-1 px-2 -translate-x-3 text-xs font-medium content-[''] leading-none grid place-items-center   -translate-y-7 bg-gray-600 text-white ">
                Profile
              </span>
            </div>
            <div className="relative inline-flex self-center sidebar4">
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/sf-regular/48/7c7e84/chat-message.png"
                alt="chat-message"
                className={` ${
                  !theme.theme
                    ? " text-white invert"
                    : " text-grey invert-[35%]"
                } cursor-pointer brightness-0 `}
              />

              <span className="absolute rounded-full  py-1 px-2 -translate-x-4 text-xs font-medium content-[''] leading-none grid place-items-center   -translate-y-7 bg-gray-600 text-white ">
                Message
              </span>
            </div>
            <div className="relative inline-flex self-center sidebar1">
              <FaUserFriends
                size={25}
                className={
                  !theme.theme
                    ? " text-white cursor-pointer"
                    : " text-[#6f7178] cursor-pointer"
                }
                onClick={() => setOpen(!open)}
              />
              <span className="absolute rounded-full  py-1 px-2 -translate-x-3 text-xs font-medium content-[''] leading-none grid place-items-center   -translate-y-7 bg-gray-600 text-white ">
                Group
              </span>
            </div>
            <div className="relative inline-flex self-center sidebar2">
              <MdPermContactCalendar
                size={25}
                className={!theme.theme ? " text-white" : " text-[#6f7178]"}
              />

              <span className="absolute rounded-full  py-1 px-2 -translate-x-[18px] text-xs font-medium content-[''] leading-none grid place-items-center   -translate-y-7 bg-gray-600 text-white ">
                Contacts
              </span>
            </div>
            <div className="relative inline-flex self-center sidebar3">
              <IoMdSettings
                size={25}
                className={!theme.theme ? " text-white" : " text-[#6f7178]"}
              />

              <span className="absolute rounded-full  py-1 px-2 -translate-x-4 text-xs font-medium content-[''] leading-none grid place-items-center   -translate-y-7 bg-gray-600 text-white ">
                Settings
              </span>
            </div>
          </div>
          {!theme.theme ? (
            <PiMoonBold
              size={30}
              className={
                !theme.theme
                  ? " text-white cursor-pointer"
                  : " text-[#6f7178] cursor-pointer"
              }
              onClick={() => theme.updateTheme()}
            />
          ) : (
            <MdOutlineLightMode
              size={30}
              className={
                !theme.theme
                  ? " text-white cursor-pointer"
                  : " text-[#6f7178] cursor-pointer"
              }
              onClick={() => theme.updateTheme()}
            />
          )}
          {/* </div> */}
        </div>
      </div>
      {children}
      <Dailog
        open={open}
        setOpen={setOpen}
        width="sm:w-[50%] w-[95%]"
        dialogText={"Create New Group"}
      >
        <div className="flex flex-col">
          <label
            htmlFor="groupname"
            className=" text-black my-2 text-sm font-medium  font-noto-sans"
          >
            Group Name
          </label>
          <input
            type="text"
            name="groupname"
            id="name"
            value={chatName}
            className="rounded-md  text-black pl-4 h-9 w-11/12 mt-1 bg-white border border-black/50"
            onChange={(e) => setChatName(e.target.value)}
          />{" "}
          <label
            htmlFor="groupmembers"
            className=" text-black my-2 text-sm font-medium  font-noto-sans"
          >
            Group Members
          </label>
          <input
            type="text"
            name="groupmembers"
            value={member}
            id="group"
            onChange={(e) => setMember(e.target.value)}
            className="rounded-md  text-black pl-4 h-9 w-11/12  bg-white border border-black/50"
          />{" "}
          <div className="flex flex-wrap gap-2 my-2">
            {memberList?.map((x, index) => (
              <div
                data-dismissible="chip"
                className="relative grid select-none items-center whitespace-nowrap  rounded-lg bg-gray-900 py-1.5 px-3 font-sans text-xs font-bold uppercase text-white"
              >
                <span className="mr-5">{x.name}</span>
                <button
                  data-dismissible-target="chip"
                  className="!absolute  top-2/4 right-1 mx-px h-5 max-h-[32px] w-5 max-w-[32px] -translate-y-2/4 select-none rounded-md text-center align-middle font-sans text-xs font-medium uppercase text-white transition-all hover:bg-white/10 active:bg-white/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={() => removeUser(x.email)}
                >
                  <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            ))}
          </div>
          {
            <div className="max-h-44 overflow-auto">
              {searchData?.map((x, index) => (
                <div
                  className={`flex items-center my-2 w-11/12 hover:bg-gray-200 cursor-pointer  p-2 rounded-lg`}
                  key={index}
                  onClick={() => addMember(x)}
                >
                  <img
                    src={x?.profilePic}
                    alt=""
                    className="w-11 mr-4 rounded-full"
                  />
                  <div className="flex w-[75%] justify-between items-center">
                    <div>
                      <p className="font-medium tracking-wide text-base font-public-sans text-black px-1 rounded-full mT-2">
                        {x?.name}
                      </p>{" "}
                      <p className="text-xs  text-gray-700 px-1 ">{x.email}</p>{" "}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-gray-700 text-white rounded-lg"
          >
            Submit
          </button>
        </div>
      </Dailog>
    </div>
  );
};

export default Navbar;
