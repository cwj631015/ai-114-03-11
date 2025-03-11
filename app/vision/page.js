"use client";

import { useState } from "react";
import axios from "axios";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import { faEye } from "@fortawesome/free-solid-svg-icons"


export default function Vision() {
    // 是否在等待回應
    const [isWaiting, setIsWaiting] = useState(false);
    const [aiText,setAiText] = useState("")
    const [aiImageURL,setAiImageURL] = useState("")

    const changeHandler = (e) => {
        e.preventDefault();
        //取得使用者上傳的圖片
        const file = e.target.files[0]
        //將圖片轉成base64格式
        // 建立FileReader物件來讀取檔案
        const reader = new FileReader();
        //將file顯示到圖中片
        //建立URL物件來顯示圖片
        const imageURL = URL.createObjectURL(file);
        setAiImageURL(imageURL);

        setAiText("辦識中...")

        reader.onload = () => {
            // 取得base64格式的圖片資料
            const base64Image = reader.result;
            console.log("圖片的base64格式:", base64Image);
            //將使用者上傳的圖片轉換成base64 POST到 /api/vision-ai { base64: "" }
            axios.post("/api/vision-ai", { base64: base64Image })
                .then(res => {
                    console.log("res", res);
                    setAiText(res.data.aiText)

                })
                .catch(err => {
                    console.log("err", err);
                    alert("在ai影像辦識時出了問題")
                    setAiText("辦識失敗...")

                })
        }

        // 開始讀取檔案,結果會觸發onload事件
        reader.readAsDataURL(file);

    }

    return (
        <>
            <CurrentFileIndicator filePath="/app/vision/page.js" />
            <PageHeader title="AI Vision" icon={faEye} />
            <section>
                <div className="container mx-auto">
                    <label htmlFor="imageUploader" className="block">Upload Image</label>
                    <input
                        id="imageUploader"
                        type="file"
                        onChange={changeHandler}
                        accept=".jpg, .jpeg, .png"
                    />
                </div>
            </section>
            <section>
                <div className="container mx-auto">
                    {
                        aiImageURL && <img
                            className="w-72 my-3"
                            src={aiImageURL}
                            alt="使用者傳的圖片" />
                    }
                    {/* TODO: 顯示AI輸出結果 */}
                    <h1 className="text-2xl font-bold mt-4">{aiText}</h1>

                </div>
            </section>
        </>
    )
}