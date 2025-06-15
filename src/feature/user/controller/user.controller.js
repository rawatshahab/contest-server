const {
  fetchLeetcodeContestsAndUserData,
  fetchCodeChefContests,
  fetchCodeForcesContestAndUserData
} = require("../../../services/contest.services");
const {syncDatabase} = require("../services/contestdetails.services");
const {sendSuccessResponse} = require("../../../utils/success.response");
module.exports.getAllContestController = async (req,res,next) =>{
    try{
        const usernamel = "_rawat";
        const username = "Um_nik";
        const page = 6;
        const [leetcode,codechefs ,codeforces] = await Promise.allSettled([
            fetchLeetcodeContestsAndUserData(usernamel),
            fetchCodeChefContests(),
            fetchCodeForcesContestAndUserData(username,page),
        ])                                                                                                                                                                                                                                                                                                                                                                                    
       sendSuccessResponse({
        res,                                                                                        
        statusCode:200,  
        data:{           
            dashboard:{       
               leetcode,codeforces,codechefs       
            }     
        }         
       })     
    }catch(err){    
        next(err);  
    }  
} 
module.exports.saveToDbController = async (req,res,next) =>{
    try{
        const leetcodeID = "_rawat";
        const codeforcesID = "Um_nik";
        const page = 6;
        await syncDatabase(leetcodeID,codeforcesID);                                                                                                                                                                                                                                                                                                                                                                               
       sendSuccessResponse({
        res,                                                                                        
        statusCode:200,  
        data:null,        
       })     
    }catch(err){    
        next(err);  
    }  
}                                                                 