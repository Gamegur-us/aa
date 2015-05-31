(function(){

	'use strict';
	window.GameCtrl = {
	};


	GameCtrl.Main = function () {
	};

	GameCtrl.Main.prototype = {

		preload: function () {
			this.load.image('circle', 'img/circle.png');
			this.load.image('bg', 'img/bg.png');
		},
		createPin: function(x, y, dt, text){
			var ret = {x: x, y: y, dt: dt , text: text, sprite: null};

			ret.sprite = this.add.sprite(x, y, 'circle');
			ret.sprite.anchor.set(0.5);

			var style = { font: "10px Arial", fill: "#000", align: "center" };
		    var t = this.add.text(ret.sprite.centerX, ret.sprite.centerY, text, style);
		    t.anchor.set(0.5);
		    ret.sprite.addChild(t);
			return ret;
		},
		create: function () {

			this.pins= [];
			this.toLaunch= [];
			this.elapsed= 0;
			this.gameover = false;
			

			var bg = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');
			bg.tileScale.x = 480/900;
			bg.tileScale.y = 480/900;

			this.linesCanvasGraphic = this.add.graphics(0, 0);
			
			this.add.graphics(0, 0)
			.lineStyle(0)
    		.beginFill(0xFFFF83)
    		.drawCircle(this.world.centerX, 350, 200)
    		.endFill();

    		var style = { font: "24px Arial", fill: "#000", align: "center" };
		    this.add.text(this.world.centerX, 350, 'Level 1', style)
		    .anchor.set(0.5);
		    
			
    		var p = this.createPin(this.world.centerX + 200, 150, 0 ,'1');
			this.pins.push(p);
			
			for(var i = 2; i < 10; i +=1){
				this.toLaunch.push(this.createPin(this.world.centerX, 650 + ((i-2) * 50), 0 , i.toString()));
			}

			this.pinLaunch = this.toLaunch[0].sprite;
			

			this.input.onDown.add(this.releasePin, this);
		},

		releasePin: function(){
			if(this.gameover){
				return;
			}
			if (this.tweenRunning && this.tweenRunning.isRunning) {
				return;
			}
			

			
			this.tweenRunning = this.add.tween(this.pinLaunch).to({y: 550}, 100, Phaser.Easing.Linear.None, true);

			this.tweenRunning.onComplete.add(function(){
				
				this.tweens.remove(this.tweenRunning);
				this.tweenRunning=null;
				// ultimo chequeo
				this.pinLaunch.y = 550;
				this.checkIntersection();
				
				var current = this.toLaunch.shift();
				current.dt = this.elapsed;
				this.pins.push(current);
				
				if (this.toLaunch.length == 0) {
					this.gameover = true;
					this.winAnimations();
					return;
				}
				

				this.pinLaunch = this.toLaunch[0].sprite;

				for(var i =0 ; i< this.toLaunch.length; i += 1){				
					this.add.tween(this.toLaunch[i].sprite).to({y: '-50'}, 50, Phaser.Easing.Linear.None, true);
				}
			}, this);
		},
		winAnimations: function(){
			alert('you win!');
			this.state.start('Main');
		},
		update: function(){
			if(this.gameover){
				return;
			}
			this.elapsed += 1;
			

			var  graphics = this.linesCanvasGraphic;
    		graphics.clear();
			
			var ang120 = Math.PI / 2;
			for(var i = 0,pin; i< this.pins.length; i += 1){
				pin = this.pins[i];
			
				pin.sprite.x = parseInt(Math.cos(Math.PI * ((this.elapsed - pin.dt) /120) + ang120)* 200 + this.world.centerX, 10) ;
				pin.sprite.y = parseInt(Math.sin(Math.PI * ((this.elapsed - pin.dt) / 120) + ang120) *200 + 350, 10);

				graphics.lineStyle(2, 0xFFFF0B, 0.5);
    			graphics.moveTo(this.world.centerX, 350);
    			graphics.lineTo(pin.sprite.x, pin.sprite.y);

    			
			}

			this.checkIntersection();

		},
		circlesIntersect: function (s1, s2){
		
			var c1X = s1.x,c1Y=s1.y,c1Radius=s1.width / 2;
			var c2X = s2.x,c2Y=s2.y,c2Radius=s2.width / 2;
			var distanceX = c2X - c1X;
			var distanceY = c2Y - c1Y;

		    var magnitude = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
			return magnitude < (c1Radius + c2Radius);
		},
		checkIntersection: function(){
			if (!this.tweenRunning) {
				return;
			}
			if(!this.tweenRunning.isRunning){
				return;
			}

			for(var i = 0,p; i< this.pins.length; i += 1){
				p = this.pins[i];
				if(this.circlesIntersect(p.sprite, this.pinLaunch)){
					p.sprite.tint = 0xCC0000;
					this.pinLaunch.tint = 0xCC0000;
					this.gameover = true;
					this.tweenRunning.pause();
					break;
				}
			}
			

		}

	};

})();