/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import profileImg from "../../assets/profileimg.png";
import { IoSendSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getAllChat, updateGroupChat } from "../../redux/action/chat";
import toast from "react-hot-toast";
import { SlOptions } from "react-icons/sl";
import { searchUser } from "../../redux/action/search";
import { clearSearch } from "../../redux/slice/search";
import {
  fetchChat,
  fetchChatById,
  getAllMessage,
  sendMessage,
} from "../../redux/action/message";
import moment from "moment";
import { MdDelete, MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import InputEmoji from "react-input-emoji";
import { addMessageData, clearMessage } from "../../redux/slice/message";
import Dailog from "../dialog";
import themeContext from "../../theme/theme_context";
var selectedChatCompare;

const Chat = ({ socket }) => {
  const [activeState, setActiveState] = useState();
  const { authData } = useSelector((state) => state.auth);

  const {
    isLoading: chatLoading,
    chatData,
    isMessage,
    isSuccess,
  } = useSelector((state) => state.chat);
  const { searchData } = useSelector((state) => state.search);
  const {
    isLoading: messageLoading,
    messageData,
    activeChatData,
  } = useSelector((state) => state.message);

  const [userId, setUserId] = useState("");
  const [chatId, setChatId] = useState("");
  const [notification, setNotification] = useState([]);
  const [open, setOpen] = useState(false);
  const [member, setMember] = useState();
  const [chatName, setChatName] = useState();
  const [memberList, setMemberList] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);

  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getAllChat()).then(() => {});
  }, []);

  useEffect(() => {
    if (chatId != "") {
      selectedChatCompare = chatId;
      socket.emit("join chat", chatId);
    }
  }, [chatId]);

  useEffect(() => {
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const accessChat = async () => {
    dispatch(fetchChat(userId)).then(() => {
      dispatch(getAllChat()).then(() => {
        dispatch(clearSearch());
        const id = chatData?.findIndex((chat) => {
          const userIndex = chat.users.findIndex((user) => user._id === userId);
          return userIndex !== -1;
        });
        console.log(id);
        setActiveState(id);
        setUserId("");
        setSearch("");
      });
    });
    setUserId("");
  };

  useEffect(() => {
    if (userId !== "") {
      accessChat();
    }
  }, [userId]);

  function receiveMessage() {
    if (socket) {
      socket.on("message received", (newMessageReceived) => {
        console.log("enter");
        console.log(selectedChatCompare != newMessageReceived?.chat?._id);
        if (
          !selectedChatCompare ||
          selectedChatCompare != newMessageReceived?.chat?._id
        ) {
          setNotification((prevNotification) => [
            ...prevNotification,
            newMessageReceived,
          ]);
          console.log(notification);
        } else {
          console.log("data");
          dispatch(addMessageData(newMessageReceived));
        }
      });
    }
  }
  useEffect(() => {
    receiveMessage();
  }, []);

  useEffect(() => {
    if (isMessage && isSuccess == false) {
      toast.error(isMessage);
    }
  }, [isMessage, chatData, dispatch]);

  useEffect(() => {
    if (search == "") {
      dispatch(clearSearch());
    } else {
      dispatch(searchUser(search));
    }
  }, [search]);

  const handleNotification = () => {
    const notify = document.getElementById("toast-message-cta");
    if (notification.length != 0) notify.classList.toggle("notification");
  };

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

  const updateSubmit = async (e) => {
    e.preventDefault();
    const data = {
      chatId: chatId,
      chatName: chatName,
      users: memberList,
    };
    dispatch(updateGroupChat(data)).then((state) => {
      dispatch(getAllChat()).then(() => {
        dispatch(fetchChatById(state.payload.data._id)).then(() => {
          dispatch(getAllMessage(state.payload.data._id));
          setMember("");
          setChatId(state.payload.data._id);
        });
      });
      setOpen(false);
    });
  };

  const theme = useContext(themeContext);
  useEffect(() => {
    if (member == "") {
      dispatch(clearSearch());
    } else {
      dispatch(searchUser(member));
    }
  }, [member]);
  return (
    <>
      <div className="w-full flex relative">
        <div
          className={`w-1/4 border-r border-white/50 transition-all duration-500 ${
            theme.theme ? " bg-[#f5f7fb]" : " bg-slate-800"
          } h-full`}
        >
          <div className="flex justify-between p-4">
            <p
              className={`font-semibold text-2xl font-public-sans ${
                !theme.theme ? " text-white" : " text-[#495057]"
              }`}
            >
              Chats
            </p>
            <div className="relative">
              <img
                width="25"
                height="20"
                src="https://img.icons8.com/ios-filled/25/3d3d3d/appointment-reminders--v1.png"
                alt="appointment-reminders--v1"
                className={`h-6 brightness-0 ${
                  !theme.theme ? " invert" : " invert-[30%]"
                } relative cursor-pointer`}
                onClick={handleNotification}
              />
              {notification.length != 0 ? (
                <div className="px-1 bg-teal-500 rounded-full text-center text-white text-xs absolute -top-2 -end-1.5 border-2 border-slate-800">
                  {notification.length}
                  <div className="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-teal-200 w-full h-full"></div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="relative block my-3">
            <input
              type="text"
              className="bg-grey/20 h-9 font-noto-sans  w-[85%] focus:outline-none block mx-auto pl-10 rounded-lg px-4 placeholder:text-gray-400 placeholder:font-normal text-sm text-white"
              placeholder="Search User"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <IoMdSearch
              size={20}
              className="absolute top-2 text-gray-600 left-[10%]"
            />
          </div>
          <p className="font-semibold text-base font-public-sans text-gray-300 px-5 my-2">
            Recent
          </p>{" "}
          <div className="my-2">
            {search != "" && searchData != null ? (
              <div>
                {searchData?.map((x, index) => (
                  <div
                    className={`flex items-center my-2 ml-2 hover:bg-slate-600 cursor-pointer ${
                      activeState === index ? "bg-gray-600" : ""
                    } p-2 rounded-l-lg`}
                    key={index}
                    onClick={() => {
                      setActiveState(index);
                      setUserId(x._id);
                    }}
                  >
                    <img
                      src={x.profilePic}
                      alt=""
                      className="w-11 mx-2 rounded-full object-cover"
                    />
                    <div className="flex w-[75%] justify-between items-center">
                      <div>
                        <p
                          className={`font-medium tracking-wide text-base font-public-sans ${
                            !theme.theme ? " text-white" : " text-[#495057]"
                          }  px-1 rounded-full mt-2`}
                        >
                          {x.name}
                        </p>{" "}
                        <p
                          className={`text-xs ${
                            !theme.theme ? " text-gray-400" : " text-[#495057]"
                          }  px-1 `}
                        >
                          {x.email}
                        </p>{" "}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ChatPerson
                activeState={activeState}
                setActiveState={setActiveState}
                personList={chatData}
                setChatId={setChatId}
                chatLoading={chatLoading}
                authData={authData}
                theme={theme.theme}
              />
            )}
          </div>
        </div>

        {activeState === undefined ? (
          <div
            className={`flex flex-col flex-grow transition-colors duration-500  ${
              theme.theme ? " bg-white" : " bg-gray-800"
            } border-l ${
              theme.theme
                ? " border-white shadow shadow-slate-300"
                : " border-gray-500"
            } relative items-center justify-center`}
          >
            <img
              src={authData?.profilePic}
              alt=""
              className="rounded-full w-20 h-20 object-cover"
            />
            <h1
              className={`font-bold mt-3 text-lg mb-4 ${
                !theme.theme ? " text-white" : " text-black"
              }`}
            >
              {" "}
              Welcome, {authData?.name}
            </h1>
            <p
              className={` ${
                !theme.theme ? " text-white/75" : " text-gray-500"
              }`}
            >
              Please select a chat to start messaging
            </p>
          </div>
        ) : messageLoading == true ? (
          <div
            role="status"
            className={`flex-grow h-full transition-colors duration-500 ${
              theme.theme ? " bg-white" : " bg-gray-800"
            }`}
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 h-[inherit] text-gray-200 m-auto animate-spin dark:text-gray-600 fill-blue-600"
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
          <div className="flex flex-col flex-grow relative">
            <div
              className={`w-full flex justify-between py-4 z-10 items-center transition-colors duration-500 ${
                !theme.theme ? "bg-gray-800/95" : "bg-slate-100"
              }   border-l ${
                !theme.theme ? "shadow shadow-slate-700 " : " shadow-md "
              } `}
            >
              <div className="flex items-center">
                <img
                  src={
                    activeChatData?.users[0]?._id == authData?._id
                      ? activeChatData?.users[1]?.profilePic
                      : activeChatData?.users[0]?.profilePic
                  }
                  alt=""
                  className="w-10 h-10 my-auto ml-5 mr-2 rounded-full object-cover"
                />
                <p
                  className={`font-semibold tracking-wide text-base ${
                    !theme.theme ? " text-gray-200" : " text-black"
                  }  px-1 rounded-full `}
                >
                  {activeChatData?.isGroupChat == true
                    ? activeChatData?.chatName
                    : activeChatData?.users[0]?._id == authData?._id
                    ? activeChatData?.users[1]?.name
                    : activeChatData?.users[0]?.name}
                </p>{" "}
              </div>
              {activeChatData?.isGroupChat == true ? (
                <div
                  className={`${
                    !theme.theme ? " hover:bg-black" : " hover:bg-black/50"
                  }  w-9 h-9 rounded-full mx-4 cursor-pointer`}
                  onClick={() => {
                    setOpen(true);
                    setChatName(activeChatData?.chatName);
                    setMemberList(activeChatData?.users);
                  }}
                >
                  <MdModeEditOutline
                    size={15}
                    className={`${
                      theme.theme ? " text-black " : " text-white "
                    } w-fit h-full p-1.5`}
                  />
                </div>
              ) : (
                <div
                  className={`${
                    !theme.theme ? " hover:bg-black" : " hover:bg-black/50"
                  }  w-9 h-9 rounded-full mx-4`}
                >
                  <SlOptions
                    size={15}
                    className={`${
                      theme.theme ? " text-black " : " text-white "
                    } w-fit h-full p-1.5`}
                  />
                </div>
              )}
            </div>
            <ChatBox
              messageData={messageData}
              authData={authData}
              isTyping={isTyping}
              theme={theme.theme}
            />
            <SendMessage
              chatId={chatId}
              socket={socket}
              socketConnected={socketConnected}
              setTyping={setTyping}
              typing={typing}
              theme={theme.theme}
            />
          </div>
        )}
      </div>

      <div
        id="toast-message-cta"
        className={`w-full max-w-xs p-4 backdrop-blur-md  ${
          !theme.theme ? " bg-gray-950/25 " : " bg-white "
        } z-10  text-gray-400  shadow-xl h-fit absolute -right-4 top-2 rounded-lg opacity-0`}
        role="alert"
      >
        {notification.map((x, index) => (
          <div className="flex" key={index}>
            <img
              className="w-8 h-8 rounded-full object-cover"
              src={x?.sender?.profilePic}
              alt={x?.sender.name}
            />
            <div
              className={`ms-3 text-sm font-normal  ${
                theme.theme ? " text-gray-900 " : " text-white "
              }`}
            >
              <span className="mb-1 text-sm font-semibold  ">
                {x?.sender.name}
              </span>
              <div
                className={`mb-2 text-sm font-normal ${
                  theme.theme ? " text-gray-700 " : " text-slate-300 "
                }`}
              >
                {x?.content}
              </div>
              {/* <a
              href="#"
              className="inline-flex px-2.5 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            >
              Reply
            </a> */}
            </div>
            <button
              type="button"
              className={`ms-auto -mx-1.5 -my-1.5  justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg  inline-flex h-8 w-8 ${
                theme.theme ? " hover:bg-gray-400 " : " hover:bg-gray-100 "
              } `}
              data-dismiss-target="#toast-message-cta"
              aria-label="Close"
              onClick={() => {
                setNotification((prev) =>
                  prev.filter((_, ind) => ind !== index)
                );
                handleNotification();
              }}
            >
              <span className="sr-only">Close</span>
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
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
            onChange={(e) => {
              setMember(e.target.value);
            }}
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
                    src={x.profilePic}
                    alt=""
                    className="w-11 h-11 mr-4 rounded-full object-cover"
                  />
                  <div className="flex w-[75%] justify-between items-center">
                    <div>
                      <p className="font-medium tracking-wide text-base font-public-sans text-black px-1 rounded-full mT-2">
                        {x.name}
                      </p>{" "}
                      <p className="text-xs  text-gray-700 px-1 ">{x.email}</p>{" "}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
          <button
            onClick={updateSubmit}
            className="px-5 py-2 bg-gray-700 text-white rounded-lg"
          >
            Submit
          </button>
        </div>
      </Dailog>
    </>
  );
};

const SendMessage = (props) => {
  const [content, setContent] = useState();
  const dispatch = useDispatch();

  const handleTyping = (e) => {
    setContent(e.target.value);

    if (!props.socketConnected) {
      return;
    }
    if (!props.typing) {
      props.setTyping(true);
      props.socket.emit("typing", selectedChatCompare);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && props.typing) {
        props.socket.emit("stop typing", selectedChatCompare);
        props.setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    console.log(content);
  }, [content]);

  const handleSubmit = () => {
    const formData = {
      content: content,
      chatId: props.chatId,
    };

    dispatch(sendMessage(formData)).then((state) => {
      props.socket.emit("stop typing", selectedChatCompare);
      props.socket.emit("new message", state.payload.data);
      // dispatch(getAllMessage(props.chatId));
      dispatch(addMessageData(state.payload.data));

      setContent("");
    });
  };
  return (
    <div
      className={`shadow-lg  ${
        !props.theme ? " bg-slate-700 " : " bg-white "
      } px-4 pb-5 pt-2 transition-colors duration-500`}
    >
      <div className="flex items-center">
        <input
          className="w-full border h-11 font-public-sans text-sm bg-slate-200  focus:outline-none rounded-md py-2 px-4 mr-2"
          type="text"
          placeholder="Type your message..."
          name="sendMsg"
          value={content}
         onChange={handleTyping}
onKeyDown={(e) => {
            if (e.key == "Enter") {
              handleSubmit(e);
            }
          }}        />
        <button
          onClick={handleSubmit}
          className="bg-voilet hover:bg-violet-500 text-white font-medium py-2 px-4 rounded-full"
        >
          <IoSendSharp />
        </button>
      </div>
    </div>
  );
};
const ChatPerson = (props) => {
  const dispatch = useDispatch();
  return (
    <div>
      {Array.isArray(props.personList) ? (
        props.personList.length == 0 ? (
          <div
            className={`${
              !props.theme ? "text-gray-300 " : " text-gray-800"
            } text-center text-sm font-medium `}
          >
            Create New chat By searching
          </div>
        ) : (
          props.personList?.map((x, index) => (
            <div
              className={`flex items-center my-2 ml-2 ${
                !props.theme ? " hover:bg-slate-600" : " hover:bg-slate-300"
              } cursor-pointer ${
                props.activeState === index
                  ? !props.theme
                    ? "bg-gray-600"
                    : " bg-gray-300"
                  : ""
              } p-2 rounded-l-lg transition-colors duration-500`}
              key={index}
              onClick={() => {
                props.setActiveState(index);
                dispatch(clearMessage());
                dispatch(fetchChatById(x._id)).then(() => {
                  dispatch(getAllMessage(x._id));
                  props.setChatId(x._id);
                });
              }}
            >
              <img
                src={
                  x?.isGroupChat
                    ? "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    : x?.users[0]?._id == props.authData?._id
                    ? x?.users[1]?.profilePic
                    : x?.users[0]?.profilePic
                }
                alt=""
                className="w-11 h-11 mx-2 rounded-full object-cover"
              />
              <div className="flex w-[75%] justify-between items-center">
                <div>
                  <p
                    className={`font-medium tracking-wide text-base font-public-sans ${
                      props.theme ? " text-[#495057]" : " text-gray-300"
                    }  px-1 rounded-full mt-2`}
                  >
                    {x?.isGroupChat
                      ? x?.chatName
                      : x?.users[0]._id == props.authData?._id
                      ? x?.users[1]?.name
                      : x?.users[0]?.name}
                  </p>{" "}
                  <p
                    className={`text-xs ${
                      props.theme ? " text-[#7a7f9a]" : " text-gray-400"
                    }  px-1 `}
                  >
                    {x?.latestMessage?.content ?? "Start your chat"}
                  </p>{" "}
                </div>
                <p
                  className={`font-noto-sans ${
                    props.theme ? " text-black" : " text-gray-300"
                  }  text-sm`}
                >
                  {moment(x?.latestMessage?.updatedAt).format("h:mm a")}
                </p>
              </div>
            </div>
          ))
        )
      ) : props.chatLoading == true ? (
        <div role="status" className="max-w-max m-auto bg-white">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
        <div></div>
      )}
    </div>
  );
};

const ChatBox = (props) => {
  return (
    <div
      className={`py-10 overflow-y-auto relative ${
        !props.theme ? " bg-gray-700 " : " bg-white "
      }  flex gap-2 flex-grow flex-col px-12 justify-start transition-colors duration-500`}
    >
      {props.messageData?.map((x, index) => (
        <div
          className={`flex  ${
            x?.sender?._id === props.authData?._id
              ? "flex-row "
              : "flex-row-reverse self-end"
          } justify-start gap-3 `}
          key={index}
        >
          <img
            src={x?.sender.profilePic}
            className="w-8 h-8 rounded-full mt-[2px] object-cover"
            alt=""
          />
          <div
            className={` rounded-lg  my-1 p-2 text-sm  flex flex-col relative   ${
              x?.sender._id == props.authData?._id
                ? " speech-bubble-left  rounded-tl-none bg-white  shadow-md shadow-black/20"
                : " speech-bubble-right rounded-tr-none bg-green-300 shadow-md"
            }`}
          >
            <p className="break-words max-w-md">{x?.content}</p>
            <p className="text-gray-600 text-xs text-right leading-none">
              {moment(x.updatedAt).format("h:mm a")}
            </p>
          </div>
        </div>
      ))}
      {props.isTyping ? (
        <div className={`flex flex-row-reverse justify-start gap-3 `}>
          <img
            src={
              "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
            }
            className="w-8 h-8 rounded-full mt-[2px]"
            alt=""
          />
          <div
            className={` rounded-lg  my-1 p-2 text-sm  flex flex-col relative  speech-bubble-right rounded-tr-none bg-green-300`}
          >
            <div className="flex gap-1">
              <span className="sr-only">Loading...</span>
              <div className="h-3 w-3 bg-slate-800 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-3 w-3 bg-slate-900 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-3 w-3 bg-slate-950 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Chat;
