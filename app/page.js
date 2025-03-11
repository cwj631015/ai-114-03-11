"use client";

import { useState ,useEffect} from "react";
import axios from "axios";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import VocabGenResultCard from "@/components/VocabGenResultCard";
import VocabGenResultPlaceholder from "@/components/VocabGenResultPlaceholder";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [language, setLanguage] = useState("English");
  // 所有的單字生成結果清單
  const [vocabList, setVocabList] = useState([]);
  // 是否在等待回應
  const [isWaiting, setIsWaiting] = useState(false);
  const languageList = ["English", "Japanese", "Korean", "Spanish", "French", "German", "Italian"];
  //useEffect(函式，陣列)
  //陣列內的值有變化時，就會執行函式
  //陣列如果是空陣列，就只會執行一次函式

   useEffect (() => {
    //在綁定陣列為空陣列時，此流程只會在第一次渲染時執行
   console.log("準備跟後端要資料");
   axios.get("/api/vocab-ai")
   .then(res => {
    console.log("成功收到後端的回應了",res)
    setVocabList(res.data)

   })
   .catch(err => {
    console.log("err",err);
    alert("取得過去結果出了錯誤，請稍後再試")
   })


  },[])


    //預防重新整理
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("User Input: ", userInput);
    console.log("Language: ", language);
    const body = { userInput, language };
    console.log("body:", body);
    //第一要清空輸入欄,不用手動刪除
    setUserInput("");
    setIsWaiting(true);
    // TODO: 將body POST到 /api/vocab-ai { userInput: "", language: "" }
    axios.post("/api/vocab-ai",body)
    .then(res => {
      const result = res.data;
      console.log("後端回傳的資料",result);
      setIsWaiting(false)
      setVocabList([result,...vocabList])
      
    })


    .catch(err => {
      console.log("錯誤發生了",err);
    alert("錯誤發生了，請稍後再試")
    setIsWaiting(false)
      
    })

  }

  return (
    <>
      <CurrentFileIndicator filePath="/app/page.js" />
      <PageHeader title="AI Vocabulary Generator" icon={faEarthAmericas} />
      <section>
        <div className="container mx-auto">
          <form onSubmit={submitHandler}>
            <div className="flex">
              <div className="w-3/5 px-2">
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
                <select
                  className="border-2 w-full block p-3 rounded-lg"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  {
                    languageList.map(language => <option key={language} value={language}>{language}</option>)
                  }
                </select>
              </div>
              <div className="w-1/5 px-2">
                <GeneratorButton />
              </div>
            </div>
          </form>
        </div>
      </section>
      <section>
        <div className="container mx-auto">
          {/* 等待後端回應時要顯示的載入畫面 */}
          {isWaiting ? <VocabGenResultPlaceholder /> : null}
          {/* TODO: 顯示AI輸出結果 */}

          {/* TODO: 一張單字生成卡的範例，串接正式API後移除 */}
          {
            vocabList.map(result=> <VocabGenResultCard result={result} key={result.createdAt} />)
          }

        </div>
      </section>
    </>
  );
}
