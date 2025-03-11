import openai from "@/services/openai";
import db from "@/services/db";

export async function GET(req) {
    const docList = await db.collection("vocab-ai").orderBy("createdAt","DESC").get()
    //console.log("docList",docList)

    const vocabList = [];
    docList.forEach(doc => {
        //doc.id 文件ID
        //doc.data() 取得當初存入的資料格式
        //console.log("doc:",doc.data())
        const result = doc.data()
        //把result推入vocabList陣列內
        vocabList.push(result)
    })

    return Response.json(vocabList);
    
}

export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    const {userInput,language} = body;

    // TODO: 透過gpt-4o-mini模型讓AI回傳相關單字
    // 文件連結：https://platform.openai.com/docs/guides/text-generation/chat-completions-api?lang=node.js
    // JSON Mode: https://platform.openai.com/docs/guides/text-generation/json-mode?lang=node.js
    const systemPrompt = `你是單字聯想AI根據提供的主題聯想5個相關單字以及對應的5個繁體中文意思
    # 輸入範例:
    主題:水果
    語言:English

    # 輸出JSON 範例:
    {
        wordList:["Apple","Banana",...],
        zhWordList:["蘋果","香蕉",...],
    }

    `;
    const prompt = `
    主題:${userInput}
    語言:${language}
    `;

    const openAIReqBody = {
        messages: [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": prompt }
        ],
        model: "gpt-4o-mini",
        //啟用JSON模式，就可以有穩定的輸出格式
        response_format: { type: "json_object" },
    };
    const completion = await openai.chat.completions.create(openAIReqBody);
    const payload = JSON.parse(completion.choices[0].message.content);
    console.log("payload:", payload);

    const result = {
        title: userInput,
        payload:payload,
        language,
        createdAt: Date.now(),

    }

    //使用add()方法自動產生隨機ID並儲存文件
    await db.collection('vocab-ai').add(result)
      
    return Response.json(result);
}