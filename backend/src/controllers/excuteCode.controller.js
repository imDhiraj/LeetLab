import { db } from "../libs/db.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../libs/judge0.lib.js";

export const excuteCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;

    const userId = req.user.id;

    //validateing test cases

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invaild or missing test cases" });
    }
    console.log("1test");
    //perpare each test cases for judge0 bacth submission

    const submissions = stdin.map((input) => ({
      source_code: source_code,
      language_id: language_id,
      stdin: input,
    }));
    console.log("2test");
    // send this batch to judge

    const submitResponse = await submitBatch(submissions);
    console.log("3test");

    const tokens = submitResponse.map((res) => res.token);
    console.log("4test");
    // poll judge0 for result of all submitted testcases
    const results = await pollBatchResults(tokens);
    console.log("5test");
    console.log("Result---------");
    console.log(results);

    //Analayse test case results
    let allPassed = true;
    const detailedResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      if (!passed) allPassed = false;

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        complie_output: result.complie_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} KB` : undefined,
      };

      // console.log(`TestCase # ${i+1}`);
      // console.log(`input ${stdin[i]}`);
      // console.log(`Expaected output for Testcase ${expected_output}`)
      // console.log(`Autual Output ${stdout}`)

      // console.log(`Matched :${passed}`)
    });

    console.log(detailedResults);

    const submission = await db.submission.create({
      data: {
        user: { connect: { id: userId } },
        problem: { connect: { id: problemId } },
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.complie_output)
          ? JSON.stringify(detailedResults.map((r) => r.complie_output))
          : null,
        status: allPassed ? "Accepted" : "WrongAnswer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });

    //If all passed = true mark problem as solvd for the current user

    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    // save indivaiual result using detiled result

    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.complie_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));
    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    res.status(200).json({
      sucess: true,
      message: "code excuted Sucessfully",
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.error("Error Excuting code", error.message);
    res.status(500).json({ error: "Failed to excute the code" });
  }
};
