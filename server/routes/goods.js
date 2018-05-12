var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
mongoose.connect('mongodb://127.0.0.1:27017/db_demo');
mongoose.connection.on("connected",function(){
  console.log("连接成功");
})

mongoose.connection.on("error",function(){
  console.log("连接失败");
})

mongoose.connection.on("disconnected",function(){
  console.log("断开");
})

router.get('/',function(req,res,next){
  let page=parseInt(req.param('page'));
  let pageSize=parseInt(req.param('pageSize'));
  let priceLevel=req.param('priceLevel');
  let sort=req.param('sort');
  let skip=(page-1)*pageSize;
  let priceGt='',priceLte='';
  let params={};
  if(priceLevel!='All'){
    switch(priceLevel){
      case'0':priceGt=0;priceLte=100;break;
      case'1':priceGt=100;priceLte=500;break;
      case'2':priceGt=500;priceLte=1000;break;
      case'3':priceGt=1000;priceLte=5000;break;
    }
    params={
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  
  let goodsModel=Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});  

  goodsModel.exec(function(error,doc){
  	if(error){
  		res.json({
  			status:'1',
  			msg:error.message
  		})
  	}else{
  		res.json({
  			status:'0',
  			msg:'',
  			result:{
  				count:doc.length,
  				list:doc
  			}
  		})
  	}
  })
});
router.post('/addCart',function(req,res,next){
  let userId='10001',productId=req.body.productId;
  let  User=require('../models/user');
  User.findOne({userId:userId},function(error,userDoc){
    if(error){
      res.json({
        status:'1',
        msg:error.message
      })
    }else{
      console.log('userDoc:'+userDoc);
      if(userDoc){
        let goodsItem='';
        userDoc.cartList.forEach((item)=>{
          if(item.productId==productId){
            goodsItem=item;
            item.productNum++;
          }
        });
        if(goodsItem){
          userDoc.save(function(error2,doc2){
                  if(error2){
                    res.json({
                      status:'1',
                      msg:error2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
                    })
                  }
                })
        }else{
          Goods.findOne({productId:productId},function(error1,doc){
            if(error1){
              res.json({
                status:'1',
                msg:error1.message
              })
            }else{
              if(doc){
                doc.productNum=1;
                doc.checked=1;
                console.log("aaa:"+doc);

                userDoc.cartList.push(doc);
                userDoc.save(function(error2,doc2){
                  if(error2){
                    res.json({
                      status:'1',
                      msg:error2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
                    })
                  }
                })
              }
            }
          })
        }
      }
      
    }
  })
})

module.exports = router;
