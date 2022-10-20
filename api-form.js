import express from 'express';
const apiRouter = express.Router();

function reponse(nom){
	var resp="Bonjour "+nom+ " vous etes bien matinal..";
console.log("response"+nom);
	return resp;
}
apiRouter.route('/form-api/public/form/:nom')
.get( function(req , res , next ) {
    let nom = req.params.nom;
    console.log(nom);
  var resp=reponse(nom);
console.log(resp)
  res.send(resp);
});
export default { apiRouter };//pour import as deviseApiRoutes from './devise-api-routes-memory.js';
