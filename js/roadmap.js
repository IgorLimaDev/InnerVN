		function Roteiro() {
			var firstScene = new Scene("img/bg1.png");
			var secondScene = new Scene("img/bg2.jpg");
			firstCutscene = new Cutscene(firstScene, [
			{fala:"Você gosta de comida japonesa?", character:Luh, position:"center", scene:firstScene},
			{fala:"Eu vou bem, e você?", character:Luana, position:"center"},
			{fala:"Vai pra cena 1 ou cena 2?", character:Luh, position:"center", scene:secondScene}
			], function() {
				//Função para tomar atitude após o diálogo.
				var pao = new Choice("Vai pra cena 1 ou cena 2?", firstCutscene, {
					"Cena 1":function() {
						//secondCutscene.start();
						var asc = new ActionScene("bg2.png");
						asc.buildScenario(
						[{x:100, y:100, callback:function() {
							secondCutscene.start();
							}}, {x:150, y:150, callback:function() {
							thirdCutscene.start();
						}} ]);
					}, 
					"Cena 2":function() {thirdCutscene.start();}
				} );
				pao.choice();
			});
			
			var secondCutscene = new Cutscene(firstScene, [
			{fala:"Agora veio pro diálogo 2", character:Luh, position:"left"},
			{fala:"Você gosta de pão?", character:Luana, position:"right"},
			], function() {
				//Função para tomar atitude após o diálogo.
				var salgadinho = new Choice("Você gosta de pão?", secondCutscene,
				{
					"Sim":function() {alert("VOCÊ GOSTA")}, 
					"Não":function() {alert("VOCÊ NÃO GOSTA");}
				}
				);
				salgadinho.choice();
			});
			
			var thirdCutscene = new Cutscene(firstScene, [
			{fala:"Agora veio pro diálogo 3", character:Luh, position:"left"},
			{fala:"Você gosta de cachorro quente?", character:Luana, position:"right"},
			], function() {
				//Função para tomar atitude após o diálogo.
				var cheetos = new Choice("Você gosta de cachorro quente?", thirdCutscene,
				{
					"Sim":function() {alert("VOCÊ GOSTA")}, 
					"Não":function() {alert("VOCÊ NÃO GOSTA");}
				}
				);
				cheetos.choice();
			});
			
			firstCutscene.start();
		}