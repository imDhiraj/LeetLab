import axios from "axios";

export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 72,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[language.toUpperCase()];
};

const sleep = (ms) => new Promise((reslove) => setTimeout(reslove, ms));

export const pollBatchResults = async (tokens) => {

  while (true) {
    console.log("inside while loop pullbatch")
    // const { data } = await axios.get(
    //   `${process.env.JUDGE0_API_URL}/submissions/batch`,
    //   {
    //     params: {
    //       token: token.join(","),
    //       base64_encoded: false,
    //     },
    //   }
    // );

     const { data } = await axios.get(
       `${process.env.JUDGE0_API_URL}/submissions/batch`,
       {
         params: {
           tokens: tokens.join(","),
           base64_encoded: false,
         },
       }
     );

    console.log("we want data", data);
    const results = data.submissions;
    console.log("we want data of resluts", results);
    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );
    if (isAllDone) return results;
    await sleep(1000);
  }
};

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    }
  );
  console.log("Submisiion Result:", data);

  return data; // [{token},{token},{token}]
};


export function getLanguageName (LanguageId){
  const LANGUAGE_NAMES = {
    74: "TypeScript",
    63: "JavaScript",
    71: "Python",
    62: "Java",
  }

  return LANGUAGE_NAMES[LanguageId] || "Unknown"
}
