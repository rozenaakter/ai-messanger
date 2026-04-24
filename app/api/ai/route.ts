export async function POST(request: Request){
  const {message} = await request.json();
  // OpenRouter API এর URL
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions",{
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"

    },
    body: JSON.stringify({
      model:"openrouter/auto",
      messages:[
        {
          role: "system",
          content: "You are a helpful assistant."
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  });

 const data = await res.json();
console.log("API Response:", JSON.stringify(data)); // দেখার জন্য
if (!data.choices || data.choices.length === 0) {
  return Response.json({ reply: "AI response আসেনি: " + JSON.stringify(data) });
}
const reply = data.choices[0].message.content;
return Response.json({reply});
}