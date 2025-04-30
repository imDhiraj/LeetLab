

export const getJudge0LanguageId = (language)=>{
    const languageMap={
        "PYTHON": 72,
        "JAVA":62,
        "JAVASCRIPT":63

    }
    return languageMap[language.toUpperCase()]
}

const sleep = (ms)=> new Promise((reslove)=>setTimeout(reslove, ms ))

export const pollBatchResults = async(token)=>{
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`,{
            Param:{
                token:token.join(","),
                base64_encoded: false,
            }

        })
        const results = data.submissions;
        const isAllDone = results.every(
          (r) => r.status.id !== 1 && r.status.id !== 2

        )
        if (isAllDone)return results
        await sleep(1000)

    }
};

export const submitBatch = async (submissions)=>{
    const { data } = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    })
    console.log("Submisiion Result:",data)

    return data // [{token},{token},{token}]
}