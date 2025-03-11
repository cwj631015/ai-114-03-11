import openai from "@/services/openai";

export async function POST(req) {
    const body = await req.json();
    const { word, language } = body;
    const systemPrompt = `
    請使用指定語言根據指定單字產生一個簡單例句，以及繁體中文意思
    輸入範例:
    world:apple
    language:English

    輸出JSON範例:
    {
    sentence:"i like to eat apple"
    zhSentence:"我喜歡吃蘋果"
    
    }
    `;

    const userPrompt = `
    word:${word}
    language:${language}
    `;

    const openAIBody = {
        model: "gpt-4o-mini",
        messages: [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": userPrompt }
        ],
        response_format: { type: "json_object" },

    }

    const completion = await openai.chat.completions.create(openAIBody);
    const data = JSON.parse(completion.choices[0].message.content);

    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: data.sentence,
    });
    //產生音訊檔案
    const buffer = Buffer.from(await mp3.arrayBuffer());
    //轉base64
    const base64 = buffer.toString('base64')
    //將base64存入最後會傳給前端的data物件中
    data.base64 = base64;


    return Response.json(data);



}