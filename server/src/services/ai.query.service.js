
import Groq from "groq-sdk"

const client = new Groq({apikey: process.env.LLM_API_KEY})

async function query_resumen_rec(text, resume_desc, job_desc){
    const prompt = `
            Evaluate the following resume against the job description.
            Return ONLY a JSON object matcking this schema:

            {
                scores: {
                overall: Number,
                semantic: Number,
                keyword: Number,
                experience: Number,
                skills: Number,
                ats: Number,
                }
            }
            JOB:
            Tittle: ${job_desc.title}
            Company: ${job_desc.company}
            Description: ${job_desc.rawText}

            RESUME:
            Text: ${resume_desc.text}
        `
    ;
    const response = await client.chat.completions.create({
        model: process.env.LLM_MODEL,
        messages: [{role: "user", content: prompt}],
        temperature: 0
    })

    const raw = response.choices[0].messages.content

    const jsonText = raw.match(/\{[\s\S]*\}/)[0];
    const result = JSON.parse(jsonText)

    return result.scores
}