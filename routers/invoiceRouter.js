import express from 'express';
import Invoice from '../models/invoiceModel';

// import data from '../data.js';
import bcrypt from 'bcrypt';

import { getToken, isAuth, isAdmin } from '../util';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const designlist = await Invoice.find().populate('clientName')
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

router.get('/:id', async (req, res) => {
  try {
    const user = await Stock.findById(req.params.id).populate('client').populate('design');

    //console.log(req.params.id+"new ed:"+user )
    if (user) {
      res.send(user);
      return;
    }
    res.status(401).send({ message: 'Invalid design.' });

  } catch (error) {
    console.log(error);
  }
});
router.post('/createInvoice', async (req, res) => {
  console.log(req.body);
  try {

    const invoice = new Invoice({
      invoiceNo: req.body.invoiceNo,
      invoiceDate: req.body.invoiceDate,
      invoiceDiscount: req.body.invoiceDiscount,
      invoiceStatus: req.body.invoiceStatus,

      gst: req.body.gst,
      TotalAmount: req.body.TotalAmount,
      taxamount: req.body.taxamount,
      invoiceAmount: req.body.invoiceAmount,
      clientName: req.body.clientName._id,
      Items: req.body.Items,
      CreatedAt: Date.now(),
      UpdatedAt: Date.now()
    })
    const findInvoice = await Invoice.findOne({ 'challanNo': req.body.challanNo });

    if (findInvoice) {
      res.status(401).send({ message: `Invoice is already exist & ${findInvoice} ` })
    }
    else {
      const newStock = await invoice.save();

      if (newStock) {
        res.send({
          newStock
        });

      } else {
        res.status(401).send({ message: 'Invalid invoice Data.' });
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


router.put('/updateStock',
  async (req, res) => {

    try {
      const stock = await Stock.findById(req.body._id );
      if (stock) {

          stock.challanNo = req.body.challanNo || stock.challanNo,
          stock.challanDate = req.body.challanDate || stock.challanDate,
          stock.stockQuantity = req.body.stockQuantity || stock.stockQuantity,
          stock.Short = req.body.Short || stock.Short,
          stock.Remark = req.body.Remark || stock.Remark,
          stock.clientName = req.body.clientName.clientName || stock.clientName.clientName,
          stock.clientId = req.body.clientId || stock.clientId,
          stock.designName = req.body.designName.designName || stock.designName.designName,
          stock.designId = req.body.designId || stock.designId,
          stock.client = req.body.clientName._id || stock.clientName._id,
          stock.design = req.body.designName._id || stock.designName._id,
          stock.CreatedAt = stock.CreatedAt || Date.now(),
          stock.UpdatedAt = Date.now()
        const updatedStock = await stock.save();
        if (updatedStock) {
          res.send({
            _id: updatedStock.id,
            challanNo: updatedStock.challanNo,
            challanDate: updatedStock.challanDate,
            stockQuantity: updatedStock.stockQuantity,
            Short: updatedStock.Short,
            Remark: updatedStock.Remark,
            designName: updatedStock.designName,
            designId: updatedStock.designId,
            clientId: updatedStock.clientId,
            clientName: updatedStock.clientName,
            designRate: updatedStock.designRate,
            CreatedAt: updatedStock.CreatedAt,
            client: updatedStock.client,
            design: updatedStock.design,
            UpdatedAt: updatedStock.UpdatedAt,
          });
        } else {
          console.log(stock);
          res.status(401).send({ message: 'Invalid stock Data.' });
        }
        return;
      }
      else {
        console.log(stock);
        res.status(401).send({ message: 'Invalid design or client.' });
      }
    } catch (error) {
      res.send({ meg: error.message });
    }



  }
);



router.delete('/:id',
  async (req, res) => {
    const design = await Stock.findById(req.params.id);
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