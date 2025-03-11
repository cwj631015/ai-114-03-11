"use client";

import moment from 'moment';
import axios from 'axios';
import { useState } from 'react';

export default function VocabGenResultCard({ result }) {
    //sentence 外文例句
    const [sentence, setSentence] = useState("")
    //zhsentence 中文例句
    const [zhsentence, setZhSentence] = useState("");
    const [zhwordList, setZhWordList] = useState("");
    //音訊檔轉為base64
    const [base64, setBase64] = useState("")
    const [isWaiting, setIsWaiting] = useState(false);
    const { wordList, zhWordList } = result.payload;
    const wordItems = wordList.map((word, idx) => {
        return (
            <div className="p-3 border-2 border-slate-300 rounded-md" key={idx}>
                <h3 className="text-lg font-bold text-slate-700">{word}</h3>
                <p className="text-slate-400 mt-3">{zhWordList[idx]}</p>
                <button
                    className="bg-slate-700 hover:bg-slate-800 active:bg-slate-900 text-white text-sm px-2 py-1 mt-2 rounded-md"
                    onClick={() => {
                        const body = {
                            word,
                            language: result.language
                        }
                        setIsWaiting(true);
                        axios.post("/api/tts", body)
                            .then(res => {
                                const { sentence, zhsentence, base64 } = res.data;
                                setIsWaiting(false);
                                setSentence(sentence);
                                setZhSentence(zhsentence);
                                setBase64(base64);

                            })

                            .catch(err => {
                                setIsWaiting(false)

                            })


                    }}
                >產生例句</button>
            </div>
        )
    })
    return (
        <div className="bg-white shadow-sm p-4 rounded-xl my-3">
            <h3 className="text-lg">
                {result.title} <span className="py-2 px-4 bg-slate-200 font-semibold rounded-lg inline-block ml-2">{result.language}</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                {wordItems}
            </div>
            {isWaiting
                && <div>
                    <div className="w-full mt-3 h-6 bg-slate-200 rounded-md animate-pulse"> </div>
                    <div className="w-1/2 mt-3 h-6 bg-slate-200 rounded-md animate-pulse"> </div>
                </div>
            }

            {
                sentence && <div className='mt-3'>
                    <button className='bg-slate-700 hover:bg-slate-800 active:bg-slate-900 text-white text-sm px-2 py-1 mt-2 rounded-md'
                        onClick={() => {
                            //建立audio音訊播放器
                            const audio = new Audio(`data:audio/mp3;base64,${base64}`);
                            //播放音訊
                            audio.play();
                        }}

                    >
                        播放例句
                    </button>

                    <h3 className='text-lg'>{sentence}</h3>
                    <p className='text-slate-400 mt-3'>{zhsentence}</p>

                </div>

            }


            <p className="mt-3 text-right text-slate-500">
                Created At: {moment(result.createdAt).format("YYYY/MM/DD HH:mm:ss")}
            </p>
        </div>
    )
}