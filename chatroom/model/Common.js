/**
 * 操作数据库的方法
 */
//查找数据
var find = function(collectionName,schema,json,callback){
    var collectionName = collectionName || "";
    var schema = schema || {};
    var json   = json || {};

    schema.methods.findData = function(callback){
        return this.model(collectionName).find(json, callback);
    }
}

var insert2 = function(collectionName,json,callback){
    //console.log(66666666666666);return;
    return this.model(collectionName).insert(json,callback);
}

//插入数据
var insert = function(collectionName,schema,json,callback){
    var collectionName = collectionName || "";
    var schema = schema || {};
    var json   = json || {};
   // console.log(schema);

   // return mongoose[schema].model(collectionName).insert(json,callback);
  // (function iterator(){
    schema.methods.insertData = function(callback){
         console.log(8769879);
        return this.model(collectionName).insert(json,callback);
    }

   //})();

}

//删除数据
var del = function(collectionName,schema,json,callback){
    var collectionName = collectionName || "";
    var schema = schema || {};
    var json   = json || {};

    schema.methods.deleteData = function(callback){
        return this.model(collectionName).remove(json,callback);
    }
}

//更新数据
var update = function(collectionName,schema,json,set,options,callback){
    var collectionName = collectionName || "";
    var schema = schema || {};
    var json   = json || {};
    var set = set || {};
    var options = options || {};

    //(function iterator(){
        schema.methods.updateDate = function(callback){
        return this.model(collectionName).findOneAndUpdate(
            json,
            set,
            options,
            callback
        );
    }
   // })();
    
}
module.exports = {find,insert,del,update,insert2};