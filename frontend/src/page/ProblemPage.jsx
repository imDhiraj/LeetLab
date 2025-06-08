import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { useParams, Link } from "react-router-dom";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  BookOpen,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
} from "lucide-react";

import { useProblemStore } from "../store/useProblemStore";
import { useExecutionStore } from "../store/useExecutionStore";
import { getLanguageId } from "../lib/lang";
import SubmissionResults from "../components/Submission";
import { useSubmissionStore } from "../store/useSubmissionStore";
import SubmissionsList from "../components/SubmissionList";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const {
    submissions: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookMarked, setIsBookMarked] = useState(false);
  const [testCases, setTestCases] = useState([]);

  const { executeCode, submission, isExecuting, clearSubmission } =
    useExecutionStore();

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      console.log("submit");
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
    // Clear any previous submission results when loading a new problem
    if (clearSubmission) {
      clearSubmission();
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  // Fixed: Separate useEffect for initializing language and code when problem loads
  useEffect(() => {
    if (problem && problem.codeSnippets) {
      // Set default language if available languages changed
      const availableLanguages = Object.keys(problem.codeSnippets);
      if (
        availableLanguages.length > 0 &&
        !availableLanguages.includes(selectedLanguage)
      ) {
        setSelectedLanguage(availableLanguages[0]);
      }
    }
  }, [problem]);

  // Separate useEffect for test cases to ensure they refresh properly
  useEffect(() => {
    if (problem && problem.testcases) {
      setTestCases(
        problem.testcases.map((tc) => ({
          input: tc.input,
          output: tc.output,
        }))
      );
    } else {
      setTestCases([]);
    }
  }, [problem]);

  // Fixed: Separate useEffect for handling code changes when language changes
  useEffect(() => {
    if (problem && problem.codeSnippets) {
      const templateCode = problem.codeSnippets[selectedLanguage];
      if (templateCode) {
        setCode(templateCode);
      } else {
        // Fallback to first available language template
        const availableLanguages = Object.keys(problem.codeSnippets);
        if (availableLanguages.length > 0) {
          setCode(problem.codeSnippets[availableLanguages[0]] || "");
        }
      }
    }
  }, [problem, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    // Code will be updated by the useEffect above
  };

  console.log("Problem:", problem);
  console.log("isProblemLoading:", isProblemLoading);

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  console.log("Problem:", problem);
  console.log("isProblemLoading:", isProblemLoading);
  console.log("Submissions passed to SubmissionsList:", submissions);

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-base-200 p-6 rounded-xl mb-6 font-mono"
                    >
                      <div className="mb-4">
                        <div className="text-indigo-300 mb-2 text-base font-semibold">
                          Input:
                        </div>
                        <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                          {example.input}
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="text-indigo-300 mb-2 text-base font-semibold">
                          Output:
                        </div>
                        <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                          {example.output}
                        </span>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-emerald-300 mb-2 text-base font-semibold">
                            Explanation:
                          </div>
                          <p className="text-base-content/70 text-lg font-sem">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl mb-6">
                  <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "discussion":
        return (
          <div className="p-4 text-center text-base-content/70">
            No discussions yet
          </div>
        );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">
                No hints available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br w-full to-base-200">
      <nav className="navbar bg-base-100 shadow-lg px-1 sm:px-3 md:px-6 flex items-center min-h-0 py-2">
        <div className="flex-1 flex items-center gap-2">
          <Link to={"/"} className="flex items-center gap-2 text-primary">
            <Home className="w-6 h-6" />
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex-none gap-4 flex items-center">
          <button
            className={`btn btn-ghost btn-circle ${
              isBookMarked ? "text-primary" : ""
            }`}
            onClick={() => setIsBookMarked(!isBookMarked)}
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="btn btn-ghost btn-circle">
            <Share2 className="w-5 h-5" />
          </button>
          {/* Removed language select from here */}
        </div>
      </nav>

      <div className="px-1 sm:px-3 md:px-6 py-4 w-full h-[calc(100vh-56px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left: Problem Description and Tabs */}
          <div className="card bg-base-100 shadow-xl h-full overflow-auto">
            <div className="card-body p-0 flex flex-col h-full">
              {/* Problem title and meta info */}
              <div className="p-6 pb-0">
                <h1 className="text-xl font-bold">{problem.title}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/70 mt-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Updated{" "}
                    {new Date(problem.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-base-content/30">•</span>
                  <Users className="w-4 h-4" />
                  <span>{submissionCount} Submissions</span>
                  <span className="text-base-content/30">•</span>
                  <ThumbsUp className="w-4 h-4" />
                  <span>95% Success Rate</span>
                </div>
              </div>
              <div className="tabs tabs-bordered mt-2">
                <button
                  className={`tab gap-2 ${
                    activeTab === "description" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  <FileText className="w-4 h-4" />
                  Description
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "submissions" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("submissions")}
                >
                  <Code2 className="w-4 h-4" />
                  Submissions
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "discussion" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("discussion")}
                >
                  <MessageSquare className="w-4 h-4" />
                  Discussion
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "hints" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("hints")}
                >
                  <Lightbulb className="w-4 h-4" />
                  Hints
                </button>
              </div>
              <div className="p-6 flex-1 overflow-auto">
                {renderTabContent()}
              </div>
            </div>
          </div>
          {/* Right: Code Editor + Test Cases/Results */}
          <div className="flex flex-col gap-6 h-full">
            <div className="card bg-base-100 shadow-xl flex-1 flex flex-col min-h-0">
              <div className="card-body p-0 flex flex-col h-full">
                {/* Language selection and Code Editor tab on the same row */}
                <div className="flex justify-between items-center p-4 pb-0">
                  <div className="tabs tabs-bordered m-0">
                    <button className="tab tab-active gap-2">
                      <Terminal className="w-4 h-4" />
                      Code Editor
                    </button>
                  </div>
                  <select
                    className="select select-bordered select-primary w-40"
                    value={selectedLanguage}
                    onChange={handleLanguageChange}
                  >
                    {Object.keys(problem.codeSnippets || {}).map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 min-h-0">
                  <Editor
                    height="100%"
                    language={selectedLanguage.toLowerCase()}
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 16.5,
                      lineNumbers: "on",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      readOnly: false,
                      automaticLayout: true,
                    }}
                  />
                </div>
                <div className="p-4 border-t border-base-300 bg-base-200 ">
                  <div className="flex justify-between items-center">
                    <button
                      className={`btn btn-primary gap-2 ${
                        isExecuting ? "loading" : ""
                      }`}
                      onClick={handleRunCode}
                      disabled={isExecuting}
                    >
                      {!isExecuting && <Play className="w-4 h-4" />}
                      Run Code
                    </button>
                    <button className="btn btn-success gap-2">
                      Submit Solution
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Test Cases / Results */}
            <div
              className="card bg-base-100 shadow-xl flex-shrink-0 flex-grow-0"
              style={{ minHeight: 0, height: "300px" }}
            >
              <div className="card-body h-full overflow-auto">
                {submission ? (
                  <SubmissionResults submission={submission} />
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Test Cases</h3>
                      <span className="text-sm text-base-content/70">
                        {testCases.length} test case
                        {testCases.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {testCases.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                          <thead>
                            <tr>
                              <th>Input</th>
                              <th>Expected Output</th>
                            </tr>
                          </thead>
                          <tbody>
                            {testCases.map((testCase, index) => (
                              <tr key={index}>
                                <td className="font-mono">{testCase.input}</td>
                                <td className="font-mono">{testCase.output}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-base-content/70">
                        <div className="text-center">
                          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No test cases available</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
