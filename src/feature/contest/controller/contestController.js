const {
  fetchLeetcodeContestsAndUserData,
  fetchCodeChefsContestAndUserData,
  fetchCodeForcesContestAndUserData
} = require("../services/contestdetails.services");
const {sendSuccessResponse} = require("../../../utils/success.response");
module.exports.getAllContestController = async (req,res,next) =>{
    try{
        const usernamel = "_rawat";
        const username = "";
        const page = 6;
        const [leetcode, codechefs, codeforces] = await Promise.allSettled([
            fetchLeetcodeContestsAndUserData(usernamel),
            fetchCodeChefsContestAndUserData(username,page),
            fetchCodeForcesContestAndUserData(username,page),
        ])                                                                                                                                                                                                                                                                                                                                                                                    
       sendSuccessResponse({
        res,                                                                                        
        statusCode:200,  
        data:{           
            dashboard:{       
               leetcode,codechefs,codeforces        
            }     
        }         
       })     
    }catch(err){    
        next(err);  
    }  
}                                                                