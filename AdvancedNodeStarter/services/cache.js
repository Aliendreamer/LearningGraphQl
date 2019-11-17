const mongoose = require("mongoose");
const redis = require("redis");
const util = require("util");

const redisUrl ='redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;


mongoose.Query.prototype.cache = function (options={}){
    this.useCache = false;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
}


mongoose.Query.prototype.exec = async function(){
  
  if(!this.useCache){
    return exec.apply(this,arguments);
  }
  const key = Object.assign({},this.getQuery(),{
       collection:this.mongooseCollection.name
   });
   const redisKey = JSON.stringify(key);
   const cacheValue = await client.hget(redisKey);
   if(cacheValue){
     const doc = JSON.parse(cacheValue);
     const cached = Array.isArray(doc)
     ? doc.map(x=> new this.model(x)) 
     : new this.model(doc);
    return  cached;
   }

   const result = await  exec.apply(this,arguments); 
   client.hset(this.hashKey,redisKey,JSON.stringify(result),"EX",60);
   return result;  
}


module.exports = {
  clearHash(hashKey){
      client.del(JSON.stringify(hashKey));
  }
}