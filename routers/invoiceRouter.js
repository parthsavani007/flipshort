import express from 'express';
import Invoice from '../models/invoiceModel';

// import data from '../data.js';
import bcrypt from 'bcrypt';

import { getToken, isAuth, isAdmin } from '../util';
import Stock from '../models/stockModel';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const invoicelist = await Invoice.find().populate('invoiceTo');
    const overdue = invoicelist.filter((item) => new Date(item.dueDate) < new Date() && item.status == 'unpaid')
    overdue.map(async (option) => {
      option.status = 'overdue';
      try {
        const newStock = await option.save();
      } catch (error) {
        console.log(error)
      }
    });
    const finalList = await Invoice.find().populate('invoiceTo');
    const data = finalList.map((option) => 
      option.items.map(({ challanNo }) => challanNo)
    )
    
    if (finalList) {
      res.send(
        finalList
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
    const user = await Invoice.findById(req.params.id).populate('invoiceTo');

    //console.log(req.params.id+"new ed:"+user )
    if (user) {
      res.send(user);
      return;
    }
    res.status(401).send({ message: 'Invalid invoice.' });

  } catch (error) {
    console.log(error);
  }
});
router.post('/createInvoice', async (req, res) => {
  try {

    const invoice = new Invoice({
      invoiceNo: req.body.invoiceNo,
      invoiceDate: req.body.invoiceDate,
      dueDate: req.body.dueDate,
      discount: req.body.discount,
      status: req.body.status,
      TotalAmount: req.body.TotalAmount,
      invoiceAmount: req.body.invoiceAmount,
      invoiceTo: req.body.invoiceTo._id,
      items: req.body.items,
      CreatedAt: Date.now(),
      UpdatedAt: Date.now()
    })
    const findInvoice = await Invoice.findOne({ 'invoiceNo': req.body.invoiceNo });

    if (findInvoice) {
      res.status(401).send({ message: `Invoice is already exist & ${findInvoice} ` })
    }
    else {
      const newStock = await invoice.save();
      const data = newStock.items.map(async (option) => {
        const challan = await Stock.findOneAndUpdate({"challanNo": option.challanNo},{
          $set: {
               "isInvoiced": true
           }
        },
        { new: true });
        console.log(challan);
      })
    //   const data = newStock.map((option) => 
    //   option.items.map(({ challanNo }) => challanNo)
    // )
      
      //   const challan = await Stock.find({'challanNo': option.challanNo})
      //   console.log(challan);
      // })
      if (newStock) {
        console.log(newStock);
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


router.put('/updateInvoice',
  async (req, res) => {
    try {
      const invoice = await Invoice.findById(req.body._id);
      if (invoice) {

        invoice.invoiceNo = req.body.invoiceNo || invoice.invoiceNo;
        invoice.invoiceDate = req.body.invoiceDate || invoice.invoiceDate;
        invoice.status = req.body.status || invoice.status;
        invoice.items = req.body.items || invoice.items;
        invoice.dueDate = req.body.dueDate || invoice.dueDate;
        invoice.invoiceTo = req.body.invoiceTo || invoice.invoiceTo;
        invoice.discount = req.body.discount;
        invoice.invoiceAmount = Number(req.body.invoiceAmount) || Number(invoice.invoiceAmount);
        invoice.TotalAmount = Number(req.body.TotalAmount) || Number(invoice.TotalAmount);
        invoice.CreatedAt = invoice.CreatedAt || Date.now(),
          invoice.UpdatedAt = Date.now();
        const updatedInvoice = await invoice.save();
        const data = updatedInvoice.items.map(async (option) => {
          const challan = await Stock.findOneAndUpdate({"challanNo": option.challanNo},{
            $set: {
                 "isInvoiced": true
             }
          },
          { new: true });
          console.log(challan);
        });
        if (updatedInvoice) {
          res.send({
            updatedInvoice
          });
        } else {
          res.status(401).send({ message: 'Invalid updatedInvoice Data.' });
        }
        return;
      }
      else {
        console.log(invoice);
        res.status(401).send({ message: 'Invalid invoice or client.' });
      }
    } catch (error) {
      res.send({ meg: error.message });
    }



  }
);



router.delete('/:id',
  async (req, res) => {
    const design = await Invoice.findById(req.params.id);
    if (design) {
      const data = design.items.map(async (option) => {
        const challan = await Stock.findOneAndUpdate({"challanNo": option.challanNo},{
          $set: {
               "isInvoiced": false
           }
        },
        { new: true });
        console.log(challan);
      });
      const deleteDesign = await design.remove();
      
      res.send({deleteDesign });
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