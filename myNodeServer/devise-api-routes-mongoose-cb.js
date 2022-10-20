//var express = require('express');
import express from 'express';
const apiRouter = express.Router();

//NB: les api axios ou fetch servent à appeler des WS REST avec des Promises
//const axios = require('axios'); 
import axios from 'axios';// npm install -s axios

//var devise_dao_mongoose = require('./devise-dao-mongoose-cb');
import devise_dao_mongoose from './devise-dao-mongoose-cb.js';


var PersistentDeviseModel;
devise_dao_mongoose.initMongooseWithSchemaAndModel(
	function(InitializedPersistentDeviseModel) {
		PersistentDeviseModel=InitializedPersistentDeviseModel
	}
);

//exemple URL: http://localhost:8282/devise-api/private/reinit
apiRouter.route('/devise-api/private/reinit')
.get( function(req , res  , next ) {
	devise_dao_mongoose.init_devise_db(PersistentDeviseModel,
		function (doneAction){
	      res.send(doneAction)
	  });
});

//exemple URL: http://localhost:8282/devise-api/public/devise/EUR
apiRouter.route('/devise-api/public/devise/:code')
.get( /*async*/ function(req , res  , next ) {
	var codeDevise = req.params.code;
	/*
	try{
		let devise = await devise_dao_mongoose.getDeviseByCode(codeDevise);
		res.send(devise);
	}
	catch(error){
		res.status(404).send(error);
	}
	*/
	
	PersistentDeviseModel.findById( codeDevise ,
					function(err,devise){
						if(devise==null)
						   res.status(404).send({ err : 'not found'});
						else
					       res.send(devise);
				    });
	
	/*
	devise_dao_mongoose.getDeviseByCode(codeDevise)
	.then( (devise)=>{res.send(devise);})
	.catch((error)=>{ res.status(404).send(error);})
	*/
});


//exemple URL: http://localhost:8282/devise-api/public/devise-conversion?montant=50&source=EUR&cible=USD
/*apiRouter.route('/devise-api/public/devise-conversion')
.get( function(req , res  , next ) {
	let montant = Number(req.query.montant);
	let codeDeviseSource = req.query.source;
	let codeDeviseCible = req.query.cible;
	//on demande à mongodb les détails de la devise source
	PersistentDeviseModel.findOne( { _id : codeDeviseSource} , 
		                           function (err,deviseSource){	
		if(err!=null || deviseSource==null )
		  res.status(404).send({ message:"devise source pas trouvee"})	;	
		else					   						   
        //callback avec deviseSource si tout va bien   
		//2 nd appel pour récupérer les détails de la devise cible:
		PersistentDeviseModel.findOne( { _id : codeDeviseCible} , 
			function (err,deviseCible){  
			if(err!=null || deviseCible==null )
				res.status(404).send({ message:"devise cible pas trouvee"})	;
			else {
			 //callback avec deviseCible si tout va bien 					   
			 var montantConverti = montant * deviseCible.change / deviseSource.change;
			 res.send ( { montant : montant , 
				         source :codeDeviseSource , 
				         cible : codeDeviseCible ,
						 montantConverti : montantConverti});
			 }
			});
		});
})*/


/*
//exemple URL: http://localhost:8282/devise-api/public/devise-conversion?montant=50&source=EUR&cible=USD
apiRouter.route('/devise-api/public/devise-conversion')
.get( async function(req , res  , next ) {
	let montant = Number(req.query.montant);
	let codeDeviseSource = req.query.source;
	let codeDeviseCible = req.query.cible;
	//on demande à mongodb les détails des devises source et cible
    try{
         //appels via await au sein d'une fonction préfixée par async
		 //const deviseSource = await PersistentDeviseModel.findOne( { _id : codeDeviseSource} );
		 //const deviseSource = await devise_dao_mongoose.getDeviseByCode(codeDeviseSource);
		 //const deviseCible =  await PersistentDeviseModel.findOne( { _id : codeDeviseCible});
		 //const deviseCible =  await devise_dao_mongoose.getDeviseByCode(codeDeviseCible);
		 const [deviseSource,deviseCible]=await Promise.all([
			devise_dao_mongoose.getDeviseByCode(codeDeviseSource) ,
			devise_dao_mongoose.getDeviseByCode(codeDeviseCible)
		 ]);
		 let montantConverti = montant * deviseCible.change / deviseSource.change;
	    res.send ( { montant : montant , 
				    source :codeDeviseSource , 
				    cible : codeDeviseCible ,
				    montantConverti : montantConverti});
	}catch(e){
		res.status(404).send({ message:"devise inconnue pas trouvee qui existe pas"})	;
	}
	
});
*/
/*
//exemple URL: http://localhost:8282/devise-api/public/devise-conversion?montant=50&source=EUR&cible=USD
apiRouter.route('/devise-api/public/devise-conversion')
.get( function(req , res  , next ) {
	let montant = Number(req.query.montant);
	let codeDeviseSource = req.query.source;
	let codeDeviseCible = req.query.cible;
	let deviseSourceLocal = null;
	//on demande à mongodb les détails des devises source et cible
	//PersistentDeviseModel.findOne( { _id : codeDeviseSource} )
	devise_dao_mongoose.getDeviseByCode(codeDeviseSource)
	  .then((deviseSource)=>{deviseSourceLocal = deviseSource; 
		                     //return PersistentDeviseModel.findOne( { _id : codeDeviseCible} )
							 return devise_dao_mongoose.getDeviseByCode(codeDeviseCible)})
	  .then((deviseCible)=>{ let montantConverti = montant * deviseCible.change / deviseSourceLocal.change;
	                   res.send ( { montant : montant , 
				                   source :codeDeviseSource , 
				                   cible : codeDeviseCible ,
				                   montantConverti : montantConverti});
	   })
	  .catch((erreur)=>{ res.status(404).send({ message:"devise toujours pas trouvee"})	;});		                         
})*/
/*
apiRouter.route('/devise-api/public/devise-conversion')
.get( function(req , res  , next ) {
	let montant = Number(req.query.montant);
	let codeDeviseSource = req.query.source;
	let codeDeviseCible = req.query.cible;
	let deviseSourceRecuperee = null;
	devise_dao_mongoose.getDeviseByCode(codeDeviseSource)
	.then((deviseSource)=>{ deviseSourceRecuperee = deviseSource; 
		return devise_dao_mongoose.getDeviseByCode(codeDeviseCible);})
	.then((deviseCible)=>{
		let montantConverti = montant * deviseCible.change / deviseSourceRecuperee.change;
		res.send ({ montant : montant,
					source : codeDeviseSource,
					cible : codeDeviseCible,
					montantConverti : montantConverti})
	})
	.catch((erreur)=>{res.status(404).send({message:"devise pas trouvée " + erreur.err,});});
})*/

apiRouter.route('/devise-api/public/devise-conversion')
.get( async function(req , res  , next ) {
	let montant = Number(req.query.montant);
	let codeDeviseSource = req.query.source;
	let codeDeviseCible = req.query.cible;
	try{
		let deviseSource = await devise_dao_mongoose.getDeviseByCode(codeDeviseSource);
		let deviseCible = await devise_dao_mongoose.getDeviseByCode(codeDeviseCible);
		let montantConverti = montant * deviseCible.change / deviseSource.change;
			res.send ({ montant : montant,
						source : codeDeviseSource,
						cible : codeDeviseCible,
						montantConverti : montantConverti});
	}	
	catch (erreur){
		res.status(404).send({message:"devise pas trouvée " + erreur.err,});
	}
})

//exemple URL: http://localhost:8282/devise-api/public/devise (returning all devises)
//             http://localhost:8282/devise-api/public/devise?changeMini=1.05
apiRouter.route('/devise-api/public/devise')
.get( function(req , res  , next ) {
	var changeMini = Number(req.query.changeMini);
	var criteria=changeMini?{ change: { $gte: changeMini } }:{};
	PersistentDeviseModel.find(criteria,function(err,devises){
		   if(err) {
			   console.log("err="+err);
	       }
		   res.send(devises);
	});//end of find()
});

// http://localhost:8282/devise-api/private/role-admin/devise en mode post
// avec { "code" : "mxy" , "nom" : "monnaieXy" , "change" : 123 } dans req.body
apiRouter.route('/devise-api/private/role-admin/devise')
.post( function(req , res  , next ) {
	var nouvelleDevise = req.body;
	console.log("POST,nouvelleDevise="+JSON.stringify(nouvelleDevise));
	var persistentDevise = new PersistentDeviseModel(nouvelleDevise)
	persistentDevise.save ( 
		function(err,savedDevise){
			if(err==null)
			   res.send(savedDevise);
			 else 
				res.status(500).send({err : "cannot insert in database" , cause : err});
			 });
});

// http://localhost:8282/devise-api/private/role-admin/devise en mode PUT
// avec { "code" : "USD" , "nom" : "Dollar" , "change" : 1.123 } dans req.body
apiRouter.route('/devise-api/private/role-admin/devise')
.put( function(req , res  , next ) {
	var newValueOfDeviseToUpdate = req.body;
	console.log("PUT,newValueOfDeviseToUpdate="+JSON.stringify(newValueOfDeviseToUpdate));
	const filter = { _id : newValueOfDeviseToUpdate.code }
	PersistentDeviseModel.updateOne( filter , newValueOfDeviseToUpdate,
		function(err,opResultObject){
			//console.log(JSON.stringify(opResultObject))
			if(err || opResultObject.matchedCount == 0){
				res.status(404).json({ err : "no devise to update with code=" 
				                   + newValueOfDeviseToUpdate.code });
			}else{
					res.send(newValueOfDeviseToUpdate);
			 }
	});	//end of updateOne()
});

// http://localhost:8282/devise-api/private/role-admin/devise/EUR en mode DELETE
apiRouter.route('/devise-api/private/role-admin/devise/:code')
.delete( function(req , res  , next ) {
	var codeDevise = req.params.code;
	console.log("DELETE,codeDevise="+codeDevise);
	const filter = { _id : codeDevise }
	PersistentDeviseModel.deleteOne( filter,
		function(err,opResultObject){
			//console.log(JSON.stringify(opResultObject))
			if(err || opResultObject.deletedCount == 0)
				res.status(404).send({ err : "not found , no delete" } );
			 else
				 res.send({ deletedDeviseCode : codeDevise } );
		 });
});

//*************************** appel du web service REST data.fixer.io
//*************************** pour actualiser les taux de change dans la base de données



function callFixerIoWebServiceWithAxios(callbackWithDataAndError){

	//URL du web service a appeler:
	let  wsUrl = "http://data.fixer.io/api/latest?access_key=26ca93ee7fc19cbe0a423aaa27cab235" 
	//ici avec api-key de didier

	//type de réponse attendue:
	/*
	{"success":true,"timestamp":1635959583,"base":"EUR","date":"2021-11-03",
	"rates":{"AED":4.254663,"AFN":105.467869,..., "EUR":1 , ...}}
	*/

	axios.get(wsUrl)
	.then( (response) => {
		console.log("fixer.io response: " + JSON.stringify(response.data));
		if(response.status==200)
			callbackWithDataAndError(response.data,null);
		else
			callbackWithDataAndError(null,{ err : "error - "});
		})
	.catch((error) => {callbackWithDataAndError(null,{ err : "error - " + error});});
}

//http://localhost:8282/devise-api/private/refresh
apiRouter.route('/devise-api/private/refresh')
.get( function(req , res  , next ) {
	callFixerIoWebServiceWithAxios(function(respData,err){
		if(err) {
			console.error(JSON.stringify(err));
			res.status(500).send(err);//technical error
			return;
		  }
		if(respData && respData.success){
			//refresh database values:
			let newRates = respData.rates;
			//console.log("newRates="+newRates);
			for(let deviseKey in newRates){
				let deviseRate = newRates[deviseKey];
				//console.log(deviseKey + "-" + deviseRate);
				let devise = { code : deviseKey , change : deviseRate};
				switch(deviseKey){
					case "USD" : devise.nom = "Dollar"; break;
					case "JPY" : devise.nom = "Yen"; break;
					case "GBP" : devise.nom = "Livre"; break;
					default : devise = null;
				}
				if(devise!=null){
					const filter = { _id : devise.code }
					PersistentDeviseModel.updateOne( filter , devise,
						function(dbErr,opResultObject){
							console.log(JSON.stringify(opResultObject))									
						});	//end of updateOne()
					}
			}//end of for()
		} //end of if(respData.success)
		res.status(200).send(respData); //return / forward fixer.io results/response to say ok
	}); // end of callFixerIoWebServiceWithAxios callback
});//end of refresh route

//module.exports.apiRouter = apiRouter; //ancienne syntaxe common-js
//export { apiRouter }; //pour import * as deviseApiRoutes from './devise-api-routes-mongoose-cb.js';
export default { apiRouter }; //pour import deviseApiRoutes from './devise-api-routes-mongoose-cb.js';