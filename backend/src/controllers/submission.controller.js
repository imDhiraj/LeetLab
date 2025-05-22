import { db } from "../libs/db.js";

export const getAllSubmission = async (req,res)=>{

    try {
        const userId = req.user.id;

        const subimission = await db.submission.findMany({
            where:{
                userId:userId
            }
        })

        res.status(200).json({
            success:true,
            message:"Subimission Fetched Sucuccessfully",
            subimission
        })

    } catch (error) {
        console.error("Fetching Submission Error:",error);
        res.status(500).json({error:"Failed to fetch subimission"});
    }
}
export const getSubmissionsForProblem = async (req, res) => {
    try {
        const userId = req.user.id;

        const problemId = req.params.problemId;


        const subimissions = await db.submission.findMany({
            where:{
                userId:userId,
                problemId:problemId
            }
        })


        res.status(200).json({
          success: true,
          message: "Subimission Fetched Sucuccessfully",
          subimissions,
        });
    } catch (error) {
        console.error("Fetching Submission Error:", error);
        res.status(500).json({ error: "Failed to fetch subimission" });
    }
};

export const getAllSubmissionsForProblem = async (req, res) => {
    try {

        const problemId = req.params.problemId;
        const subimission = await db.submission.count({
          where: {
            problemId: problemId,
          },
        });






        res.status(200).json({
          success: true,
          message: "Subimissions Fetched Sucuccessfully",
          count:subimission
        });
    } catch (error) {
        console.error("Fetching Submission Error:", error);
        res.status(500).json({ error: "Failed to fetch subimission" });
    }
};
