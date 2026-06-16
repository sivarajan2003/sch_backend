//dashboardCard.controller.js
import dashboardCardService
from "../service/dashboardCard.service.js";

const getDashboardCards =
async (req,res)=>{

 try{

  const { teacherId } =
   req.params;

  const data =
   await dashboardCardService
   .getTeacherDashboardCards(
     teacherId
   );

  res.status(200).json({
   success:true,
   data
  });

 }catch(err){

  res.status(500).json({
   success:false,
   message:err.message
  });

 }

};

export default {
 getDashboardCards
};
