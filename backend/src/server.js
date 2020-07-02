const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("../models/user");
const Farmer = require("../models/farmer");
const Enterprise = require("../models/enterprise");
const Garden = require("../models/garden");
const Seed = require("../models/seed");
const ArticlInStorage = require("../models/articlInStorage");
const Articl = require("../models/articl");
const Order = require("../models/order");

const app = express();

mongoose.connect("mongodb://localhost/agriculture").then(()=>{
    console.log("Connection established!")
}).catch(()=>{
    console.log("Connection failed");
});

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.post("/logIn", (req, res)=>{
    let data = req.body;
    User.find({username: data.username}).then((doc =>{
        if(doc.length == 0){
            res.json({
                message: 'No user',
                user: null
            })
        }
        else{
            if(!doc[0].approvedByAdmin){
                res.json({
                    message: 'User not approved',
                    user: null
                })
            }
            else{
                if(doc[0].password == data.password){
                    res.json({
                        message: 'Ok',
                        user: doc[0]
                    })
                }
                if(doc[0].password != data.password){
                    res.json({
                        message: 'Wrong password',
                        user: null
                    })
                }
            }
            
        }
    }))
});

app.post("/getUser", (req, res)=>{
    let username = req.body.username;
    let type = req.body.type;

    switch(type){
        case 0:
            User.find({username: username}).then(doc=>{
                let user = doc[0];
                res.json({
                    user: user
                });
            });
            break;
        case 1:
            Enterprise.find({username: username}).then(doc=>{
                let user = doc[0];
                res.json({
                    user: user
                });
            });
            break;
        case 2:
            Farmer.find({username: username}).then(doc=>{
               let user = doc[0];
               res.json({
                   user: user
               });
            })
            break;
    }
  
});

app.post("/getUsername", (req, res)=>{
  let username = req.body.username;
 
  User.find({username: username}).then(doc=>{
      let user = doc[0];
      res.json({
          user: user
      });
  });
    
});

app.get("/getAllUsers", (req, res)=>{
    User.find().then(doc =>{
        res.json({
            users: doc
        })
    })
});

app.post("/getGardensByOwner", (req, res)=>{
    let owner = req.body.owner;
    Garden.find({owner: owner}).then(doc =>{
        res.json({
            gardens: doc
        })
    })
});

app.post("/deleteUser", (req, res)=>{
    let username = req.body.username;
    User.deleteOne({username: username}, (err)=>{
        if(err) console.log(err);
    });
});

app.post("/approveUser", (req, res)=>{
    let username = req.body.username;

    User.update({username: username}, {approvedByAdmin: true}).then(doc=>{
        console.log(doc);
    })
});

app.post("/addNewUser", (req, res)=>{
    let user = req.body.user;
    let msg = "";

    User.find({username: user.username}).then(doc=>{
        if(doc.length == 0){
            const newUser = User.create(user);
            msg = "Ok";
        }
        else{
            msg = "Not ok"
        }

        res.json({
            message: msg
        });
    });
 
});

app.post("/addNewFarmer", (req, res)=>{
    let farmer = req.body.user;
    Farmer.create(farmer);
});

app.post("/addNewEnterprise", (req, res)=>{
    let enterprise = req.body.user;
    Enterprise.create(enterprise);
});

app.post("/updateEnterprise", (req, res)=>{
    console.log("EditEnteprise");
    let username = req.body.username;
    let enterprise = req.body.enterprise;
    console.log(enterprise);
    Enterprise.findOneAndUpdate({username: username}, {
        companyName: enterprise.companyName, 
        email: enterprise.email,  
        dateOfCreation: enterprise.dateOfCreation,
        address: enterprise.address, 
        email:  enterprise.email}, (err)=>{
            if(err == null){
                res.json({
                    message: 'Ok'
                });
            }
            else{
                res.json({
                    message: 'Not ok'
                });
            }
    });
});

app.post("/updateFarmer", (req, res)=>{
    let username = req.body.username;
    let farmer = req.body.farmer;
    Farmer.findOneAndUpdate({username: username}, {
      name: farmer.name,
      surname: farmer.surname,
      dateOfBirth: farmer.dateOfBirth,
      placeOfBirth: farmer.placeOfBirth,
      phone: farmer.phone,
      email: farmer.email}, (err)=>{
            if(err == null){
                res.json({
                    message: 'Ok'
                });
            }
            else{
                res.json({
                    message: 'Not ok'
                });
            }
    });
});

app.post("/incWaterInGarden", (req, res)=>{
    console.log("inc water");
    let owner = req.body.owner;
    let gardenName = req.body.garden;
    Garden.findOneAndUpdate({owner: owner, name: gardenName},{$inc:{water: 1}}).then(data=>[

    ]);
});

app.post("/decWaterInGarden", (req, res)=>{
    let owner = req.body.owner;
    let gardenName = req.body.garden;
    Garden.findOneAndUpdate({owner: owner, name: gardenName},{$inc:{water: -1}}).then(data=>[

    ]);
});

app.post("/incTmpInGarden", (req, res)=>{
    let owner = req.body.owner;
    let gardenName = req.body.garden;
    Garden.findOneAndUpdate({owner: owner, name: gardenName},{$inc:{temperature: 1}}).then(data=>[

    ]);
});

app.post("/decTmpInGarden", (req, res)=>{
    let owner = req.body.owner;
    let gardenName = req.body.garden;
    Garden.findOneAndUpdate({owner: owner, name: gardenName},{$inc:{temperature: -1}}).then(data=>[

    ]);
});

app.post("/getAllSeeds", (req, res)=>{
    let owner = req.body.owner;
    let gardenName = req.body.garden;
    Seed.find({owner: owner, name: gardenName}).then(doc=>{
        res.json({
            seeds: doc
        });
    });
});

app.post("/getGarden", (req, res)=>{
    let owner = req.body.owner;
    let gardenName = req.body.garden;
    
    Garden.find({owner: owner, name: gardenName}).then(doc=>{
        res.json({
            garden: doc[0]
        })
    });
});

app.post("/getAllGardensSeeds", (req, res)=>{
    let owner = req.body.owner;
    let gardenName = req.body.garden;
    
    Seed.find({owner: owner, garden: gardenName}).then(doc=>{
        res.json({
            seeds: doc
        })
    });
});

app.post("/deleteSeedFromGarden", (req, res)=>{
  let id = req.body.id;
  let o = mongoose.Types.ObjectId(id);
  Seed.findByIdAndDelete(o).then(doc=>{
  });
});

app.post("/getStorageArticles", (req, res)=>{
  let gardenId = req.body.gardenId;
  let o = mongoose.Types.ObjectId(gardenId);
  ArticlInStorage.find({gardenId: o}).then(data=>{
    res.json({
      articls: data
    });
  })
});

app.get("/getAllArticls", (req, res)=>{
    Articl.find().then(data=>{
        res.json({
            articls: data
        })
    });
});

app.post("/createOrder", (req, res)=>{
  let toPut = req.body.order;
  console.log("CreateOrder -> ", toPut)
  Order.create(toPut).then(doc=>{
      res.json({
          msg: "Ok"
      });
  })
});

app.post("/getOrdersFromGarden", (req, res)=>{
  let garden = req.body.gardenId;

  Order.find({gardenId: garden}).then(doc=>{
    res.json({
      orders: doc
    })
  })
});

app.post("/getArticlById", (req, res)=>{
  let id = req.body.articlId;
  // let o = mongoose.Types.ObjectId(id);
  console.log(id);
  Articl.findById(id).then(doc=>{
    console.log(doc);
    res.json({
      articl: doc
    })
  })
});

app.post("/cancelOrder", (req, res)=>{
  let id = req.body.orderId;
  // let o = mongoose.Types.ObjectId(id);
  console.log(id);
  Order.findByIdAndDelete(id).then(doc=>{
    console.log(doc);
  })
});

app.post("/getEnterpriseById", (req, res)=>{
  let id = req.body.id;
  // let o = mongoose.Types.ObjectId(id);
  console.log(id);
  Enterprise.findById(id).then(doc=>{
    res.json({
      enterprise: doc
    });
  })
});

app.post("/getOrdersFromEnterprise", (req, res)=>{
  let enterpriseId = req.body.enterpriseId;
  // let o = mongoose.Types.ObjectId(id);
  console.log(id);
  let articlsRes = [];
  let ordersRes = [];

  Order.find().then(orders=>{
    for(let i = 0; i < orders.length; i++){
      let articlsId = orders['articlIds'];
      for(let j = 0; j < articlsId.length; j++){
        Articl.find({_id: articlsId[j], enterpriseId: id}).then(doc=>{
          articlsRes.push(doc);
          ordersRes.push(orders[i]);
        })
      }
    }
 
    console.log("Articls -> ", articlsRes);
    console.log("Orders -> ", ordersRes);

    res.json({
      orders: ordersRes,
      articls: articlsRes
    })
  })
});


app.listen(4000, () => console.log(`Express server running on port 4000`));