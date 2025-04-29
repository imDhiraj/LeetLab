import{db} from "../libs/db.js"



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