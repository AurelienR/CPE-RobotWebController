/*
 myRefresher: widget permettant de refresh

 */
var s, myRefresher = {

	settings : {
		servlet : "Robotinfo",
		timerDataRefresh : 3000,
		msgConsole : "none",
		mapJson : {},

		dataRobot : {
			posX : 0,
			posY : 0,
			sens : "down",
			obstacles : {
				color : "#34495e",
				height : "",
				width : "",
				x : [ 500, 300 ],
				y : [ 250, 300 ],
				x : [],
				y : [],
			},
			path : {
				x : [],
				y : [],
			}
		},

		myCanvas : {
			idCanvas : "myCanvas",
			canvas : "",
			ctx : "",

			timerCanvasRefresh : 25,
			width : 1000,
			height : 500,

			linewidth : 3,
			linecolor : "#e74c3c",
			bgcolor : "#FFFFFF",

			posXMap : 0,
			posYMap : 0,
			stepX : "",
			stepY : "",
			nbStep : 10,
			sens : "down",
			angle : 180,
			vitesse : 5,
			vitesse_angulaire : 10,

			Images : {
				srcObstacle : "",

				robot : "",
				srcRobot : "img/Robot.png",
			}
		}
	},

	/***************************************************************************
	 * init(): Lance l'initialisation des fonctions liées canvas et au
	 * refresher
	 * 
	 * return:none
	 **************************************************************************/

	init : function() {
		s = this.settings;
		$.post(s.servlet, {},
				function(data, status) {
					myRefresher.initCanvas();

					if (data.direction === "N")
						s.dataRobot.sens = "up";
					else if (data.direction === "S")
						s.dataRobot.sens = "down";
					else if (data.direction === "W")
						s.dataRobot.sens = "left";
					else if (data.direction === "E")
						s.dataRobot.sens = "right";
					else
						s.msgConsole = "Direction robot invalide:"
								+ data.direction;

					s.dataRobot.posX = data.posX * s.myCanvas.stepX;
					s.dataRobot.posY = data.posY * s.myCanvas.stepY;
					s.myCanvas.posXMap = s.dataRobot.posX;
					s.myCanvas.posYMap = s.dataRobot.posY;
					s.dataRobot.path.x[0] = s.dataRobot.posX;
					s.dataRobot.path.y[0] = s.dataRobot.posY;

					if (data.wallX.length != 0
							&& s.dataRobot.obstacles.x.length === 0) {
						for (i = 0; i < data.wallX.length; i++) {
							s.dataRobot.obstacles.x.push(data.wallX[i]*s.myCanvas.stepX);
							s.dataRobot.obstacles.y.push(data.wallY[i]*s.myCanvas.stepY);
						}
					} else {
						for (i = 0; i < data.wallX.length; i++) {
							if (!myRefresher.doubletDansTableau(s.dataRobot.obstacles.x,
									s.dataRobot.obstacles.y, data.wallX[i]*s.myCanvas.stepX,
									data.wallY[i]*s.myCanvas.stepY)) {
								s.dataRobot.obstacles.x.push(data.wallX[i]*s.myCanvas.stepX);
								s.dataRobot.obstacles.y.push(data.wallY[i]*s.myCanvas.stepY);
							}
						}
					}

					/*
					 * for (i = 0; i <= data.wallX.length; i++) {
					 * 
					 * if (s.dataRobot.obstacles.x.length === 0) {
					 * s.dataRobot.obstacles.x.push(data.wallX[i]
					 * s.myCanvas.stepX);
					 * s.dataRobot.obstacles.y.push(data.wallY[i]
					 * s.myCanvas.stepY); } else { var buffer =
					 * s.dataRobot.obstacles.x.length; for (j = 0; j < buffer;
					 * j++) { if (!(s.dataRobot.obstacles.x[j] == (data.wallX[i] *
					 * s.myCanvas.stepX) && s.dataRobot.obstacles.y[j] ==
					 * (data.wallY[i] * s.myCanvas.stepY))) {
					 * alert(s.myCanvas.stepX); alert(s.dataRobot.obstacles.x[j] + " " +
					 * (data.wallX[i] * s.myCanvas.stepX) + " " +
					 * s.dataRobot.obstacles.y[j] + " " + (data.wallY[i] *
					 * s.myCanvas.stepY));
					 * s.dataRobot.obstacles.x.push(data.wallX[i] *
					 * s.myCanvas.stepX);
					 * s.dataRobot.obstacles.y.push(data.wallY[i] *
					 * s.myCanvas.stepY); alert(s.dataRobot.obstacles.x.length); } } } }
					 */

					myRefresher.refresher();

					// alert(s.dataRobot.posX + " ; " + s.dataRobot.posY
					// + ";" + s.dataRobot.sens);

				});
	},

	/***************************************************************************
	 * initCanvas(): Initialise les propriétés du Canvas
	 * 
	 * return:none
	 **************************************************************************/

	initCanvas : function() {

		// Récupération du canvas
		var canvas = document.getElementById(s.myCanvas.idCanvas);

		if (!canvas) {
			alert("Impossible de récupérer le canvas");
			return;
		}

		// Enregistrement de l'élément Canvas dans les settings
		s.myCanvas.canvas = canvas;

		// Récupération du context graphic 2D
		var ctx = canvas.getContext('2d');
		if (!ctx) {
			alert("Impossible de récupérer le context du canvas");
			return;
		}

		// Enregistrement du context dans les settings
		s.myCanvas.ctx = ctx;

		// Dimensions canvas
		canvas.width = s.myCanvas.width;
		canvas.height = s.myCanvas.height;

		// Mise en place du background
		ctx.fillStyle = s.myCanvas.bgcolor;

		// Propriétés de la ligne de tracé
		ctx.lineWidth = s.myCanvas.linewidth;
		ctx.strokeStyle = s.myCanvas.linecolor;

		// Mise en place du robot
		s.myCanvas.Images.robot = new Image();
		s.myCanvas.Images.robot.src = s.myCanvas.Images.srcRobot;

		// Initialisation du Path du robot
		s.dataRobot.path.x.push(s.dataRobot.posX);
		s.dataRobot.path.y.push(s.dataRobot.posY);

		// Initialisation du pas sur le canvas
		s.myCanvas.stepX = s.myCanvas.width / s.myCanvas.nbStep;
		s.myCanvas.stepY = s.myCanvas.height / s.myCanvas.nbStep;

		// Initialisation Dimensions Canvas
		s.dataRobot.obstacles.width = s.myCanvas.stepX;
		s.dataRobot.obstacles.height = s.myCanvas.stepY;

		// Animation et refresh graphique du Canvas
		setInterval(myRefresher.animate, s.myCanvas.timerCanvasRefresh);

	},

	/***************************************************************************
	 * refresher(): Fonction refresh régulier data canvas
	 * 
	 * return:none
	 **************************************************************************/

	refresher : function() {
		myRefresher.refreshMap();
		setTimeout(myRefresher.refresher, s.timerDataRefresh);
	},

	/***************************************************************************
	 * refreshMap(): Récupération des data canvas JSON par POST et demande
	 * d'affichage
	 * 
	 * return: none
	 **************************************************************************/
	refreshMap : function() {

		myRefresher.requestedMap();

	},

	/***************************************************************************
	 * requestedMap(): Récupération data JSON par Requete POST
	 * 
	 * return: data
	 **************************************************************************/
	requestedMap : function() {

		// Requete POST
		$.post(s.servlet, {},
				function(data, status) {
					if (data.direction === "N")
						s.dataRobot.sens = "up";
					else if (data.direction === "S")
						s.dataRobot.sens = "down";
					else if (data.direction === "W")
						s.dataRobot.sens = "left";
					else if (data.direction === "E")
						s.dataRobot.sens = "right";
					else
						s.msgConsole = "Direction robot invalide:"
								+ data.direction;

					s.dataRobot.posX = data.posX * s.myCanvas.stepX;
					s.dataRobot.posY = data.posY * s.myCanvas.stepY;

					// alert(s.dataRobot.posX + " ; " + s.dataRobot.posY
					// + ";" + s.dataRobot.sens);

					if (data.wallX.length != 0
							&& s.dataRobot.obstacles.x.length === 0) {
						for (i = 0; i < data.wallX.length; i++) {
							s.dataRobot.obstacles.x.push(data.wallX[i]*s.myCanvas.stepX);
							s.dataRobot.obstacles.y.push(data.wallY[i]*s.myCanvas.stepY);
						}
					} else {
						for (i = 0; i < data.wallX.length; i++) {
							if (!myRefresher.doubletDansTableau(s.dataRobot.obstacles.x,
									s.dataRobot.obstacles.y, data.wallX[i]*s.myCanvas.stepX,
									data.wallY[i]*s.myCanvas.stepY)) {
								s.dataRobot.obstacles.x.push(data.wallX[i]*s.myCanvas.stepX);
								s.dataRobot.obstacles.y.push(data.wallY[i]*s.myCanvas.stepY);
							}
						}
					}

					/*
					 * for (i = 0; i < data.wallX.length; i++) {
					 * 
					 * if (s.dataRobot.obstacles.x.length === 0) {
					 * s.dataRobot.obstacles.x[0] = data.wallX[i];
					 * s.dataRobot.obstacles.y[0] = data.wallY[i]; } else {
					 * alert(s.dataRobot.obstacles.x.length);
					 * 
					 * var buffer = s.dataRobot.obstacles.x.length; for (j = 0;
					 * j < buffer; j++) { if (!(s.dataRobot.obstacles.x[j] ==
					 * (data.wallX[i] * s.myCanvas.stepX) &&
					 * s.dataRobot.obstacles.y[j] == (data.wallY[i] *
					 * s.myCanvas.stepY))) {
					 * s.dataRobot.obstacles.x.push(data.wallX[i] *
					 * s.myCanvas.stepX);
					 * s.dataRobot.obstacles.y.push(data.wallY[i] *
					 * s.myCanvas.stepY); // alert("wallX //
					 * "+data.wallX[i]*s.myCanvas.stepX+"wallY //
					 * "+data.wallY[i]*s.myCanvas.stepY+"obstacleX //
					 * "+s.dataRobot.obstacles.x[j]+"obstacley //
					 * "+s.dataRobot.obstacles.y[j]); }
					 *  }
					 *  } }
					 */

				});
	},

	doubletDansTableau : function(x1, y1, x2, y2) {
		for (var i = 0; i < x1.length; i++) {
			if (x2 == x1[i] && y2 == y1[i]) {
				//alert(x2 + ";" + y2 + " est dans x1 y1 ! x1.length=" + x1.length);
				return 1;
			}
		}
		return 0;
	},

	/***************************************************************************
	 * animate(): Fonction appelé périodiquement pour rafraichir le canvas et
	 * donner un effet d'animation et de faire correspondre les données robot
	 * au graphique
	 * 
	 * return: none
	 **************************************************************************/
	animate : function() {

		// Initialisation des variables
		var ctx = s.myCanvas.ctx;
		// Instanciation des images

		ctx.clearRect(0, 0, s.myCanvas.width, s.myCanvas.height);
		ctx.fillRect(0, 0, s.myCanvas.width, s.myCanvas.height);

		// Affichage des obstacles
		myRefresher.drawObstacle();

		// Auto translation du curseur
		myRefresher.auto_translate();

		// alert(s.myCanvas.posXMap + " ; " + s.myCanvas.posYMap + ";" +
		// s.myCanvas.sens);

		// Rotation automatique du curseur

		myRefresher.auto_rotate();

	},

	/***************************************************************************
	 * drawRotatedImage(): Positionne et effectue une rotation de l'image dans
	 * le canvas return: none
	 * 
	 * src:
	 * http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/
	 **************************************************************************/
	drawRotatedImage : function(image, x, y, angle) {

		var ctx = s.myCanvas.ctx;

		// save the current co-ordinate system
		// before we screw with it
		ctx.save();

		// move to the middle of where we want to draw our image
		ctx.translate(x, y);

		// rotate around that point, converting our
		// angle from degrees to radians
		ctx.rotate(angle * Math.PI / 180);

		// draw it up and to the left by half the width
		// and height of the image
		ctx.drawImage(image, -(image.width / 2), -(image.height / 2));

		// and restore the co-ords to how they were when we began
		ctx.restore();

	},

	/***************************************************************************
	 * 
	 * auto_rotate(): Detecte l'orientation réelle du robot et celui du canvas
	 * et ajuste l'orientation
	 * 
	 * return: none
	 **************************************************************************/

	auto_rotate : function(image, x, y, angle) {

		// Récupération des paramètres
		var vitesse_angulaire = s.myCanvas.vitesse_angulaire;
		var posXMap = s.myCanvas.posXMap;
		var posYMap = s.myCanvas.posYMap;

		// Detection du sens du robot en réalité et sur le canvas

		// Sinon si le robot est dirigé le haut la gauche et pas le canvas
		if (s.dataRobot.sens === "up" && s.myCanvas.sens !== "up") {

			// Si l'orientation (angle) du robot canvas n'est pas de
			// 0,360,-360° alors on modifie son angle
			if (s.myCanvas.angle !== 0 || s.myCanvas.angle != 360
					|| s.myCanvas.angle != -360) {

				// On tourne le robot dans la direction la plus adaptée
				if (s.myCanvas.sens === "down" || s.myCanvas.sens === "right") {
					s.myCanvas.angle = (s.myCanvas.angle - vitesse_angulaire) % 360;

				}

				if (s.myCanvas.sens === "left") {

					s.myCanvas.angle = (s.myCanvas.angle + vitesse_angulaire) % 360;

				}

			}

			// Si l'orientation (angle) du robot canvas est de 0,360,-360°
			// alors on définie son sens comme "up"
			if (s.myCanvas.angle === 0 || s.myCanvas.angle == 360
					|| s.myCanvas.angle == -360) {
				s.myCanvas.sens = "up";

			}

		}

		// Sinon si le robot est dirigé vers le bas et pas le canvas
		else if (s.dataRobot.sens === "down" && s.myCanvas.sens !== "down") {

			// Si l'orientation (angle) du robot canvas n'est pas de 180,-180°
			// alors on modifie son angle
			if (s.myCanvas.angle != -180 || s.myCanvas.angle != 180) {

				// On tourne le robot dans la direction la plus adaptée
				if (s.myCanvas.sens === "up" || s.myCanvas.sens === "right") {

					s.myCanvas.angle = (s.myCanvas.angle + vitesse_angulaire) % 360;

				}

				if (s.myCanvas.sens === "left") {

					s.myCanvas.angle = (s.myCanvas.angle - vitesse_angulaire) % 360;

				}

			}
			// Si l'orientation (angle) du robot canvas est de 180,-180° alors
			// on définie son sens comme "down"
			if (s.myCanvas.angle == -180 || s.myCanvas.angle == 180) {
				s.myCanvas.sens = "down";
			}

		}

		// Sinon si le robot est dirigé vers la gauche et pas le canvas
		else if (s.dataRobot.sens === "left" && s.myCanvas.sens !== "left") {

			// Si l'orientation (angle) du robot canvas n'est pas de -90,270°
			// alors on modifie son angle
			if (s.myCanvas.angle != -90 || s.myCanvas.angle != 270) {

				// On tourne le robot dans la direction la plus adaptée
				if (s.myCanvas.sens === "up" || s.myCanvas.sens === "right") {
					s.myCanvas.angle = (s.myCanvas.angle - vitesse_angulaire) % 360;

				}

				if (s.myCanvas.sens === "down") {

					s.myCanvas.angle = (s.myCanvas.angle + vitesse_angulaire) % 360;

				}

			}

			// Si l'orientation (angle) du robot canvas est de -90,270° alors
			// on définie son sens comme "left"
			if (s.myCanvas.angle == -90 || s.myCanvas.angle == 270) {
				s.myCanvas.sens = "left";

			}

		}

		// Sinon si le robot est dirigé vers la droite et pas le canvas
		else if (s.dataRobot.sens === "right" && s.myCanvas.sens !== "right") {

			// Si l'orientation (angle) du robot canvas n'est pas de 90,-270°
			// alors on modifie son angle
			if (s.myCanvas.angle != 90 || s.myCanvas.angle != -270) {

				// On tourne le robot dans la direction la plus adaptée
				if (s.myCanvas.sens === "up" || s.myCanvas.sens === "left") {
					s.myCanvas.angle = (s.myCanvas.angle + vitesse_angulaire) % 360;

				}

				if (s.myCanvas.sens === "down") {

					s.myCanvas.angle = (s.myCanvas.angle - vitesse_angulaire) % 360;

				}

			}

			// Si l'orientation (angle) du robot canvas est de 90,-270° alors
			// on définie son sens comme "left"
			if (s.myCanvas.angle == 90 || s.myCanvas.angle == -270) {
				s.myCanvas.sens = "right";

			}

		}

		// Affichage du robot sur le Canvas
		myRefresher.drawRotatedImage(s.myCanvas.Images.robot, posXMap, posYMap,
				s.myCanvas.angle);

	},

	/***************************************************************************
	 * 
	 * auto_rotate(): Detecte l'orientation réelle du robot et celui du canvas
	 * et ajuste l'orientation
	 * 
	 * return: none
	 **************************************************************************/
	auto_translate : function() {

		var ctx = s.myCanvas.ctx;
		var posXMap = s.myCanvas.posXMap;
		var posYMap = s.myCanvas.posYMap;
		var posX = s.dataRobot.posX;
		var posY = s.dataRobot.posY;
		var vitesse = s.myCanvas.vitesse;
		var i = 1;

		// Tracé du chemin

		ctx.beginPath();

		// On positionne le début du chemin à la position initiale du robot
		ctx.moveTo(s.dataRobot.path.x[0], s.dataRobot.path.y[0]);

		// On parcours les coordonnées du chemin du robot et on les ajoutes au
		// canvas
		for (i = 1; i < s.dataRobot.path.x.length; i++) {
			ctx.lineTo(s.dataRobot.path.x[i], s.dataRobot.path.y[i]);
		}

		// On dessine le chemin
		ctx.stroke();

		if (s.dataRobot.posX < s.myCanvas.posXMap) {
			s.myCanvas.posXMap -= vitesse;
			// s.dataRobot.sens="left";
		}

		else if (s.dataRobot.posX > s.myCanvas.posXMap) {
			s.myCanvas.posXMap += vitesse;
			// s.dataRobot.sens="right";
		}

		else if (s.dataRobot.posY < s.myCanvas.posYMap) {
			s.myCanvas.posYMap -= vitesse;
			// s.dataRobot.sens="up";
		}

		else if (s.dataRobot.posY > s.myCanvas.posYMap) {
			s.myCanvas.posYMap += vitesse;
			// s.dataRobot.sens="down";
		}

		if (s.dataRobot.posX == s.myCanvas.posXMap
				|| s.dataRobot.posX == s.myCanvas.posYMap) {

			if (s.dataRobot.path.x[i - 1] != s.myCanvas.posXMap
					|| s.dataRobot.path.y[i - 1] != s.myCanvas.posYMap) {
				s.dataRobot.path.x.push(s.myCanvas.posXMap);
				s.dataRobot.path.y.push(s.myCanvas.posYMap);
			}

		}

		ctx.lineTo(s.myCanvas.posXMap, s.myCanvas.posYMap);
		ctx.stroke();

	},

	/***************************************************************************
	 * 
	 * drawObstacle(x,y): Dessine les obstacles stockées en mémoire
	 * 
	 * 
	 * return: none
	 **************************************************************************/
	drawObstacle : function() {

		var ctx = s.myCanvas.ctx;
		ctx.fillStyle = s.dataRobot.obstacles.color;

		var i = 0;

		for (i = 0; i < s.dataRobot.obstacles.x.length; i++) {
			ctx.fillRect(s.dataRobot.obstacles.x[i]
					- (s.dataRobot.obstacles.width / 2),
					s.dataRobot.obstacles.y[i]
							- (s.dataRobot.obstacles.height / 2),
					s.dataRobot.obstacles.width, s.dataRobot.obstacles.height);
		}

		ctx.fillStyle = s.myCanvas.bgcolor;

	}

};

// Lorsque document est ready, initialisation du widget myRefresher
$(document).ready(myRefresher.init());
