import express from 'express';
import Client from '../models/clientModel';

// import data from '../data.js';
import bcrypt from 'bcrypt';

import { getToken, isAuth, isAdmin } from '../util';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const userlist = await Client.find()
    if (userlist) {
      res.send(
        userlist
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
    const user = await Client.findById(req.params.id);
    //console.log(req.params.id+"new ed:"+user )
    if (user ) {
      res.send(user);
      return;
    }
    res.status(401).send({ message: 'Invalid client.' });

  } catch (error) {
    console.log(error);
  }
});
router.post('/createClient', async (req, res) => {
  try {
 
    const client = new Client({
      clientName: req.body.clientName,
      clientId:req.body.clientId,
      gst: req.body.gst,
      address:  req.body.address,
      phoneNumber: req.body.phoneNumber,
      CreatedAt: Date.now(),
      UpdatedAt: Date.now()
    })
    const finduser = await Client.findOne({ 'clientId': req.body.clientId , 'gst': req.body.gst});
    
    if (finduser) {
      res.status(401).send({ message: `clientId or GST is already exist` })
    }
    else {
      const newClient = await client.save();

      if (newClient) {
        res.send({
          _id: newClient.id, 
          clientName: newClient.clientName,
          clientId: newClient.clientId,
          gst: newClient.gst,
          address: newClient.address,
          phoneNumber: newClient.phoneNumber,
          CreatedAt:newClient.CreatedAt,
          UpdatedAt: newClient.UpdatedAt,
          
        });

      } else {
        res.status(401).send({ message: 'Invalid Client Data.' });
      }
    }
  }
  catch (error) {
    res.status(401).send({ message: error });
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


router.put('/updateclient',
  async (req, res) => {
    
    try {
      const user = await Client.findOne({clientId: req.body.clientId});
    if (user) {
      user.clientName= req.body.clientName || user.clientName,
      user.clientId= req.body.clientId || user.clientId,
      user.address = req.body.address || user.address;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.gst = req.body.gst || user.gst;
      user.CreatedAt = user.CreatedAt || Date.now();
      user.UpdatedAt = Date.now();
     
      const updatedUser = await user.save();

      res.send({
        _id: updatedUser._id,
        clientId: updatedUser.clientId,
        clientName: updatedUser.clientName,
        address: updatedUser.address,
        gst: updatedUser.gst,
        phoneNumber: updatedUser.phoneNumber,
        CreatedAt:updatedUser.CreatedAt,
        UpdatedAt: updatedUser.UpdatedAt,
      });

      return;
    }
    else{
      res.status(401).send({ message: 'Invalid Email or Password.' });
    }
    } catch (error) {
      res.send({ meg: error.message });
    }
    
   

  }
);



router.delete('/:id',
  async (req, res) => {
    const user = await Client.findById(req.params.id);
    if (user) {
      
      const deleteUser = await user.remove();
      res.send(deleteUser);
    } else {
      res.status(404).send({ message: 'User Not Found' });
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