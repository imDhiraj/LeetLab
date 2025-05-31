import{create} from "zustand"
import { axiosInstance } from "../lib/axios.js";
import {toast} from "react-hot-toast"

export const useProblemStore = create((set)=>({
    problems:[],
    problem:null,
    solvedProblem:[],
    isProblemsLoading:false,
    isProblemLoading:false,

    getAllProblems:async()=>{
        try {
            set({isProblemsLoading:true})

            const res = await axiosInstance.get("/problems/get-all-problem");

            set({problems:res.data.problems})
        } catch (error) {
            console.log("Error Getting the Problems:",error)
            toast.error("Error in Getting Problems")
            
        } finally{
            set ({isProblemsLoading:false})
        }
    },

    getProblemById:async(id)=>{
        try {
          set({ isProblemLoading: true });

          const res = await axiosInstance.get(`/problems/getProblem/${id}`);

          set({ problem: res.data.problem });
        } catch (error) {
          console.log("Error Getting the Problem:", error);
          toast.error("Error in Getting Problem");
        } finally {
          set({ isProblemLoading: false });
        }
    },

    getSolvedProblemByUser:async()=>{
        try {
         
          const res = await axiosInstance.get("/problems/get-solved-problem");

          set({ solvedProblems: res.data.problems });
        } catch (error) {
          console.log("Error Getting the Solved Problems:", error);
          toast.error("Error in Getting Solved Problems");
        } 
    }

}))