import React, { useState, useEffect, useMemo } from 'react';
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from "websocket";

const VideoChat = () => {
    // State variables
    const [webSocket, setWebSocket] = useState(null);
    const [peerConnection, setPeerConnection] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    const room: string = "testroom"; // Update later to use the channel's name grabbed from request to WSGI

//   const ws: W3CWebSocket = useMemo(
//     (): W3CWebSocket => new W3CWebSocket(`ws://0.0.0.0:8000/ws/video/${room}/`),
//     [room]
//   );

//   const ws: W3CWebSocket = useMemo(
//     (): W3CWebSocket => {
//       const ws = new W3CWebSocket(`ws://0.0.0.0:8000/ws/video/${room}/`);
  
    //   ws.onerror = function(event) {
    //     console.error("WebSocket error observed:", event);
    //   };
  
    //   ws.onclose = function(event) {
    //     console.error("WebSocket closed:", event);
    //   };
  
//       return ws;
//     },
//     [room]
//   );

    useEffect(() => {

        // const ws: W3CWebSocket = useMemo(
        //     (): W3CWebSocket => new W3CWebSocket(`ws://0.0.0.0:8000/ws/video/${room}/`),
        //     [room]
        //   );
    //     // Initialize WebSocket connection
        const loc = window.location;
        const wsStart = loc.protocol === 'https:' ? 'wss://' : 'ws://';
        const endPoint = wsStart + "localhost:8000/" + 'testroom';
        const ws = new W3CWebSocket(endPoint);
        console.log(ws);
        setWebSocket(ws);

        ws.onerror = function(event) {
            console.error("WebSocket error observed:", event);
          };
      
          ws.onclose = function(event) {
            console.error("WebSocket closed:", event);
          };

        // Initialize peer connection when WebSocket connection is open
        ws.onopen = () => {
            console.log('WebSocket connection opened!');
            const peer = createPeerConnection();
            setPeerConnection(peer);
        };

        // Handle WebSocket messages
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'offer') {
                handleOffer(data.offer);
            } else if (data.type === 'answer') {
                handleAnswer(data.answer);
            } else if (data.type === 'ice-candidate') {
                handleICECandidate(data.candidate);
            }
        };

        // Close WebSocket connection on component unmount
        return () => {
            ws.close();
        };
    }, []);

    // Function to create a peer connection
    const createPeerConnection = () => {
        const peer = new RTCPeerConnection();
        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        return peer;
    };

    // Function to handle ICE candidate events
    const handleICECandidateEvent = (event) => {
        if (event.candidate) {
            sendICECandidate(event.candidate);
        }
    };

    // Function to handle incoming ICE candidates
    const handleICECandidate = (candidate) => {
        if (peerConnection) {
            peerConnection.addIceCandidate(candidate);
        }
    };

    // Function to handle incoming offers
    const handleOffer = async (offer) => {
        if (!peerConnection) {
            const peer = createPeerConnection();
            setPeerConnection(peer);
        }
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        sendAnswer(answer);
    };

    // Function to handle incoming answers
    const handleAnswer = (answer) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    };

    // Function to handle incoming tracks
    const handleTrackEvent = (event) => {
        setRemoteStream(event.streams[0]);
    };

    // Function to send ICE candidate to the remote peer
    const sendICECandidate = (candidate) => {
        const message = {
            type: 'ice-candidate',
            candidate: candidate,
        };
        webSocket.send(JSON.stringify(message));
    };

    // Function to send answer to the remote peer
    const sendAnswer = (answer) => {
        const message = {
            type: 'answer',
            answer: answer,
        };
        webSocket.send(JSON.stringify(message));
    };

    return (
        <div>
            <div className="video-container">
                <div className="local-video-container">
                    <video className="local-video" ref={(video) => { if (video) video.srcObject = localStream; }} autoPlay muted playsInline></video>
                </div>
                <div className="remote-video-container">
                    <video className="remote-video" ref={(video) => { if (video) video.srcObject = remoteStream; }} autoPlay playsInline></video>
                </div>
            </div>
        </div>
    );
};

export default VideoChat;
