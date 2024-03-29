'use client';
import Head from "next/head";
import React, {ChangeEvent, KeyboardEvent, MutableRefObject, useEffect, useRef, useState} from "react";
import {v4 as uuid} from "uuid";
import {ICloseEvent, IMessageEvent, w3cwebsocket as W3CWebSocket} from "websocket";

export default function Terminal({session_id}: {session_id: string}) {
    const [sessionId, setSessionId] = useState<string>(session_id);
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<string[]>([]);
    const client = useRef<W3CWebSocket | null>(null)
    const [memoryState, setMemoryState] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

     useEffect(() => {

        const connectSocket = () => {

            // client.current = new W3CWebSocket(`ws://localhost:3000/api/socket/`)
            if (sessionId) {
                client.current = new W3CWebSocket(
                    `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}cli/${sessionId}/`
                )

                // client.current = new W3CWebSocket(
                //     `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}cofounder/${sessionId}/`
                // )

                client.current.onopen = () => {
                    console.log("WebSocket Client Connected")
                }

                client.current.onmessage = (message: IMessageEvent) => {
                    const data = JSON.parse(message.data.toString())
                    if (data.id === "state") {
                        console.log("setting memory state")
                        setMemoryState([...memoryState, data.message])
                    } else {
                        console.log("oops, data.id =", data.id)
                    }
                    console.log(data)
                }

                client.current.onclose = (event: ICloseEvent) => {
                    setTimeout(() => {
                        connectSocket()
                    }, 5000) // retries after 5 seconds.
                }

                client.current.onerror = (error: Error) => {
                    console.log(`WebSocket Error: ${JSON.stringify(error)}`)
                }
            }
        }

        connectSocket()
    }, [sessionId, memoryState])

    // Execute this effect on page load to initialize the session ID
    useEffect(() => {
        let existingSessionId = localStorage.getItem('sessionId');
        if (!existingSessionId) {
            // Generate a new UUID if one doesn't already exist in storage
            existingSessionId = uuid();
            localStorage.setItem('sessionId', existingSessionId);
        }
        setSessionId(existingSessionId);

        // Focus the hidden input whenever the component mounts
        inputRef.current?.focus();

        // Load the previous session's output if it exists
        const savedOutput = localStorage.getItem('output');
        if (savedOutput) {
            setOutput(JSON.parse(savedOutput));
        }
    }, []);

    const updateInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const newOutput = `Executing command: ${input}`;
            if (client && client.current) {
                client.current.send(
                    JSON.stringify({
                      message: input,
                      user_id: 1,
                      chat_type: "default",
                    })
                  )
            }
            const updatedOutput = [...output, newOutput];
            setOutput(updatedOutput);
            setInput('');

            // Save the new output to localStorage
            localStorage.setItem('output', JSON.stringify(updatedOutput));

            // Scroll to the bottom of the output
            const outputElement = document.getElementById('output');
            if (outputElement) {
                outputElement.scrollTop = outputElement.scrollHeight;
            }
        }
    };

    if (!sessionId) {
        return <div>Loading...</div>;
    }


    return (
        <>
            <div className="h-screen flex w-full">
                <Head>
                    <title>Hacker Terminal</title>
                </Head>
                <div className="flex-1 bg-black p-4 text-green-500">
                    <div className="h-full flex flex-col justify-end">
                        <div id="output" className="text-hacker-green font-mono text-lg space-y-2">
                            {/* Outputs displayed here */}
                            {output.map((line, index) => (
                                <div key={index}>{line}</div>
                            ))}
                        </div>
                        <div className="flex mt-4">
                            <span className="text-hacker-green font-mono text-lg">hacker@terminal:~$</span>
                            <input
                                type="text"
                                className="bg-black text-hacker-green ml-2 outline-none flex-1"
                                value={input}
                                onChange={updateInput}
                                onKeyDown={handleKeyDown}
                                ref={inputRef}
                            />
                            <span className="blink text-hacker-green">|</span>
                        </div>
                    </div>
                </div>
                <div className="w-1/3 bg-gray-900 p-4 text-white overflow-y-auto">
                    <h2 className="text-xl mb-3 font-bold">Task List</h2>
                    {/* Task list items should be rendered here */}
                    {memoryState.map((line, index) => (
                        <div key={index}>{line}</div>
                    ))}
                    <p>Session ID: {sessionId}</p> {/* Display the session ID */}
                </div>
            </div>
        </>
    )
}