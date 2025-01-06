import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Send,
  Paperclip,
  DollarSign,
  XCircle,
  Share2,
  Flag,
  Navigation,
  ThumbsUp,
  MoreVertical,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSelector } from "react-redux";
import '../styles/starttask.css'

const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.Deployed_link;

const GamifiedTaskPopup = ({ task, isOpen, onClose }) => {
  const userName = useSelector((state) => state.userState.userName);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [render , setRender] = useState(false)
  const [report , setReport] = useState({})

  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken");

    if (task) {

      //  mit prajapati (development and production link support)
      const API_BASE_URL =
        process.env.NODE_ENV === "development"
          ? "http://localhost:5000"
          : process.env.Deployed_link;

      fetch(`${API_BASE_URL}/api/get_answers?question_id=${task.question_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Answers fetched successfully!") {
            setChatHistory({ "answers": data.answers, "question_id": task.question_id });
            data.answers.map(ans => console.log(ans))
          } else {
            alert(data.message);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    return () => {
      setChatMessage("")
      setUploadedFiles([])
    }
  }, [task , render]);

  const sendReport = ( report_reason , target_type,target_id = task.question_id) => {
    const token = sessionStorage.getItem('jwtToken');
  const confirmed = window.confirm(`Are you sure you want to report this as ${report_reason.replace("_" , " ").toUpperCase()}?`);
  if (!confirmed) {
    setReport({});
    return;
  }

  const reportData = {
    target_type,
    target_id,
    report_reason,
  };

  fetch(`http://localhost:5000/api/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reportData),
  })
    .then((response) => {
      console.log("Raw response:", response); // Log the raw response
      setRender(prev => !prev)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data);
      alert(data.message)
      setRender(prev => !prev)
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

    const handleSendMessage = () => {
      const token = sessionStorage.getItem("jwtToken");

      if (chatMessage.trim() || uploadedFiles.length !==0) {
        // Create FormData object
        const formData = new FormData();

    formData.append("question_id", task.question_id);
    chatMessage.trim() && formData.append("answer_text", chatMessage);

    // Assuming uploadedFiles is an array of file objects
    uploadedFiles.length !==0 &&
    uploadedFiles.forEach((file) => {
      formData.append("uploadedFiles", file); // Append each file
    });

    // Debugging: Log all form data keys and values
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Send the FormData via fetch
    fetch(`${API_BASE_URL}/api/post_answer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Include the Authorization header
      },
      body: formData, // Send FormData directly without stringifying
    })
      .then((response) => {response.json()
        response && setRender(prev => !prev)
      })
      .then((data) => {
        console.log("Response:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
             });
      }
    };

  const handleShare = () => {
    if (task.share_url) {
      navigator.clipboard.writeText(task.share_url).then(() => {
        alert("Share URL copied to clipboard!");
      }).catch(err => {
        console.error("Failed to copy: ", err);
      });
    } else {
      alert("Share URL is not available yet.");
    }
  };
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };
  const handleLike = (answer_id, index) => {
    fetch(`${API_BASE_URL}/api/like_answer/${answer_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_name: userName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Answer liked successfully!") {
          const updatedHistory = [...chatHistory.answers];
          // Increment the likes count for the answer at the given index
          // and add the current user's name to the list of users who have liked it
          updatedHistory[index] = {
            ...updatedHistory[index],
            likes: [...updatedHistory[index].likes, userName],
          };
          setChatHistory({ "answers": updatedHistory, "question_id": task.question_id });
        } else {
          alert(data.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.3)] overflow-hidden relative"
            style={{
              boxShadow: "0 10px 0 #2563EB, 0 20px 0 #1E40AF",
              border: "8px solid #3B82F6",
            }}
            initial={{ scale: 0.8, y: 50, rotateX: 20 }}
            animate={{ scale: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.8, y: 50, rotateX: 20 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 border-b-8 border-blue-700 relative">
              <div
                className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-20 z-0"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                }}
              ></div>
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-300 filter drop-shadow-lg" />
                  <h2
                    className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider filter drop-shadow-lg"
                    style={{ textShadow: "2px 2px 0 #2563EB" }}
                  >
                    {task.title}
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:text-yellow-300 transition-colors duration-200"
                >
                  <XCircle className="w-6 h-6 md:w-8 md:h-8" />
                </Button>
              </div>
              <div className="flex items-center space-x-3 mt-2 relative z-10">
                <div className="flex items-center text-xs md:text-sm text-white bg-blue-700 px-2 py-1 rounded-full shadow-inner">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span>{task.location}</span>
                </div>
                <Navigation
                  className="w-4 h-4 md:w-6 md:h-6 text-yellow-300 filter drop-shadow-lg"
                  onClick={() => window.open(task.navigation_url, "_blank")}

                />
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 bg-gradient-to-b from-blue-100 to-white">
              {/* User Info */}
              <div
                className="flex justify-between items-center bg-white p-3 rounded-2xl border-4 border-blue-500 shadow-lg transform hover:scale-105 transition-transform duration-200"
                style={{ boxShadow: "0 6px 0 #3B82F6" }}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 md:w-16 md:h-16 border-4 border-yellow-400 shadow-xl">
                    <AvatarImage alt={task.full_name} />
                    <AvatarFallback>{task.full_name}</AvatarFallback>
                  </Avatar>
                  <div className="text-xs md:text-sm">
                    <h3
                      className="font-extrabold text-blue-700 text-lg md:text-xl"
                      style={{ textShadow: "1px 1px 0 #60A5FA" }}
                    >
                      {task.full_name}
                    </h3>
                    <div className="text-sm md:text-base flex items-center bg-yellow-400 px-2 py-1 rounded-full mt-1 shadow-md">
                      <Zap className="w-4 h-4 md:w-5 md:h-5 text-blue-700 mr-1" />
                      Level 1
                    </div>
                  </div>
                </div>
                <div
                  className="flex items-center space-x-1 text-sm md:text-base bg-green-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-bold shadow-lg"
                  style={{ boxShadow: "0 4px 0 #059669" }}
                >
                  <DollarSign className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{task.stakeAmount}</span>
                </div>
              </div>

              {/* Task Description */}
              <motion.div
                className="bg-white p-3 rounded-2xl text-sm border-4 border-blue-500 shadow-lg overflow-hidden cursor-pointer"
                style={{ boxShadow: "0 6px 0 #3B82F6" }}
                animate={{ height: isDescriptionExpanded ? "auto" : "5rem" }}
                transition={{ duration: 0.3 }}
                onClick={toggleDescription}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4
                    className="font-bold text-blue-700 text-lg"
                    style={{ textShadow: "1px 1px 0 #60A5FA" }}
                  >
                    Task Description
                  </h4>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-500 hover:text-green-700 transition-colors duration-200"
                    >
                      <Share2 className="w-5 h-5"
                        onClick={handleShare} />
                    </Button>

                    <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                            <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 transition-colors duration-200 report"
                    >
                      <Flag className="w-5 h-5" />
                    </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="menuu">
                                <DropdownMenuItem className="item" onClick={() => sendReport("inappropriate_language" , "Question")}>
                                  Inappropriate Language
                                </DropdownMenuItem>
                                <DropdownMenuItem className="item" onClick={() => sendReport("irrelevant_content", "Question")}>
                                  Irrelevant Content
                                </DropdownMenuItem>
                                <DropdownMenuItem className="item" onClick={() => sendReport("scam", "Question")}>
                                  Scam
                                </DropdownMenuItem>
                                <DropdownMenuItem className="item" onClick={() => sendReport("insufficient_detail", "Question")}>
                                  Insufficient Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem className="item" onClick={() => sendReport("incorrect_information", "Question")}>
                                  Incorrect Information
                                </DropdownMenuItem>
                                <DropdownMenuItem className="item" onClick={() => sendReport("other", "Question")}>
                                  Other
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                  </div>
                </div>
                <p className="text-gray-700">{task.description}</p>
              </motion.div>

              {/* Quest Chat - Expanded */}
              <div
                className="bg-white p-4 rounded-2xl border-4 border-blue-500 shadow-lg flex-grow"
                style={{
                  boxShadow: "0 6px 0 #3B82F6",
                  maxHeight: "calc(100vh - 450px)",
                  minHeight: "250px",
                }}
              >
                <h4
                  className="font-bold text-blue-700 text-lg mb-3"
                  style={{ textShadow: "1px 1px 0 #60A5FA" }}
                >
                  Quest Chat
                </h4>
                <div
                  className="overflow-y-auto mb-3 p-3 bg-blue-50 rounded-xl border-2 border-blue-200"
                  style={{
                    height: "calc(100% - 4rem)",
                    overflowY: "scroll",
                    maxHeight: "180px",
                  }}
                >
                  {chatHistory !== null && chatHistory.question_id === task.question_id && chatHistory.answers
                    .map((chat, index) => (
                      <motion.div
                        key={index}
                        className="text-xs md:text-sm mb-3 flex justify-between items-center bg-white p-3 rounded-xl shadow-md border-2 border-blue-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div style={{ width: "350px" }}>
  <span className="font-semibold text-blue-700">
    {chat.sender}:{" "}
  </span>
  <br />
  <p
    style={{
      width: "100%",
      overflowX: "hidden",
      wordWrap: "break-word", // Ensures long words break into the next line
      whiteSpace: "normal",  // Allows text to wrap normally
    }}
    className="text-gray-700"
  >
    {chat.message}
  </p>

  <div style={{ marginTop: "10px" }}>
  {chat.uploaded_files?.map((file, index) => {
    const fileSrc = `${API_BASE_URL}${file.url}`; // Construct the full URL for the file
    const fileName = file.filename; // Extract the filename directly from the object

    return (
      fileName.endsWith(".jpg") || fileName.endsWith(".png") ? (
        <a
          style={{ width: "100% !important" , cursor:'pointer'}}
          key={index}
         href={fileSrc}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={fileSrc}
            alt={fileName}
          style={{ width: "auto", margin: "5px 0" }}
          />
        </a>
      ) : fileName.endsWith(".pdf") ? (
        <embed
          key={index}
          src={fileSrc}
          type="application/pdf"
          style={{ width: "100%", height: "500px", margin: "5px 0" }}
        />
      ) : fileName.endsWith(".mp4") || fileName.endsWith(".webm") || fileName.endsWith(".ogg") || fileName.endsWith(".mkv") ? (
        <video
          key={index}
          src={fileSrc}
          controls
          style={{ width: "100%", height: "auto", margin: "5px 0" }}
        >
          Your browser does not support the video tag.
        </video>
      ) : fileName.endsWith(".xls") || fileName.endsWith(".xlsx") ? (
        <a
          key={index}
          href={fileSrc}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", margin: "5px 0", color: "green" }}
        >
          {fileName} {/* Display the filename */}
        </a>
      ) : (
        <a
          key={index}
          href={fileSrc}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "block", margin: "5px 0", color: "blue" }}
        >
          {fileName} {/* Display the filename */}
        </a>
      )
    );
  })}
</div>
</div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleLike(chat.answer_id, index)}
                            className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                            disabled={chat.likes.includes(userName)}
                          >
                            <ThumbsUp className="w-4 h-4 md:w-5 md:h-5" />
                            {chat.likes.length > 0 && (
                              <span className="ml-1 text-xs">{chat.likes.length}</span>
                            )}
                          </Button>
                          <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                              >
                                <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="menuu">
                              <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                            <DropdownMenuItem className="item">Report message</DropdownMenuItem>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="menuu">
                            <DropdownMenuItem className="item" onClick={() => sendReport("inappropriate_language" , "Answer",chat.answer_id)}>
                                  Inappropriate Language
                                </DropdownMenuItem>
                                <DropdownMenuItem className="item" onClick={() => sendReport("irrelevant_content", "Answer",chat.answer_id)}>
                                  Irrelevant Content
                                </DropdownMenuItem>
                                <DropdownMenuItem className="item" onClick={() => sendReport("scam", "Answer",chat.answer_id)}>
                                  Scam
                                </DropdownMenuItem>
                                <DropdownMenuItem className="item" onClick={() => sendReport("insufficient_detail", "Answer",chat.answer_id)}>
                                  Insufficient Detail
                                </DropdownMenuItem>
                                <DropdownMenuItem className="item" onClick={() => sendReport("incorrect_information", "Answer",chat.answer_id)}>
                                  Incorrect Information
                                </DropdownMenuItem>
                                <DropdownMenuItem className="item" onClick={() => sendReport("other", "Answer",chat.answer_id)}>
                                  Other
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                              <DropdownMenuItem className="item">Copy text</DropdownMenuItem>
                              <DropdownMenuItem className="item">Pin message</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}
                  {chatHistory !== null && chatHistory.answers.length === 0 && (
                    <div className="text-xs md:text-sm text-gray-500 italic text-center p-4 bg-blue-100 rounded-xl border-2 border-blue-200">
                      Start your quest by sending a message!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-3 md:p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-b-3xl border-t-8 border-blue-700 relative">
              <div
                className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-20 z-0"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                  /******  93388eab-c8ad-4299-ac49-83f3befb201a  *******/
                }}
              ></div>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className=" cursor-pointer relative z-10 "
              >
              <p className="absolute z-20 w-6 h-6 bottom-[65%] right-0 bg-red-500 text-white p-1 rounded-full shadow-md text-xs md:text-sm flex align-middle justify-center font-extrabold">
                {uploadedFiles.length}
              </p>
                <Paperclip
                  className="w-6 h-6 md:w-8 md:h-8 text-white hover:text-yellow-300 transition-colors duration-200"
                  style={{ filter: "drop-shadow(2px 2px 0 #2563EB)" }}
                />
              </label>
              <div className="flex-grow mx-2 md:mx-3 relative z-10">
                <Input
                  type="text"
                  placeholder="Type your quest message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full text-xs md:text-sm rounded-full border-4 border-white bg-blue-100 text-blue-900 placeholder-blue-400 focus:ring-2 focus:ring-yellow-300 focus:border-white"
                  style={{ boxShadow: "0 4px 0 #2563EB" }}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                className="relative z-10 text-xs md:text-sm p-2 md:p-3 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-full transform hover:scale-105 transition-all duration-200"
                style={{ boxShadow: "0 4px 0 #D97706" }}
              >
                <Send className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GamifiedTaskPopup;
