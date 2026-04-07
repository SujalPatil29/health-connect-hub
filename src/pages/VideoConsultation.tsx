import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mic, MicOff, Video, VideoOff, Phone, MessageSquare,
  Clock, Send, X, User, Copy, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { usePeerConnection } from "@/hooks/usePeerConnection";
import VideoPlayer from "@/components/VideoPlayer";

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
  const [copied, setCopied] = useState(false);
  const [joinId, setJoinId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "System",
      text: "Share your Room ID with the other participant to connect.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [elapsed, setElapsed] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Generate a unique peer ID based on user + appointment
  const myPeerId = `medibook-${user?.id}-${appointmentId}`.replace(/[^a-zA-Z0-9-]/g, "");

  const {
    localStream, remoteStream, connected, peerReady, error,
    startLocalStream, callPeer, toggleAudio, toggleVideo, endCall: peerEndCall,
  } = usePeerConnection({ peerId: myPeerId });

  // Start local stream on mount
  useEffect(() => {
    startLocalStream();
  }, [startLocalStream]);

  // Timer
  useEffect(() => {
    if (!connected) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [connected]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(myPeerId);
    setCopied(true);
    toast.success("Room ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const connectToRemote = () => {
    if (!joinId.trim()) {
      toast.error("Enter the other participant's Room ID");
      return;
    }
    callPeer(joinId.trim());
    toast.info("Connecting...");
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

  const handleEndCall = () => {
    peerEndCall();
    toast.success("Call ended");
    navigate("/dashboard");
  };

  const handleToggleMic = () => {
    const next = !micOn;
    setMicOn(next);
    toggleAudio(next);
  };

  const handleToggleCam = () => {
    const next = !camOn;
    setCamOn(next);
    toggleVideo(next);
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
              <p className="text-xs text-background/50">{appointment.doctorSpecialization}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {connected && (
            <span className="flex items-center gap-1.5 rounded-full bg-destructive/20 px-3 py-1 text-xs font-medium text-destructive">
              <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
              LIVE
            </span>
          )}
          {connected && (
            <span className="flex items-center gap-1 text-xs text-background/60">
              <Clock className="h-3 w-3" /> {formatTime(elapsed)}
            </span>
          )}
          {!connected && peerReady && (
            <span className="text-xs text-background/40">Waiting to connect...</span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="relative flex flex-1 items-center justify-center">
            {/* Remote Video or Connection Panel */}
            {connected && remoteStream ? (
              <VideoPlayer
                stream={remoteStream}
                className="h-full w-full"
                label={otherParty}
              />
            ) : (
              <div className="flex flex-col items-center gap-5 rounded-2xl bg-foreground/80 p-8">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/20">
                  <User className="h-10 w-10 text-background/30" />
                </div>
                <p className="text-lg font-medium text-background/70">Connect with {otherParty}</p>

                {/* Room ID sharing */}
                <div className="flex flex-col items-center gap-3 w-full max-w-sm">
                  <p className="text-xs text-background/50">Your Room ID:</p>
                  <div className="flex items-center gap-2 w-full">
                    <code className="flex-1 rounded bg-background/10 px-3 py-2 text-xs text-background/80 truncate">
                      {myPeerId}
                    </code>
                    <Button size="icon" variant="outline" onClick={copyRoomId}
                      className="h-9 w-9 border-background/20 bg-background/10 text-background hover:bg-background/20">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 w-full mt-2">
                    <p className="text-xs text-background/50 whitespace-nowrap">Other's Room ID:</p>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      placeholder="Paste the other participant's Room ID"
                      value={joinId}
                      onChange={(e) => setJoinId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && connectToRemote()}
                      className="bg-background/10 border-background/20 text-background placeholder:text-background/30 text-sm"
                    />
                    <Button onClick={connectToRemote} size="sm" disabled={!joinId.trim()}>
                      Join
                    </Button>
                  </div>
                  <p className="text-xs text-background/40 text-center mt-2">
                    Share your Room ID with the other person and paste theirs above to connect.
                  </p>
                </div>
              </div>
            )}

            {/* Self View */}
            {localStream && (
              <VideoPlayer
                stream={localStream}
                muted
                className="absolute bottom-4 right-4 h-32 w-44 border border-background/10 shadow-lg"
                label="You"
              />
            )}
            {!localStream && (
              <div className="absolute bottom-4 right-4 flex h-32 w-44 items-center justify-center rounded-xl bg-foreground/80 border border-background/10 shadow-lg">
                <div className="flex flex-col items-center gap-1">
                  <VideoOff className="h-6 w-6 text-background/40" />
                  <span className="text-xs text-background/40">No camera</span>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 border-t border-foreground/10 py-4">
            <Button variant="outline" size="icon"
              className={`h-12 w-12 rounded-full border-background/20 ${
                micOn ? "bg-background/10 text-background hover:bg-background/20"
                  : "bg-destructive/20 text-destructive hover:bg-destructive/30"
              }`}
              onClick={handleToggleMic}>
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>

            <Button variant="outline" size="icon"
              className={`h-12 w-12 rounded-full border-background/20 ${
                camOn ? "bg-background/10 text-background hover:bg-background/20"
                  : "bg-destructive/20 text-destructive hover:bg-destructive/30"
              }`}
              onClick={handleToggleCam}>
              {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>

            <Button variant="outline" size="icon"
              className={`h-12 w-12 rounded-full border-background/20 ${
                chatOpen ? "bg-primary/30 text-primary hover:bg-primary/40"
                  : "bg-background/10 text-background hover:bg-background/20"
              }`}
              onClick={() => setChatOpen(!chatOpen)}>
              <MessageSquare className="h-5 w-5" />
            </Button>

            <Button variant="destructive" size="icon" className="h-14 w-14 rounded-full" onClick={handleEndCall}>
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
                <div key={msg.id}
                  className={`rounded-lg p-2.5 text-sm ${
                    msg.sender === (user?.name || "You")
                      ? "ml-6 bg-primary/20 text-background"
                      : "mr-6 bg-background/10 text-background/80"
                  }`}>
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
                <Input placeholder="Type a message..." value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/30" />
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
