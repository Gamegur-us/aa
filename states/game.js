/* global Phaser */
(function(){

	'use strict';
	window.GameCtrl = {
	};


	window.GameCtrl.Main = function () {
	};

	var Levels = [
		{
			'name': 'Level 1',
			'pinsToLaunch': 6,
			'pins': []
		}
	];
	

	var ORBIT_R = 200, PARTICLE_R = 16;


	window.GameCtrl.Main.prototype = {


		preload: function () {
			this.load.image('circle', 'img/circle.png');
			this.load.image('bg', 'img/bg.png');

		},
		createPin: function(x, y, dt, text){
			var ret = {x: x, y: y, dt: dt , text: text, sprite: null};

			ret.sprite = this.add.sprite(x, y, 'circle');
			ret.sprite.anchor.set(0.5);

			var style = { font: '15px Arial', fill: '#000', align: 'center' };
		    var t = this.add.text(0, 0, text, style);
		    t.anchor.set(0.5, 0.5);
		    ret.name = text;
		    ret.sprite.addChild(t);
		    return ret;
		},
		create: function () {
		    var bg = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');
			bg.tileScale.x = 480/900;
			bg.tileScale.y = 480/900;

			


			this.pins = [];
			this.toLaunch = [];
			this.pinMoving = [];
			this.gameover = false;
			this.tweenRunning = [];

			
			var _circle = this.add.graphics(0, 0);
			_circle
			.lineStyle(0)
    		.beginFill(0xFFFF83)
    		.drawCircle(100, 100, ORBIT_R)
    		.endFill();

    		this.centerCircle =  this.add.sprite(this.world.centerX, 350, _circle.generateTexture());
    		this.centerCircle.anchor.set(0.5);
    		_circle.clear();



    		var style = { font: '24px Arial', fill: '#000', align: 'center' };
		    var levelText = this.add.text(0, 0, 'Level 1', style);

		    levelText.anchor.set(0.5);
		    this.centerCircle.addChild(levelText);
		    
			
    		
			for(var i = 1; i < 8; i +=1){
				
				this.toLaunch.push(this.createPin(this.world.centerX, 650 + ((i-1) * 50),false , (8-i).toString()));
			}

			this.input.onDown.add(this.releasePin, this);


			var _rotationSprite = this.add.graphics(0, 0);
			_rotationSprite.lineStyle(2, 0x0000FF, 1);
    		_rotationSprite.drawRect(0, 0, 400, 400);

			this.rotationSprite = this.add.sprite(this.world.centerX, 350, _rotationSprite.generateTexture());
			_rotationSprite.clear();
			this.rotationSprite.anchor.set(0.5);
			
			var p = this.createPin(this.world.centerX + ORBIT_R, 150, 0 ,'');
			this.addToRotation(p);
			//var p = this.createPin(this.world.centerX + ORBIT_R, 150, Phaser.Math.radToDeg(Math.atan(ORBIT_R/ (32))) ,'dd');
			p = this.createPin(this.world.centerX + ORBIT_R, 150, 10 ,'dd');
			this.addToRotation(p);

			// aprox 10 degree 
			this._limitAngle = 10;


			this.rotationTween = this.add.tween(this.rotationSprite).to({angle: 360}, 4000, Phaser.Easing.Linear.None, true, 0, false);

			

		},

		addToRotation: function (pin) {
			if (pin.dt === false){
				pin.dt = -(this.rotationSprite.angle - 90);
			}
			var orbitRad = Phaser.Math.degToRad(pin.dt);

			var x = Math.cos(orbitRad) * ORBIT_R;
			var y = Math.sin(orbitRad) * ORBIT_R;

			pin.x = x;
			pin.y = y;

			pin.sprite.x = x;
			pin.sprite.y = y;
			this.rotationSprite.addChild(pin.sprite);


			var _line = this.add.graphics(0, 0);
			_line.lineStyle(2, 0xFFFF0B, 0.5);
			_line.moveTo(0, 0);
			//_line.lineTo(x, y);
			_line.lineTo(0, ORBIT_R);
			var s = this.add.sprite(0, 0, _line.generateTexture());
			s.anchor.set(0, 0);
			//s.angle = -this.rotationSprite.angle;
			s.angle = pin.dt - 90;
			
			this.rotationSprite.addChild(s);
			
			_line.clear();

			this.pins.push(pin);

			this.centerCircle.bringToTop();
		},
		releasePin: function(){
			if (this.gameover) {
				return;
			}
			
			if (this.toLaunch.length === 0) {
				return;
			}

			
			var current = this.toLaunch.shift();
			
			var tweenRunning = this.add.tween(current.sprite).to({y: 550}, 5000, Phaser.Easing.Linear.None, true)
			this.tweenRunning.push(tweenRunning);

			var position = this.pinMoving.length;

			this.pinMoving.push(current);

			for(var i = 0 ; i< this.toLaunch.length; i += 1){				
				this.add.tween(this.toLaunch[i].sprite).to({y: '-50'}, 50, Phaser.Easing.Linear.None, true);
			}

			tweenRunning.onComplete.add(function(){
				if(this.gameover){
					return;
				}

				this.checkIntersection();
				this.pinMoving.splice(position, 1);

				this.addToRotation(current)	;
				
				if (this.toLaunch.length == 0 && this.pinMoving.length == 0) {
					this.gameover = true;
					this.winAnimations();
					return;
				}
				


			}, this);
			


		},
		winAnimations: function(){
			var style = { font: '40px Arial', fill: '#FFF', fontWeight: '800', align: 'center' };
		    var t = this.add.text(this.world.centerX, -50, 'YOU WIN!', style);
		    t.anchor.set(0.5);
		    this.add.tween(t).to({y: '+100'}, 120, Phaser.Easing.Linear.None, true)
		    .onComplete.addOnce(function(){
		    	var style = { font: '32px Arial', fill: '#FFF', fontWeight: '800', align: 'center' };
			    var t = this.add.text(this.world.centerX, -50, 'TOUCH FOR NEXT LEVEL!', style);
			    t.anchor.set(0.5);
			    this.add.tween(t).to({y: '+180'}, 320, Phaser.Easing.Linear.None, true)
			    .onComplete.addOnce(function(){

			    });
		    }, this);

		    this.add.tween(t)
		    .to( { alpha: 0.6 }, 200, "Linear", true, 0, -1)
			.yoyo(true);


		    

//			this.state.start('Main');
		},
		update: function(){
			//console.log(Phaser.Math.degToRad(this.rotationSprite.angle);
			if(this.gameover){
				this.rotationTween.stop();
				return;
			}
			
			for(var i = 0, p; i < this.pins.length; i += 1) {
				p = this.pins[i].sprite.getChildAt(0);
				if (p) {
					p.angle = -this.rotationSprite.angle;
				}
			}

			this.checkIntersection();

			
		},
		circlesIntersect: function (s1, s2){
/*console.log(s1);
console.log(s2);
*/			
			var c1X = s1.x,c1Y=s1.y,c1Radius=s1.width / 2;
			var c2X = s2.x,c2Y=s2.y,c2Radius=s2.width / 2;
			var distanceX = c2X - c1X;
			var distanceY = c2Y - c1Y;


		    var magnitude = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
			return magnitude < (c1Radius + c2Radius);
		},
		checkIntersection: function(){
			if (this.pinMoving.length == 0) {
				return;
			}
			if (this.gameover) {
				return;
			}

			var orbitRad;
			var p, e;



			var _current = -(this.rotationSprite.angle - 90);
			var _pinsToCheck = [];
		
			for(var j = 0; j< this.pins.length; j += 1){
				p = this.pins[j];
				var _angle = Math.abs(Math.abs(p.dt - _current));
				if(_angle <= this._limitAngle) {
			
					_pinsToCheck.push(p);
				}
			}


			for(var i = 0; i< this.pinMoving.length; i += 1){
				e = this.pinMoving[i];
				// no in the collition path
				if(e.sprite.y > 550+32){
					continue;
				}

				for(var j = 0; j < _pinsToCheck.length; j += 1) {
					p = _pinsToCheck[j];

					orbitRad = Phaser.Math.degToRad(this.rotationSprite.angle+p.dt+180);

					var x = Math.cos(orbitRad) * ORBIT_R;
					var y = Math.sin(orbitRad) * ORBIT_R;
					var x2 = (this.world.centerX-e.sprite.x);
					var y2= 350-e.sprite.y;
					if (Phaser.Math.distance(x ,y ,x2 ,y2) < PARTICLE_R * 2) {
						p.sprite.tint = 0xCC0000;
						e.sprite.tint = 0xCC0000;
						this.gameover = true;
						this.rotationTween.stop();
						
this.tweenRunning.forEach(function(a){
						a.pause();
						console.log(stop);
					});
					
					}
				}
			}

			return;

			/*for(var i = 0; i< this.pins.length; i += 1){
				var y2= 350-e.sprite.y;
				//if (y2 > 200 + )
*/
			for(var i = 0, e; i < _pinsToCheck.length; i += 1) {
				e = _pinsToCheck[i];

				for(var j = 0; j < this.pinMoving.length; j += 1) {
					p = this.pinMoving[i];

					orbitRad = Phaser.Math.degToRad(this.rotationSprite.angle+p.dt);

					var x = Math.cos(orbitRad) * ORBIT_R;
					var y = Math.sin(orbitRad) * ORBIT_R;

					var x2 = (this.world.centerX-e.sprite.x)
					var y2= 350-e.sprite.y;
					console.log(Phaser.Math.distance(x , y , x2 , y2));
					
					if(this.circlesIntersect({x:x,y:y,width:p.sprite.width}, {x:x2,y:y2,width:e.sprite.width}
						)){
						p.sprite.tint = 0xCC0000;
						e.sprite.tint = 0xCC0000;
						this.gameover = true;
						
					}
				}
			}
			

		}

	};

})();