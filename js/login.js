var s,
myLogin = {

settings: {
            servletInscription: "Inscription",
            servletConnexion:"Connexion",
            signed:false,
            sign_request: false,
            pseudo:"",
            pswd:"",
            grade:"",
            dataAuth:"",
            dataConn:"",


          },


/**********************************************************************************
      init(): Lance l'initialisation des fonctions 
              liées au log et aux boutons

                    return:none
***********************************************************************************/         
  

init: function() {
        s = this.settings;
        myLogin.init_sign();
        myLogin.init_log();
      },

/**********************************************************************************
      init_sign:  Met en place les animations du formulaire

                    return:none
***********************************************************************************/        

init_sign: function() {

        /* Récupération des éléments de la page*/
        var choose =document.getElementsByClassName("onoffswitch")[0];
        var btn1=document.getElementById('sign');
        var btn2=document.getElementById('submit');
        var login=document.getElementById('login');



        /* Ajout du lisener sur le bouton SignIn*/
        btn1.addEventListener('click', function(e) {

            if(s.sign_request){
                myLogin.request_sign();
                s.sign_request=false;
            }


            // Si le  bouton n'a jamais été cliqué
            if(!s.signed)
            {

                /*Animation SignIn:unchecked*/
                login.style.transition= "min-height 0.7s ease ";
                login.style.minHeight="480px";

                btn1.style.transition= "transform 0.7s ease ";
                btn1.style.webkitTransition="-webkit-transform 0.7s ease ";
                btn1.style.transform="translateY(50px)";
                btn1.style['-webkit-transform'] = "translateY(50px)";



                btn2.style.transition= "transform 0.7s ease ";
                btn2.style.webkitTransition="-webkit-transform 0.7s ease ";
                btn2.style.transform="translateY(50px)";
                btn2.style['-webkit-transform'] = "translateY(50px)";


                choose.style.transition= "opacity 2s ease,transform 1s ease";
                choose.style.WebkitTransition = 'opacity 1s'; 
                choose.style.webkitTransition="-webkit-transform 0.7s ease";
                choose.style.transform="translateY(20px)";
                choose.style['-webkit-transform'] = "translateY(20px)";
                choose.style.opacity="1";

                
                s.sign_request=true;
                

            }

            // Si le bouton a déjà été cliqué
            else{




                /*Animation SignIn:checked*/
                login.style.transition= "min-height 0.7s ease ";
                login.style.minHeight="448.8px";


                btn1.style.transition= "transform 0.7s ease ";
                btn1.style.webkitTransition="-webkit-transform 0.7s ease ";
                btn1.style.transform="translateY(0)";
                btn1.style['-webkit-transform'] = "translateY(0)";



                btn2.style.transition= "transform 0.7s ease ";
                btn2.style.webkitTransition="-webkit-transform 0.7s ease ";
                btn2.style.transform="translateY(0)";
                btn2.style['-webkit-transform'] = "translateY(0)";

                choose.style.display="block";


                choose.style.transition= "opacity 0.8s ease,transform 1s ease";
                choose.style.WebkitTransition = 'opacity 1s';
                choose.style.webkitTransition="-webkit-transform 0.7s ease ";
                choose.style.transform="translateY(0)";
                choose.style['-webkit-transform'] = "translateY(0)";
                choose.style.opacity="0";
                
                s.signed=false;
                
            }
        
         });

    },

/**********************************************************************************
      request_sign():  Requete d'inscription 

                    return:none
***********************************************************************************/        



request_sign: function (){

            s.pseudo=document.getElementsByTagName('input')[0].value;
            s.pswd=document.getElementsByTagName('input')[1].value;


            var grade=document.getElementById('myonoffswitch');

            if(grade.checked===true){

                s.grade=0;

            }
            else s.grade=1;
              
              // Requete POST
              $.post(s.servletInscription,
                        {
                            pseudo: s.pseudo,
                            pswd: s.pswd,
                            grade: s.grade,   ///0->membre | 1->Admin
                        },
                        function(data,status){
                            
                            if(data.auth===1){
                                s.dataAuth=data;
                                alert("Success Registration");
                                s.signed=true;
                            }
                            else if(data.auth===0) alert(data.err);
                            else alert("Aknown registration error");
                        }  
                ); 
},


/**********************************************************************************
      request_log: Requete d'inscription

                    return:none
***********************************************************************************/        

request_log: function(){
    s.pseudo=document.getElementsByTagName('input')[0].value;
    s.pswd=document.getElementsByTagName('input')[1].value;

    $.post(s.servletConnexion,
        {
            pseudo: s.pseudo,
            pswd: s.pswd,
            
        },

        function(data,status){
            
            if(data.auth===1){
                s.dataConn=data;
                //alert("Login Successfull");
                document.location.href="main.html";
                
            }
            else if(data.auth===0) alert(data.err);
            else alert("Aknown Login error");
        }  
    ); 

},

init_log: function(){

    var log=document.getElementById('submit');
    log.addEventListener('click', myLogin.request_log);



}




};


//Lorsque document est ready, initialisation du widget myRefresher
$(document).ready(myLogin.init());



       