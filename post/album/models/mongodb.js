var MongoClient = require("mongodb").MongoClient;

var closeDB;
//连接数据库
var __connectDB = function(callback){
     var url = "mongodb://127.0.0.1:27017/cym";
     MongoClient.connect(url,function(err,db){
        this.closeDB = db;
        callback(err,db);
     });
}
//选择集合
var __collection = function(collectionName,callback){
        __connectDB(function(err,db){
            callback(err,db.collection(collectionName));
        });
}
//插入操作
var _insert = function(collectionName,data,callback){
    __collection(collectionName,function(err,obj){
        obj.insert(data,function(err,result){
            if(err){
                callback(err,null);
                return;
            }
            this.closeDB.close();
            callback(null,result);
        });
   });
}

//查找数据
var _find = function(collectionName,conditionJson,pagecount = 10,page = 1,callback){
    if(arguments.length != 5){
        callback("缺少参数",null);
        return;
    }
    var json = conditionJson || {};
    var curr = page == 0 ? 1 : page;
    var skip = (page == 0) || (page == 1) ? 0 : parseInt(pagecount * (curr -1));
    __collection(collectionName,function(err,obj){
        var cursor = obj.find(json).limit(pagecount).skip(skip).sort({"publishTime":-1});
        var findResult = [];
        cursor.each(function(err,doc){
            if(err){
                callback(err,null);
                return;
            }
            if(doc != null){
                findResult.push(doc);
            }else{
                //遍历结束
                callback(null,findResult);
            }
        });
    })
}

//删除操作
var _del = function(collectionName,conditionJson,callback){
    var con = conditionJson || {};
    __collection(collectionName,function(err,obj){
        obj.deleteMany(con,function(err,result){
           callback(err,result);
        });

    });
}
//更新操作
var _update = function(collectionName,conditionJson,set,options,callback){
    var optionsJson = options || {};
    var setJson = set || {};
    __collection(collectionName,function(err,obj){
        obj.update(
            conditionJson,
            setJson,
            optionsJson,
            function(err,result){
                callback(err,result);
            }
        );
    });
}

module.exports = {_insert,_find,_del,_update};
// _update("cym",{"name" : "haha"},{$set:{"mood" : "very bad !!!!"}},{"multi" : true},function(err,result){
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log("success");
// });
// _del("cym",{"id" : "1"},function(err,result){
//     if(err){
//          console.log(err);
//          return;     
//         }   
//         console.log("success");
// });
// _find("cym",{},2,2,function(err,result){
//     if(err){
//         console.log(err);
//         return;
//     }
//     console.log(result);
// });
//_insert("cym",{'id':'1',"name":"haha","age":45});
//暴露module的方法
//module.exports = {_insert,_find};
//return;
// var _cols = function(clos){
//     __connectDB(function(err,db){
//         db.collection(clos)
//     });
// }

// var insert = function(clos,data){

// }