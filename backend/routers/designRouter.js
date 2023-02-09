import express from 'express';
import Design from '../models/designModel';

// import data from '../data.js';
import bcrypt from 'bcrypt';

import { getToken, isAuth, isAdmin } from '../util';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const designlist = await Design.find().populate('client')
    if (designlist) {
      res.send(
        designlist
      );
      return;
    }
    res.status(401).send({ message: 'Invalid Email or Password.' });
  } catch (error) {
    console.log(error);
  }

});


// router.post('/signin', async (req, res) => {
//   try {
//     const signinUser = await User.findOne({
//       email: req.body.email,
     
//     });
//     if (signinUser) {
//       if (bcrypt.compareSync(req.body.password, signinUser.password)) {
//         console.log("new pass")
//         var newsl=   signinUser.isAdmin? await News.find({ isApprove: false}) : '';
//         console.log(newsl.length)
//       res.send({
//         _id: signinUser.id,
//         firstName: signinUser.firstName,
//         lastName: signinUser.lastName,
//         email: signinUser.email,
//         isAdmin: signinUser.isAdmin,
//         token: getToken(signinUser),
//         Approvenews: newsl
//       });
//       return;
//     }
//     if (req.body.password == signinUser.password) {
//       console.log("old password");
//       if (req.body.password) {
//         signinUser.password =  bcrypt.hashSync(req.body.password, 8);
//       }
//       const updatedUser = await signinUser.save();
//       res.send({
//         _id: signinUser.id,
//         firstName: signinUser.firstName,
//         lastName: signinUser.lastName,
//         email: signinUser.email,
//         isAdmin: signinUser.isAdmin,
//         isSeller: signinUser.isSeller,
//         token: getToken(signinUser),
//       });
      
//     return;
//     }
//   }
//     res.status(401).send({ message: 'Invalid Email or Password.' });

//   } catch (error) {
//     console.log(error);
//   }

// });

router.get('/:id' , async (req, res) => {
  try {
    const user = await Design.findById(req.params.id).populate('client');

    //console.log(req.params.id+"new ed:"+user )
    if (user ) {
      res.send(user);
      return;
    }
    res.status(401).send({ message: 'Invalid design.' });

  } catch (error) {
    console.log(error);
  }
});
router.post('/createDesign', async (req, res) => {
  try {
 
    const design = new Design({
      designName: req.body.designName,
      designId:req.body.designId,
      designRate: req.body.designRate,
      client: req.body.client,
      CreatedAt: Date.now(),
      UpdatedAt: Date.now()
    })
    const findDesign = await Design.findOne({ 'designName': req.body.designName });
    
    if (findDesign) {
      res.status(401).send({ message: `Design Name is already exist & ${findDesign} ` })
    }
    else {
      const newDesign = await design.save();

      if (newDesign) {
        res.send({
          _id: newDesign.id, 
          designName: newDesign.clientName,
          designId: newDesign.clientId,
          designRate:  newDesign.designRate,
          CreatedAt: newDesign.CreatedAt,
          client: newDesign.clientId,
          UpdatedAt:  newDesign.UpdatedAt,
          
        });

      } else {
        res.status(401).send({ message: 'Invalid newDesign Data.' });
      }
    }
  }
  catch (error) {
    
    console.log(error);
  }

});


// router.get('/createadmin', async (req, res) => {
//   console.log('new user created: ');
//   try {
//     const user = new User({
//       firstName:'Denny',
//     lastName:'Patel',
//       email: 'denish@gmail.com',
//       password: bcrypt.hashSync('12345', 8),
//       isAdmin: true
//     });

//     const newUser = await user.save();
//     res.send(newUser);
//   }
//   catch (error) {
//     console.log("helllo" + error.message);
//     res.send({ meg: error.message });
//   }

// });


// router.get(
//   '/seed',async (req, res) => {
//     // await User.remove({});
//    // console.log(data.users)
//     try {
//     console.log("heer");
//     const createdUsers = await User.insertMany(data.users);
//     console.log(createdUsers);
//     res.send({ createdUsers });

//   }catch(error){
//     console.log(error.message)
//   }}
// );


router.put('/updatedesign',
  async (req, res) => {
    
    try {
      const design = await Design.findOne({designId: req.body.designId});
    if (design) {
      design.designName= req.body.designName || design.designName,
      design.designId= req.body.designId || design.designId,
      design.designRate = req.body.designRate || design.designRate;
      design.client = req.body.client || user.client;
      design.CreatedAt = design.CreatedAt || Date.now();
      design.UpdatedAt = Date.now();
     
      const updatedDesign = await design.save();

      res.send({
        _id: updatedDesign._id,
        designId: updatedDesign.designId,
        designName: updatedDesign.designName,
        designRate: updatedDesign.designRate,
        client: updatedDesign.client,
        CreatedAt:updatedDesign.CreatedAt,
        UpdatedAt: updatedDesign.UpdatedAt,
      });

      return;
    }
    else{
      res.status(401).send({ message: 'Invalid design or client.' });
    }
    } catch (error) {
      res.send({ meg: error.message });
    }
    
   

  }
);



router.delete('/:id',
  async (req, res) => {
    const design = await Design.findById(req.params.id);
    if (design) {
      
      const deleteDesign = await design.remove();
      res.send({ message: 'Design Deleted', user: deleteDesign });
    } else {
      res.status(404).send({ message: 'Design Not Found' });
    }
  }
);


// router.put('/:id', isAuth, isAdmin,
//   async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (user) {
//       user.firstName= req.body.firstName || user.firstName,
//       user.lastName= req.body.lastName || user.lastName,
//       user.email = req.body.email || user.email;
//       user.isAdmin = Boolean(req.body.isAdmin);
//       user.CreatedAt = Date.now();
//       const updatedUser = await user.save();
//       res.send({ message: 'User Updated', user: updatedUser });
//     } else {
//       res.status(404).send({ message: 'User Not Found' });
//     }
//   }
// );




export default router;