"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import ImageGenCard from "@/components/ImageGenCard";
import ImageGenPlaceholder from "@/components/ImageGenPlaceholder";

export default function ImgGen() {
    const [userInput, setUserInput] = useState("");
    // 是否在等待回應
    const [isWaiting, setIsWaiting] = useState(false);
    const [imageList,setImageList]=useState([])

    useEffect(() => {
        axios.get("/api/image-ai")
        .then(res => {
            console.log("res:",res)
            setImageList(res.data)
        })
        .catch(err => {
            console.log("err:",err)
            alert("取得圖片時發生錯誤")

        })

    },[])

    const submitHandler = (e) => {
        e.preventDefault();
        console.log("User Input: ", userInput);
        const body = { userInput };
        console.log("body:", body);
        setUserInput("")
        setIsWaiting(true)
        // TODO: 將body POST到 /api/image-ai { userInput: "" }
        axios
        .post("/api/image-ai",body)
        .then(res => {
            console.log("res",res)
            setIsWaiting(false)
            //更新imageList狀態
            //最新資料擺前面，
            setImageList([res.data,...imageList])

        })
        .catch(err => {
            console.log("err",err);
            alert("生成圖片出了問題，請稍後再試")
            setIsWaiting(false)
        })



    }

    return (
        <>
            <CurrentFileIndicator filePath="/app/image-generator/page.js" />
            <PageHeader title="AI Image Generator" icon={faImage} />
            <section>
                <div className="container mx-auto">
                    <form onSubmit={submitHandler}>
                        <div className="flex">
                            <div className="w-4/5 px-2">
                                <input
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    type="text"
                                    className="border-2 focus:border-pink-500 w-full block p-3 rounded-lg"
                                    placeholder="Enter a word or phrase"
                                    required
                                />
                            </div>
                            <div className="w-1/5 px-2">
                                <GeneratorButton />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <section>
                <div className="container mx-auto pt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/*顯示AI輸出結果 */}
                    {
                        isWaiting && <ImageGenPlaceholder/>
                    }
                    {
                        imageList.map(result =>{
                            const {imageURL,prompt,createdAt} = result;
                            return(
                                <ImageGenCard
                            imageURL={imageURL}
                            prompt={prompt}
                            key={createdAt}
                            />
                            )

                        })
                    }

                </div>
            </section>
        </>
    )
}