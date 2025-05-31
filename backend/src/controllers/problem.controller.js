import{db} from "../libs/db.js"
import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { getJudge0LanguageId } from "../libs/judge0.lib.js";



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
        const submission = testcases.map(({ input, output }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }));
        console.log("Submissions:", submission);
        const submissionResults = await submitBatch(submission);

        const token = submissionResults.map((res)=>res.token);

        const results = await pollBatchResults(token);
        console.log("results",results);
        for(let i = 0 ; i<results.length;i++){
          const result= results[i];
          console.log("Results--------",result);
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
          sucess: true,
          message: "New Problem Created Sucessfully",
          newProblem: newProblem,
        });

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
      const problems = await db.problem.findMany(
        {include: {
          solvedBy: {
            where: {
              userId: req.user.id
            }
          }
        }}
      );
      
      if(!problems){
        res.status(404).json({
          error:"No Problem Found"
        })
      }
      res.status(200).json({
        sucess:true,
        message:"Problems Fetched Successfully",
        problems
      })


    } catch (error) {
        console.error("Error Getting All Problems:", error);
        res.status(500).json({
          error: "Error Fetching Problems",
        });
    }

};


export const getProblemById = async (req, res) => {
  const {id} = req.params;

  
    try {
      const problem = await db.problem.findUnique(
        {
          where :{
            id
          }
        }
      )
      if (!problem) {
       return res.status(404).json({
          error: "No Problem Found",
        });
      }

     return res.status(200).json({
        sucess: true,
        message: "Problem Fetched Successfully",
        problem,
      });



    } catch (error) {
        console.error("Error Getting Problem:", error);
       return res.status(500).json({
          error: "Error Getting Problem",
        });
    }
};


export const updateProblemById = async (req, res) => {
  const {id}= req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    example,
    constraints,
    testcases,
    codeSnippets,
    referenceSoloution,
  } = req.body;




    try {
      for (const [language, solutionCode] of Object.entries(
        referenceSoloution
      )) {
        const languageId = getJudge0LanguageId(language);
        if (!languageId) {
          return res
            .status(400)
            .json({ error: `Language ${language}is not supported` });
        }
        const submission = testcases.map(({ input, output }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }));
        console.log("Submissions:", submission);
        const submissionResults = await submitBatch(submission);

        const token = submissionResults.map((res) => res.token);

        const results = await pollBatchResults(token);
        console.log("results", results);
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          console.log("Results--------", result);
          if (result.status.id !== 3) {
            return res.status(400).json({
              error: `Testcase  ${i + 1} failed for language ${language}`,
            });
          }
        }
        console.log("this the id of problem", id);
        const updatedProblem = await db.problem.update({
          where:{id},
           
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
              userId: req.user.id,
            
          },
        });

        if (!updatedProblem) {
          res.status(404).json({
            error: "No Problem Found",
          });
        }
        return res.status(200).json({
          sucess: true,
          message: "New Problem Created Sucessfully",
          updatedProblem: updatedProblem,
        });
      }

    } catch (error) {
        console.error("Error updating problem:", error);
        res.status(500).json({
          error: "Error updating problem",
        });
    }
};


export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      res.status(404).json({
        error: "No Problem Found",
      });
    }

    await db.problem.delete({ where: { id } });

    res.status(200).json({
      sucess: true,
      message: "Problems Deleted Successfully",
      
    });


  } catch (error) {
    console.error("Error Deleting Problem:", error);
    res.status(500).json({
      error: "Error Deleting Problem",
    });
  }
};


export const getProblemsSovledByUser = async (req, res) => {
    try {
      const problems = await db.problem.findMany({
        where:{
          solvedBy:{
            some:{
              userId:req.user.id
            }
          }
        }
        ,
        include:{
          solvedBy:{
            where:{
              userId:req.user.id
            }
          }
        }
      })

      res.status(200).json({
        success: true,
        message: "Sloved Problems Fetched Sucuccessfully",
        problems
        
      });
  

    } catch (error) {
        console.error("Error Getting Problems Sovled By User:", error);
        res.status(500).json({
          error: "Error Getting Problems Sovled By User",
        });
    }
};