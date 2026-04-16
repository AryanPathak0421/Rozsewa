import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MapPin, IndianRupee, Clock, Check, X, ShieldAlert, Volume2 } from 'lucide-react';
import API from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';

const IncomingRequestModal = ({ request, onAction }) => {
    const { toast } = useToast();
    const { socket } = useSocket();
    const { user } = useAuth();
    const [timeLeft, setTimeLeft] = useState(120); // 2 mins countdown
    const [audioStarted, setAudioStarted] = useState(false);

    // Use backend's alert.mp3
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const audioRef = useRef(new Audio(`${API_URL}/sounds/alert.mp3`));

    const playSound = () => {
        audioRef.current.loop = true;
        audioRef.current.play().then(() => {
            setAudioStarted(true);
        }).catch(err => {
            console.log("Autoplay blocked:", err);
        });
    };

    useEffect(() => {
        playSound();
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);

        return () => {
            clearInterval(timer);
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        };
    }, []);

    const handleAccept = async () => {
        try {
            await API.patch(`/bookings/${request.bookingId}/status`, { status: 'confirmed' });
            toast({ title: "Booking Accepted!", variant: "default" });
            onAction('accepted');
        } catch (err) {
            toast({ title: "Failed to accept booking", variant: "destructive" });
        }
    };

    const handleReject = () => {
        if (socket && user) {
            socket.emit("reject_booking", {
                providerId: user._id,
                bookingId: request.bookingId
            });
        }
        audioRef.current.pause();
        sessionStorage.removeItem('activeRequest');
        onAction();
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="w-full max-w-sm bg-card border-2 border-emerald-500/30 rounded-[40px] p-6 shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden relative"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20">
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 120, ease: "linear" }}
                            className="h-full bg-emerald-500"
                        />
                    </div>

                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center relative">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="absolute inset-0 bg-emerald-500/20 rounded-full"
                            />
                            <Bell className="h-10 w-10 text-emerald-600 animate-bounce" />
                        </div>

                        {!audioStarted && (
                            <button
                                onClick={playSound}
                                className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black uppercase flex items-center gap-2 animate-pulse border border-amber-200"
                            >
                                <Volume2 className="h-3 w-3" /> Tap to Enable Sound
                            </button>
                        )}

                        <div className="space-y-1">
                            <h2 className="text-2xl font-black tracking-tight uppercase">New Request!</h2>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-2">
                                <Clock className="h-3 w-3" /> Expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </p>
                        </div>

                        <div className="w-full bg-muted/50 rounded-3xl p-5 space-y-4 text-left border border-border">
                            <div className="flex items-start gap-3">
                                <ShieldAlert className="h-5 w-5 text-emerald-600 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Service Requested</p>
                                    <p className="font-black text-lg text-foreground">{request.serviceName}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-emerald-600 mt-1" />
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Distance Estimate</p>
                                    <p className="font-bold text-sm text-foreground">{request.address}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-border">
                                <div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Estimated Earning</p>
                                    <div className="flex items-center text-xl font-black text-emerald-600 italic">
                                        <IndianRupee className="h-5 w-5" /> {request.amount}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Payment Mode</p>
                                    <p className={`font-bold text-xs ${request.paymentMode === 'now' ? 'text-blue-600' : 'text-amber-600'}`}>
                                        {request.paymentMode === 'now' ? 'Wait for Online Pay' : 'Pay After Job (COD)'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full pt-2">
                            <button
                                onClick={handleReject}
                                className="h-16 rounded-2xl border-2 border-border bg-background hover:bg-muted flex items-center justify-center gap-2 transition-all font-black uppercase text-xs tracking-widest text-muted-foreground group"
                            >
                                <X className="h-5 w-5 group-hover:scale-110 transition-transform" /> Reject
                            </button>
                            <button
                                onClick={handleAccept}
                                className="h-16 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 transition-all font-black uppercase text-xs tracking-widest group"
                            >
                                <Check className="h-5 w-5 group-hover:scale-110 transition-transform" /> Accept
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default IncomingRequestModal;
