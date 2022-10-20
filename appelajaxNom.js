var traiterReponse = function (response){
    //response ici au format "JSON string"
    //var zoneResultat = 
    document.getElementById("spanRes").innerHTML=response;
    console.log("ke sd")
    //var jsDevise = JSON.stringify(response);
   // zoneResultat.innerHTML=response; //ou .rate
}

function onSearchDevise(){
    var zoneSaisieNom = document.getElementById("nom");
    var nom = zoneSaisieNom.value;
    console.log("nom="+nom);
    var urlWsGet="../form-api/public/form/"+nom;
    makeAjaxGetRequest(urlWsGet,traiterReponse);
    //appel non bloquant (asynchrone)
    //...
}