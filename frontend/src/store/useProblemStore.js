import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [], // Fixed: was solvedProblem (singular)
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });

      const res = await axiosInstance.get("/problems/get-all-problem");
      console.log("API Response:", res.data); // Add this for debugging

      set({ problems: res.data.problems });
    } catch (error) {
      console.log("Error Getting the Problems:", error);
      toast.error("Error in Getting Problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });

      const res = await axiosInstance.get(`/problems/getProblem/${id}`);
      console.log(res);
      set({ problem: res.data.problem });
    } catch (error) {
      console.log("Error Getting the Problem:", error);
      toast.error("Error in Getting Problem");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problem");

      set({ solvedProblems: res.data.problems }); // This was correct
    } catch (error) {
      console.log("Error Getting the Solved Problems:", error);
      toast.error("Error in Getting Solved Problems");
    }
  },
}));
