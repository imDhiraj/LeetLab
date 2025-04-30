import{db} from "../libs/db.js"
import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";



export const createProblem = async(req,res)=>{
    const {
      title,
      description,
      difficulty,
      tags,
      example,
      constraints,
      testcases,
      codeSnippets,
      referenceSoloution
    } = req.body;

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Your Not Allowed to Create Problem",
      });
    }

    
    try {
      for(const [language, solutionCode]of Object.entries(referenceSoloution)){
        const languageId = getJudge0LanguageId(language);
        if(!languageId){
          return res.status(400).json({error:`Language ${language}is not supported`})
        }
        const submission = testcases.map((input ,output)=>({
          source_code:solutionCode,
          language_id:languageId,
          stdin:input,
          expected_output:output,


        }))

        const submissionResults = await submitBatch(submissions)

        const token = submissionResults.map((res)=>res.token);

        const result = await pollBatchResults(token);

        for(let i = 0 ; i<result.length;i++){
          const result= result[i];
          if (result.status.id!==3){
            return res.status(400).json({
              error:`Testcase  ${i+1} failed for language ${language}`
            })
          }

        }
        const newProblem = await db.problem.create({
          data: {
            title,
            description,
            difficulty,
            tags,
            example,
            constraints,
            testcases,
            codeSnippets,
            referenceSoloution,
            userId:req.user.id
          },
        });
        return res.status(200).json({
          sucess:true,
          message:"New Problem Created Sucessfully",
          newProblem:newProblem,
        })

      }
         
    } catch (error) {
        console.error("Error Creating Probelem:", error);
        res.status(500).json({
          error: "Error Creating Problem",
        });
    }
};


export const getAllProblems = async (req, res) => {
    try {
        

    } catch (error) {
        console.error("Error Getting All Problems:", error);
        res.status(500).json({
          error: "Error Getting All Problems",
        });
    }

};


export const getProblemById = async (req, res) => {
    try {

    } catch (error) {
        console.error("Error Getting Problem:", error);
        res.status(500).json({
          error: "Error Getting Problem",
        });
    }
};


export const updateProblemById = async (req, res) => {
    try {

    } catch (error) {
        console.error("Error updating problem:", error);
        res.status(500).json({
          error: "Error updating problem",
        });
    }
};


export const deleteProblem = async (req, res) => {
    try {
    } catch (error) {
        console.error("Error Deleting Problem:", error);
        res.status(500).json({
          error: "Error Deleting Problem",
        });
    }
};


export const getProblemsSovledByUser = async (req, res) => {
    try {

    } catch (error) {
        console.error("Error Getting Problems Sovled By User:", error);
        res.status(500).json({
          error: "Error Getting Problems Sovled By User",
        });
    }
};