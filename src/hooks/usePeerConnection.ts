import { useState, useEffect, useRef, useCallback } from "react";
import Peer, { MediaConnection } from "peerjs";

interface UsePeerConnectionOptions {
  peerId: string;
  remotePeerId?: string;
  onRemoteStream?: (stream: MediaStream) => void;
}

export const usePeerConnection = ({ peerId, remotePeerId, onRemoteStream }: UsePeerConnectionOptions) => {
  const [peer, setPeer] = useState<Peer | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connected, setConnected] = useState(false);
  const [peerReady, setPeerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const callRef = useRef<MediaConnection | null>(null);

  // Initialize peer
  useEffect(() => {
    const p = new Peer(peerId, {
      debug: 1,
    });

    p.on("open", () => {
      setPeerReady(true);
    });

    p.on("error", (err) => {
      console.error("Peer error:", err);
      if (err.type === "unavailable-id") {
        setError("This session is already in use. Try refreshing.");
      } else {
        setError(err.message);
      }
    });

    setPeer(p);

    return () => {
      p.destroy();
    };
  }, [peerId]);

  // Get local media
  const startLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("Media error:", err);
      setError("Could not access camera/microphone. Please allow permissions.");
      return null;
    }
  }, []);

  // Handle incoming calls
  useEffect(() => {
    if (!peer) return;

    const handleCall = async (call: MediaConnection) => {
      let stream = localStream;
      if (!stream) {
        stream = await startLocalStream();
      }
      if (stream) {
        call.answer(stream);
        callRef.current = call;

        call.on("stream", (remote) => {
          setRemoteStream(remote);
          setConnected(true);
          onRemoteStream?.(remote);
        });

        call.on("close", () => {
          setConnected(false);
          setRemoteStream(null);
        });
      }
    };

    peer.on("call", handleCall);
    return () => {
      peer.off("call", handleCall);
    };
  }, [peer, localStream, startLocalStream, onRemoteStream]);

  // Call remote peer
  const callPeer = useCallback(async (targetPeerId: string) => {
    if (!peer) return;

    let stream = localStream;
    if (!stream) {
      stream = await startLocalStream();
    }
    if (!stream) return;

    const call = peer.call(targetPeerId, stream);
    callRef.current = call;

    call.on("stream", (remote) => {
      setRemoteStream(remote);
      setConnected(true);
      onRemoteStream?.(remote);
    });

    call.on("close", () => {
      setConnected(false);
      setRemoteStream(null);
    });

    call.on("error", (err) => {
      console.error("Call error:", err);
      setError("Failed to connect call.");
    });
  }, [peer, localStream, startLocalStream, onRemoteStream]);

  // Toggle audio/video
  const toggleAudio = useCallback((enabled: boolean) => {
    localStream?.getAudioTracks().forEach((t) => (t.enabled = enabled));
  }, [localStream]);

  const toggleVideo = useCallback((enabled: boolean) => {
    localStream?.getVideoTracks().forEach((t) => (t.enabled = enabled));
  }, [localStream]);

  // End call
  const endCall = useCallback(() => {
    callRef.current?.close();
    localStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setConnected(false);
  }, [localStream]);

  return {
    peer,
    localStream,
    remoteStream,
    connected,
    peerReady,
    error,
    startLocalStream,
    callPeer,
    toggleAudio,
    toggleVideo,
    endCall,
  };
};
