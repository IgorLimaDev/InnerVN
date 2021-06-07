/* */
/* Função pra ajustar os itens na tela quando a tela é vertical */
	function adjustHUD() {
		if($(window).height() > $(window).width()) {
			jQuery(".responsive-overlay").css("width", $(window).width() + "px");
		}
	}		
	/* --- */
	
	/* Mais fácil que console.log() */	
	function prettyLog(msg) {
			  console.log(msg)
	}
	/* --- */
	
	/* Função que processa e enfileira um diálogo de uma Cutscene */
	function scheduleDialog(dialog, callbackDialogFinished) {
		actualDialogTotal = dialog.length;
		jQuery(".speak-box").unbind();
		speak(dialog[0].fala, dialog[0].character, dialog[0].position);
		jQuery(".speak-box").click(function() {
			actualDialogPosition = actualDialogPosition + 1;
			if(actualDialogPosition < (actualDialogTotal - 1)) {
				speak(dialog[actualDialogPosition].fala, dialog[actualDialogPosition].character, dialog[actualDialogPosition].position);
				if(dialog[actualDialogPosition].scene) {
					navigateToScene(dialog[actualDialogPosition].scene);							
				}
			} else if(actualDialogPosition == (actualDialogTotal - 1)) {
				speak(dialog[actualDialogPosition].fala, dialog[actualDialogPosition].character, dialog[actualDialogPosition].position);
				if(dialog[actualDialogPosition].scene) {
					navigateToScene(dialog[actualDialogPosition].scene);
				}
			} else if(actualDialogPosition == actualDialogTotal) {
				actualDialogPosition = 0;
				actualDialogTotal = 0;
				jQuery(".speak-box").unbind();
				callbackDialogFinished();						
			}
		});
	}
	/* --- */

	/* Função que troca de cenário */
	function navigateToScene(scene) {
		if(scene.background !== actualScene) {
			jQuery(".game-frame .image-background").fadeOut();
			setTimeout(function() {
				jQuery(".game-frame .image-background").attr("src", scene.background)
				setTimeout(function() {
					jQuery(".game-frame .image-background").fadeIn();							
				}, 500)
			}, 500);					
			actualScene = scene.background;
		}
	}
	/* --- */
	
	/* Função que controla a fala na caixa de diálogo  */
	function speak(fala, character, position) {
		delete typed;			  
		jQuery(".speak-box").html("");
		
		jQuery(".next-speak").fadeOut();
		var charPosition = "." + position + "-character-scene";
		if(position == "left") {
			if(character.mainSprite !== lastLeftCharacter) {
				$(charPosition).fadeOut();
			}
		} else if(position == "center") {
			if(character.mainSprite !== lastCenterCharacter) {
				$(charPosition).fadeOut();
			}
		} else {
			if(character.mainSprite !== lastRightCharacter) {
				$(charPosition).fadeOut();
			}
		}
		setTimeout(function() {
			$(charPosition).html("<img src='"+character.mainSprite+"'/>");				
			if(!jQuery(charPosition).is(":visible")) {
				$(charPosition).fadeIn();				  
			}
		}, 500);
		
		typed = new Typed(".speak-box", {
			strings: ["","<strong>[" + character.nome + "]</strong><br/> \"" + fala + '"'],
			typeSpeed: 30,
			backSpeed: 0,
			autoInsertCss:true,
			backDelay: 500,
			showCursor:false,
			startDelay: 1000,
			loop: false,
			onComplete: function(self) { prettyLog('onCmplete ' + self); 			  jQuery(".next-speak").fadeIn(); },
			preStringTyped: function(pos, self) { prettyLog('preStringTyped ' + pos + ' ' + self); },
			onStringTyped: function(pos, self) { prettyLog('onStringTyped ' + pos + ' ' + self) },
			onLastStringBackspaced: function(self) { prettyLog('onLastStringBackspaced ' + self) },
			onTypingPaused: function(pos, self) { prettyLog('onTypingPaused ' + pos + ' ' + self) },
			onTypingResumed: function(pos, self) { prettyLog('onTypingResumed ' + pos + ' ' + self) },
			onReset: function(self) { prettyLog('onReset ' + self) },
			onStop: function(pos, self) { prettyLog('onStop ' + pos + ' ' + self) },
			onStart: function(pos, self) { prettyLog('onStart ' + pos + ' ' + self) },
			onDestroy: function(self) { prettyLog('onDestroy ' + self) }
		});
		
		if(position == "left") {
			lastLeftCharacter = character.mainSprite;
		} else if(position == "center") {
			lastCenterCharacter = character.mainSprite;
		} else {
			lastRightCharacter = character.mainSprite;				  
		}
	}
	/* --- */


/* -------------- Término das funções e métodos -------------- */	
		  
		  
		  
/* -------------- Classes e objetos do jogo -------------- */	
	  
	  /* Classe para criação de personagens */
		  class Character {
			constructor(sprite, nome, humor = {}) {
				this.nome = nome;
				this.mainSprite = sprite;
				this.humor = humor;
			}
			
		  }
		  
		  class Scene {
			constructor(background) {
				this.background = background;
			}
		  }
		/* --- */
		
	/* Classe para um cenário com botões de ação que extende a classe Scene */
	class ActionScene extends Scene {
		constructor() {
			super();
		}
		buildScenario(screenPoints = []) {
			navigateToScene(this);
			jQuery(".responsive-overlay").fadeOut();
			for(var clickPoint in screenPoints) {
				var btnAction = jQuery("<button style='margin-left:"+ screenPoints[clickPoint].x +"px;margin-top:"+ screenPoints[clickPoint].y +"px;' class='actionButton btn btn-primary'>X</button>");
				jQuery(".game-frame").append(btnAction);
				jQuery(btnAction).click(function() {
					screenPoints[clickPoint].callback();
				});
				jQuery(btnAction).click(function() {
					jQuery(".actionButton").fadeOut();
					setTimeout(function() {
						jQuery(".actionButton").remove();
					}, 500);
					jQuery(".responsive-overlay").fadeIn();
					jQuery("body").scrollLeft(jQuery(".responsive-overlay").scrollLeft());
				})
			}
		}
		
	}
	/* --- */

		/* Classe em construção */
		  class Storyline {
			constructor(initialScene) {
				this.initialScene = initialScene;
			}
			
			start() {
				navigateToScene(this.initialScene);
			}
			
		  }
		  /* --- */
		  
		  /* Classe de cutscene, que reproduz o diálogo e controla para qual cena irá */
		  class Cutscene {
			constructor(initialScene, dialog = [], callbackDialogFinished) {
				this.initialScene = initialScene;
				this.dialog = dialog;
				this.callbackDialogFinished = callbackDialogFinished;
			}
			
			start() {
				navigateToScene(this.initialScene);
				scheduleDialog(this.dialog, this.callbackDialogFinished);
			}
		  
		  }
		  /* --- */
		  
		  /* Classe que cria os botões de escolha e atribui os eventos à eles */
		  class Choice {
			constructor(question, actualCutscene, options = {}) {
				this.question = question;
				this.options = options;
				this.actualCutscene = actualCutscene;
			}
			
			choice() {
				var questionBox = document.querySelector(".overlay-choice-box");
				var tmpObjeto = this;
				jQuery(".choice-box .question-title").html(this.question);
				var options = this.options;
				for(var option in options) {
					console.log(options[option]);
					var tmpBtn = document.createElement("BUTTON");
					tmpBtn.className = "btn btn-primary";
					tmpBtn.innerHTML = option;
					tmpBtn.addEventListener("click", function() {
						jQuery(questionBox).fadeOut();
						jQuery(".choice-box .options").html("");
						jQuery(".choice-box .question-title").html("");
						var fullAnswer = {
							cutscene: tmpObjeto.actualCutscene,
							question: tmpObjeto.question,
							answer: option
						}
						globalAnswers.push(fullAnswer);
					});
					tmpBtn.addEventListener("click", options[option]);
					document.querySelector(".choice-box .options").appendChild(tmpBtn);
				}
				jQuery(questionBox).fadeIn();
			}
		  }
		  /* --- */
		  
/* -------------- Término das classes e objetos do jogo -------------- */
		  
/* -------------- Variáveis globais para valores e controles -------------- */
		  
	/* Variável global para controlar o typed */	   
	var typed;
	/* --- */
	
	/* Variável global que controla a primeira cena */
	var firstCutscene;	
	/* --- */
	
	/* Variáveis globais que controlam a linha de diálogo */
	var actualDialogPosition = 0;
	var actualDialogTotal = 0;
	/* --- */
	
	/* Controla respostas globais */
	var globalAnswers = [];
	/* */
	
	/* Variável que controla a cena atual */
	var actualScene = "";
	
	/* Personagens e Ambientes */
	var Luh = new Character("img/Shari6.gif", "Sush1");
	var Luana = new Character("img/Luana2.png", "Luana");
	/* --- */
	
	/* Ambientes e cenas */
	var Parque = new Scene("parque.jpg");
	/* --- */
	
	/* Variáveis globais que controlam a aparição dos personagens à esquerda e direita */
	var lastLeftCharacter = "";
	var lastRightCharacter = "";
	var lastCenterCharacter = "";
	/* --- */