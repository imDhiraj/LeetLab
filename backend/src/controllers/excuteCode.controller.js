
import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const excuteCode = async(req , res )=>{
    try {
        const {source_code , language_id,stdin, expected_outputs , problemId} = req.body;

        const user = req.user.id;

        //validateing test cases

        if (!Array.isArray(stdin)||stdin.length ===0 || !Array.isArray(expected_outputs)|| expected_outputs.length!==stdin.length)
            {
                return res.status(400).json({error:"Invaild or missing test cases"})
            }
            console.log("1test");
        //perpare each test cases for judge0 bacth submission

        const submission = stdin.map((input) => ({
          source_code: source_code,
          language_id: language_id,
          stdin: input,
          
        }));
        console.log("2test");
        // send this batch to judge 

        const submitResponse = await submitBatch(submission);
        console.log("3test");

        const tokens  = submitResponse.map((res)=>res.token);
        console.log("4test");
        // poll judge0 for result of all submitted testcases 
        const results = await pollBatchResults(tokens);
        console.log("5test");
        console.log('Result---------')
        console.log(results)

        res.status(200).json({
          //sucess: true,
          message: "solved problem Sucessfully",
        });



    } catch (error) {
        
    }
}