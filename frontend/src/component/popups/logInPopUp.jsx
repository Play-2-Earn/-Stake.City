import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./popups_component/button";
import { Input } from "./popups_component/input";
import { Label } from "./popups_component/label";
import { X, UserPlus, Key, Mail, Calendar, Phone, User } from "lucide-react";
import { useParams } from "react-router-dom";

const LogInPopUp = ({ isOpen, onClose, NewToGame, forgetPassOpen, onLoginSuccess }) => {
    if (!isOpen) return null;
    const {q_id} = useParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(null);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);

                throw new Error(errorData.message || "Failed to login");
            }

            const data = await response.json();
            console.log("Login successful:", data);

            sessionStorage.setItem("jwtToken", data.token);
            onLoginSuccess();
            onClose();
            if (q_id) {
                console.log(`Received q_id: ${q_id}`);
                window.location.href = `/explore/${String(q_id)}`;
            }
            // window.location.href = "/dashboard";
        } catch (err) {
            setLoading(false);
            alert(err.message);

        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="w-full max-w-sm bg-gray-900 rounded-3xl shadow-[0_0_30px_rgba(0,255,255,0.3)] overflow-hidden relative"
                    style={{
                        boxShadow:
                            "0 10px 0 #94a3b8, 0 20px 0 #20C997, 0 0 20px rgba(0,255,255,0.5)",
                        border: "2px solid #20C997",
                    }}
                    initial={{ scale: 0.8, y: 50, rotateX: 20 }}
                    animate={{ scale: 1, y: 0, rotateX: 0 }}
                    exit={{ scale: 0.8, y: 50, rotateX: 20 }}
                    transition={{ type: "spring", damping: 15, stiffness: 100 }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-teal-400 text-white p-4 relative">
                        <div
                            className="absolute top-0 left-0 w-full h-full opacity-20"
                            style={{
                                backgroundImage:
                                    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.343 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.415L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%23ffffff' fill-opacity='0.15' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                            }}
                        ></div>
                        <div className="flex justify-between items-center relative z-10">
                            <h2
                                className="text-2xl font-extrabold uppercase tracking-wider"
                                style={{ textShadow: "2px 2px 0 #0077BE, -2px -2px 0 #FF00FF" }}
                            >
                                Player Login
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-white hover:text-yellow-300 transition-colors duration-200"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                    <form onSubmit={handleLogin}>
                    <div className="p-4 space-y-3 bg-gradient-to-b from-gray-800 to-gray-900">
                        <InputField
                            id="loginUsername"
                            label="Email ID"
                            icon={<User />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="cosmic_chris_42 or chris@cosmos.com"
                        />
                        <InputField
                            id="loginPassword"
                            label="Password"
                            icon={<Key />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="••••••••"
                        />
                        <div className="text-right">
                            <Button
                                variant="link"
                                className="text-sm text-cyan-400 hover:text-cyan-300"
                                onClick={forgetPassOpen}
                            >
                                Lost your password?
                            </Button>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-slate-900 to-teal-400 hover:from-teal-400 hover:to-teal-400 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105 hover:rotate-1 hover:shadow-neon">
                            {loading ? "Logging In..." : "Enter to Stake City"}
                            
                        </Button>
                    </div>
                    </form>

                    {/* Footer */}
                    <div className="p-4 bg-gradient-to-r from-slate-900 to-teal-400 text-white text-center">
                        <p className="text-sm">
                            New to the stake city?
                            <Button
                                variant="link"
                                className="text-blue-200 hover:text-blue-200 ml-1"
                                onClick={NewToGame}
                            >
                                Sign Up
                            </Button>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const InputField = ({ id, label, icon, ...props }) => (
    <div className="space-y-1">
        <Label htmlFor={id} className="text-slate-100 text-sm">
            {label}
        </Label>
        <div className="relative">
            <Input
                id={id}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 rounded-full"
                {...props}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-100">
                {icon}
            </div>
        </div>
    </div>
);

export default LogInPopUp;