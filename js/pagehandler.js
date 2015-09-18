/*
    myHandler: Gere les aspects dynamiques de la page
    
 */

var u, myHandler = {
	settings : {
		timerRefresh : 2000,

		srcLock : "img/unlocked.gif",
		srcUnlock : "img/locked.png",
		servletDeco : "Deconnexion",
		servletLock : "Lock",

		user : {
			servlet : "Userinfo",
			login : "User",
			auth : "",
			grade : "",
			lock : false,
			lockBuffer : false,
			lockedUser : ""
		},

	},

	/***************************************************************************
	 * init(): Lance l'initialisation des fonctions liées aux listener et au
	 * log
	 * 
	 * return:none
	 **************************************************************************/

	init : function() {
		u = this.settings;
		myHandler.refresher();
		myHandler.listener();
		myHandler.initLog();

	},

	/***************************************************************************
	 * initLog(): Initialise les propriétés de log
	 * 
	 * return:none
	 **************************************************************************/

	initLog : function() {
		var lock = document.getElementsByClassName("header-unlock")[0];
		lock.title = "You're UnLock !";
		lock.src = u.srcUnlock;
		u.user.lock = false;

	},

	/***************************************************************************
	 * refresher(): Fonction refresh régulier data canvas
	 * 
	 * return:none
	 **************************************************************************/

	refresher : function() {
		myHandler.displayInfo();
		myHandler.checkUser();
		setTimeout(myHandler.refresher, u.timerRefresh);
	},

	/***************************************************************************
	 * checkUser(): Récupération des données utilisateurs
	 * 
	 * return: none
	 **************************************************************************/

	checkUser : function() {

		$.post(u.user.servlet, {

		}, function(data, status) {

			if (data.userConnected) {
				s.msgConsole = "None";
				u.user.login = data.pseudo;
				u.user.grade = data.fullNameRank;
				u.user.auth = true;
				u.user.lockedUser = data.lockedUserPseudo;

				if (u.user.lockedUser == u.user.login
						&& u.user.lockedUser != null) {
					u.user.lock = 1;
					// alert(u.user.lockedUser + " " + u.user.login);
				} else {
					u.user.lock = 0;
				}

				var lock = document.getElementsByClassName("header-unlock")[0];

				if (u.user.lock != u.user.lockBuffer) {
					if (u.user.lock) {
						lock.title = "You're Lock !";
						lock.src = u.srcLock;
					} else {
						lock.title = "You're UnLock !";
						lock.src = u.srcUnlock;
					}
				}

				u.user.lockBuffer = u.user.lock;

			} else if (!data.userConnected) {
				s.msgConsole = "User not logged";
				document.location.href = "login.html";

			} else
				s.msgConsole = "Aknown log error";
		});

	},

	/***************************************************************************
	 * listener(): Ajoute des listener à la page
	 * 
	 * return: none
	 **************************************************************************/
	listener : function() {

		// Ajour du listener sur boutton logout
		var logout = document.getElementsByClassName("header-a")[0];
		logout.addEventListener('click', myHandler.logout);

		var lock = document.getElementsByClassName("header-unlock")[0];
		lock.addEventListener('click', myHandler.lock);

	},

	/***************************************************************************
	 * logout(): Requête post demandant le delog de l'utilisateur
	 * 
	 * return: none
	 **************************************************************************/

	logout : function() {
		$.post(u.servletDeco, {

		}, function(data, status) {

			if (data.ok) {
				s.msgConsole = "None";
				u.user.auth = true;
			}

			else if (!data.ok) {
				s.msgConsole = "Deconnexion impossible " + data.err;
				document.location.href = "login.html";

			} else
				s.msgConsole = "Aknown delog error";
		});

	},

	/***************************************************************************
	 * lock(): Lock ou unlock l'utilisateur
	 * 
	 * return: none
	 **************************************************************************/

	lock : function() {

		var locked_int;
		if (u.user.lock) {
			locked_int = 0;
		} else
			locked_int = 1;

		$.post(u.servletLock, {
			locked : locked_int,
		}, function(data, status) {
			var lock = document.getElementsByClassName("header-unlock")[0];
			if (data.ok) {
				s.msgConsole = "None";
				u.user.lock = !(u.user.lock);

				if (u.user.lock) {
					lock.title = "You're Lock !";
					lock.src = u.srcLock;
				} else {
					lock.title = "You're UnLock !";
					lock.src = u.srcUnlock;
				}

			} else if (!data.ok) {
				s.msgConsole = "Lock impossible " + data.err;

			} else
				s.msgConsole = "Aknown delog error";
		});

	},

	/***************************************************************************
	 * displayInfo(): Affichage des informations utiles à la pages HTML
	 * (console, utilisateur)
	 * 
	 * return: none
	 **************************************************************************/

	displayInfo : function() {

		// Affichage Console
		var p = document.getElementById('paragraphe');
		p.innerHTML = "";

		p.innerHTML = "Simulateur :   posX: " + s.dataRobot.posX
				+ " |   posY: " + s.dataRobot.posY + " |   sens: "
				+ s.dataRobot.sens + " |   datarefresh: " + s.timerDataRefresh
				+ "ms <br>" + "Canvas &nbsp &nbsp :   posX: "
				+ s.myCanvas.posXMap + " |   posY: " + s.myCanvas.posYMap
				+ " |   sens: " + s.myCanvas.sens + " |   canvasrefresh: "
				+ s.myCanvas.timerCanvasRefresh + "ms | angle : "
				+ s.myCanvas.angle + "° | vitesse : " + s.myCanvas.vitesse
				+ "px/fr | vit_angulaire : " + s.myCanvas.vitesse_angulaire
				+ "°/fr<br>" + "Console &nbsp &nbsp: " + s.msgConsole;

		// Affichage données utilisateurs dans le header
		var log = document.getElementsByClassName('header-h3')[0];
		log.innerHTML = "Bienvenue " + u.user.login + " ";
		log.title = "You're " + u.user.grade + " !";

	},

};

// Lorsque document est ready, initialisation du widget myRefresher
$(document).ready(myHandler.init());