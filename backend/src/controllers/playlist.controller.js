import { db } from "../libs/db.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });


    res.status(201).json({
      success: true,
      message: "Playlist created Sucuccessfully",
      playlist
    });
  } catch (error) {
    console.error("playlist creating Error:", error);
    res.status(500).json({ error: "Failed to create playlist " });
  }
};
export const getAllListDetsils = async (req, res) => {
  try {

    const playlists= await db.playlist.findMany({
        where:{
            userId : req.user.id
        },
        include:{
            problems:{
                include:{
                    problem:true
                }
            }

        }

    })


    res.status(200).json({
      success: true,
      message: "playlist Fetched Sucuccessfully",
      playlists
    });
  } catch (error) {
    console.error("Fetching playlist Error:", error);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
};
export const getPlayListDetsils = async (req, res) => {
    const { playlistId } = req.params;
  try {
    

    const playlist = await db.playlist.findUnique({
      where: {
        id:playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist){
        return res.status(404).json({error:"Playist Not Found"})
    }

    res.status(200).json({
      success: true,
      message: "playlist Fetched Sucuccessfully",
      playlist,
    });
  } catch (error) {
    console.error("Fetching playlist Error:", error);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
};

export const addProblemToPlaylist = async (req, res) => {

    const { playlistId } = req.params;
    const { problemIds } = req.body;
  try {
    if(!Array.isArray(problemIds) || problemIds.length===0){
        res.status(400).json({error:"Invaild or missing ProblemId"})

    }
    //create recored for problem in playlist

    const problemsInPlaylist = await db.problemInPlaylist.createMany({
        data:problemIds.map((problemId)=>({
            playListId:playlistId  ,
            problemId
        }))
    })
   



    res.status(201).json({
      success: true,
      message: "playlist created Sucuccessfully",
      problemsInPlaylist
    });
  } catch (error) {
    console.error("playlist created Error:", error);
    res.status(500).json({ error: "Failed to create playlist " });
  }
};
export const deletePlayList = async (req, res) => {
    const {playlistId} = req.params;
  try {
    const deletedPlayList = await db.playlist.delete({
        where:{
            id:playlistId
        }
    })


    res.status(200).json({
      success: true,
      message: "playlist deleted Sucuccessfully",
      deletedPlayList,
    });
  } catch (error) {
    console.error("playlist deleted Error:", error);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};
export const removeProblemFromPlayList = async (req, res) => {
    const { playlistId } = req.params;
    const { problemIds } = req.body;
    
    try {
        if(!Array.isArray(problemIds) || problemIds.length===0){
            res.status(400).json({error:"Invaild or missing ProblemId"})}

        



      const deletedProblem = await db.problemInPlaylist.deleteMany({
        where: {
            playListId: playlistId,
           problemId:{
            in:problemIds
           
           }
        },
      })
      res.status(200).json({
        success: true,
        message: "Subimissions Fetched Sucuccessfully",
        deletedProblem
      });
    } 
    catch (error) {
      console.error("Fetching Submission Error:", error);
      res.status(500).json({ error: "Failed to fetch subimission" });
    }
}



