//var mongoose = require('mongoose');  
import mongoose from 'mongoose';// npm install -s mongoose

//process.env.MONGO_DB_URL recupére la valeur de la variable d'environnement
//MONGO_DB_URL si elle existe
//set MONGO_DB_URL=mongodb://localhost:27017 sous windows (dans .bat)
//export MONGO_DB_URL=mongodb://localhost:27017 sous linux ou mac (dans .sh)
var mongoDbUrl = process.env.MONGO_DB_URL || 'mongodb://127.0.0.1:27017'; //by default
// url: mongodb://username:password@serverName:numeroPort
//var mongoDbUrl = process.env.MONGO_DB_URL || 'mongodb://superuser:motdepasse@127.0.0.1:27017'
var deviseSchema;//mongoose Shcema (structure of mongo document)
var PersistentDeviseModel; //mongoose Model (constructor of persistent PersistentDeviseModel)

var initMongooseWithSchemaAndModel = function(callbackWithPersistentDeviseModel) {
    mongoose.connect(mongoDbUrl, {useNewUrlParser: true, 
                                  user : "" , pass : "" ,
                                /*user: "username_telque_superuser" , pass : "motdepasse",*/
	                              useUnifiedTopology: true , 
								  dbName : 'devise_db'});//équivalent à "use devise_db" de mongo_shell
    const db = mongoose.connection;
    db.on('error' , function() { 
	     console.log("mongoDb connection error = " + 
		              " for dbUrl=" + mongoDbUrl )});
    db.once('open', function() {
      // we're connected!
      console.log("Connected correctly to mongodb database" );
      deviseSchema = new mongoose.Schema({
        _id: { type : String , alias : "code" } ,
        nom: String,
        change : Number
      });
      deviseSchema.set('id',false); //no default virtual id alias for _id
      deviseSchema.set('toJSON', { virtuals: true , 
                                   versionKey:false,
                                   transform: function (doc, ret) {   delete ret._id  }
                                 });
      //"Devise" model name is "devises" collection name in mongoDB test database
      //par convention de noms la collection a le nom du modèle
      //sans la majuscule et avec un s en plus à la fin
      PersistentDeviseModel = mongoose.model('Devise', deviseSchema);
      
      //console.log("mongoose PersistentDeviseModel : " + PersistentDeviseModel );
      if(callbackWithPersistentDeviseModel)
         callbackWithPersistentDeviseModel(PersistentDeviseModel);
    });
}


function init_devise_db(PersistentDeviseModel,callbackWithAction){
      const deleteAllFilter = { }
      PersistentDeviseModel.deleteMany( deleteAllFilter, function (err) {
        if(err) console.log(JSON.stringify(err));
        //insert elements after deleting olds
        (new PersistentDeviseModel({ code : "EUR" , nom : "Euro" , change : 1.0})).save();
        (new PersistentDeviseModel({ code : "USD" , nom : "Dollar" , change : 1.1})).save();
        (new PersistentDeviseModel({ code : "GBP" , nom : "Livre" , change : 0.9961})).save();
        (new PersistentDeviseModel({ code : "JPY" , nom : "Yen" , change : 123.7})).save();
        callbackWithAction({action:"devises collection re-initialized in mongoDB database"})
  });
}
/*


//valeur de retour : Promise<Devise>
function getDeviseByCriteria(critere){
   return new Promise(
     (resolve,reject)=>{ 
      PersistentDeviseModel.findOne( critere , 
            // callback de mongoose
            (err,devise)=>{	
              if(err!=null || devise==null )
                  reject({ message:"devise  pas trouvee"})	;	
              else
                  resolve(devise);
            });//end of findOne()
      }
   );//end of Promise()
}



//valeur en retour Promise<Devise>
function getDeviseByCode(codeDevise){
  return new Promise ((resolve,reject)=> {
    PersistentDeviseModel.findById( codeDevise ,
      function(err,devise){
      if(err || devise==null)
           reject({ err : 'not found'});
      else
           resolve(devise);
     });
  });
}
*/

function getDeviseByCode(codeDevise){
  return new Promise((resolve,reject)=>{
    PersistentDeviseModel.findById(codeDevise, (err,devise)=>{
      if(err|| devise == null){
        reject({err:"pas trouvé"});
      }
      else{
        resolve(devise);
      }
    });
  });
}


//module.exports.initMongooseWithSchemaAndModel = initMongooseWithSchemaAndModel;
//module.exports.init_devise_db = init_devise_db;
//export default { initMongooseWithSchemaAndModel , init_devise_db }
export default { initMongooseWithSchemaAndModel , init_devise_db , getDeviseByCode}
