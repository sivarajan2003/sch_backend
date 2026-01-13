import express from 'express';
import adminuserRoutes from './adminuser.routes.js';  


const router = express.Router();

// router.get('/', (req, res) => {
//   res.send("User Route is Working!!").status(404);
// });

router.use('/adminuser', adminuserRoutes);



// function registerroutes(app){
//     app.use('/api/v1/hms', router);
// }

export default router;