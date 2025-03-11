import openai from "@/services/openai";
import axios from "axios";
import db from "@/services/db";

//定義集合名稱
const collectionName = "image-ai";

export async function GET(req) {
     const docList = await db.collection(collectionName).orderBy("createdAt","desc").get();
     const imageList = [];

     docList.forEach(doc => {
        //console.log(doc.data());
        //文件內的資料推入imageList陣內中
        imageList.push(doc.data())    
})
    //把imageList回傳給前端
    return Response.json(imageList);
}

export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    const {userInput} = body;
    // 透過dall-e-3模型讓AI產生圖片
    // 文件連結: https://platform.openai.com/docs/guides/images/usage
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: userInput,
        n: 1,
        size: "1024x1024",
      });
      
      console.log("AI畫的圖所在網址:",response.data[0].url);
      //定義aiImageURL = response.data[0].url;
      const aiImageURL = response.data[0].url;
          // 將AI生成的圖片上傳至Imgur
      const imgurResponse = await axios.post(
        'https://api.imgur.com/3/image',
        {
            image: aiImageURL,
            type: 'url'
        },
        {
            headers: {
                'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`
            }
        }
    );
    //console.log("imgurResponse:", imgurResponse);
    // 取得Imgur的圖片連結
    const imgurImageURL = imgurResponse.data.data.link;
    
    const result={
        imageURL:imgurImageURL,
        //這裡的body.userInput以在上方表示成 const {userInput} = body;
        //就可以直接輸入userInput
        prompt:userInput,
        createdAt:Date.now(),
    }
     //將result存到image-ai集合內
     await db.collection(collectionName).add(result);

    return Response.json(result);
}