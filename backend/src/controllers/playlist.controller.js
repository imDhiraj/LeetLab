export const problemPlaylist = async (req,res )=>{
    try {
        res.status(200).json({
            success: true,
            message: "Subimissions Fetched Sucuccessfully",
            
          });
      } catch (error) {
          console.error("Fetching Submission Error:", error);
          res.status(500).json({ error: "Failed to fetch subimission" });
      }
};
