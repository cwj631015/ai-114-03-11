import openai from "@/services/openai";

export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    const {base64} = body;
    // 透過base64讓AI辨識圖片
    // 文件連結：https://platform.openai.com/docs/guides/vision?lang=node
    const openAIReqBody = {
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "取出圖片裡的姓名，日期，加工批號，尺寸，成品數" },
                    {
                        type: "image_url",
                        image_url: {
                            "url": base64,
                        },
                    },
                ],
            },

        ],
        model: "gpt-4o-mini",
    };

    const completion = await openai.chat.completions.create(openAIReqBody);
    console.log("completion:", completion.choices[0].message.content);
    const aiText = completion.choices[0].message.content

    return Response.json({ message: "Success" ,aiText});
}