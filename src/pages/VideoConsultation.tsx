import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MessageSquare,
  Maximize,
  Clock,
  Send,
  X,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

const VideoConsultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user, appointments } = useAuth();

  const appointment = appointments.find((a) => a.id === appointmentId);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "System",
      text: "Video consultation started. You can chat here during the call.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [elapsed, setElapsed] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: user?.name || "You",
        text: message,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setMessage("");
  };

  const endCall = () => {
    toast.success("Call ended");
    navigate("/dashboard");
  };

  const otherParty = user?.role === "DOCTOR"
    ? appointment?.patientName || "Patient"
    : appointment?.doctorName || "Doctor";

  return (
    <div className="flex h-screen flex-col bg-foreground/95">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Video className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-background">
              Consultation with {otherParty}
            </h2>
            {appointment && (
              <p className="text-xs text-background/50">
                {appointment.doctorSpecialization}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-destructive/20 px-3 py-1 text-xs font-medium text-destructive">
            <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
            LIVE
          </span>
          <span className="flex items-center gap-1 text-xs text-background/60">
            <Clock className="h-3 w-3" /> {formatTime(elapsed)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="flex flex-1 flex-col">
          <div className="relative flex flex-1 items-center justify-center">
            {/* Remote Video (placeholder) */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-muted/20">
                <User className="h-14 w-14 text-background/30" />
              </div>
              <p className="text-lg font-medium text-background/70">{otherParty}</p>
              {!camOn && (
                <p className="text-sm text-background/40">Camera is off</p>
              )}
            </div>

            {/* Self View */}
            <div className="absolute bottom-4 right-4 flex h-32 w-44 items-center justify-center rounded-xl bg-foreground/80 border border-background/10 shadow-lg">
              {camOn ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/30">
                    <User className="h-6 w-6 text-background/60" />
                  </div>
                  <span className="text-xs text-background/50">You</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <VideoOff className="h-6 w-6 text-background/40" />
                  <span className="text-xs text-background/40">Camera off</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 border-t border-foreground/10 py-4">
            <Button
              variant="outline"
              size="icon"
              className={`h-12 w-12 rounded-full border-background/20 ${
                micOn
                  ? "bg-background/10 text-background hover:bg-background/20"
                  : "bg-destructive/20 text-destructive hover:bg-destructive/30"
              }`}
              onClick={() => setMicOn(!micOn)}
            >
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`h-12 w-12 rounded-full border-background/20 ${
                camOn
                  ? "bg-background/10 text-background hover:bg-background/20"
                  : "bg-destructive/20 text-destructive hover:bg-destructive/30"
              }`}
              onClick={() => setCamOn(!camOn)}
            >
              {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`h-12 w-12 rounded-full border-background/20 ${
                chatOpen
                  ? "bg-primary/30 text-primary hover:bg-primary/40"
                  : "bg-background/10 text-background hover:bg-background/20"
              }`}
              onClick={() => setChatOpen(!chatOpen)}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={endCall}
            >
              <Phone className="h-6 w-6 rotate-[135deg]" />
            </Button>
          </div>
        </div>

        {/* Chat Sidebar */}
        {chatOpen && (
          <div className="flex w-80 flex-col border-l border-foreground/10 bg-foreground/90">
            <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-3">
              <h3 className="text-sm font-semibold text-background">Chat</h3>
              <button onClick={() => setChatOpen(false)} className="text-background/40 hover:text-background/70">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-lg p-2.5 text-sm ${
                    msg.sender === (user?.name || "You")
                      ? "ml-6 bg-primary/20 text-background"
                      : "mr-6 bg-background/10 text-background/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-background/60">{msg.sender}</span>
                    <span className="text-xs text-background/40">{msg.time}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-foreground/10 p-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/30"
                />
                <Button size="icon" onClick={sendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoConsultation;
