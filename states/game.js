/* global Phaser */
(function(){

	'use strict';
	var game;


	window.GameCtrl.Main = function () {
	};

	var CURRENT_LEVEL = 0;

	var pinsAngles = function(n){
		var r = [];
		i=0;
		var d = 360/n;
		for(var i = 0; i < n; i++){
			r.push(i*d);
		}
		return r;
	};

	var __LEVELS = [
		{
			'name': 'Level 1',
			'pinsToLaunch': 6,
			'pins': [],
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '-360'}, 5700, 'Linear', true, 0, false);
			}
		},
		{
			'name': 'Level 2',
			'pinsToLaunch': 6,
			'pins': pinsAngles(5),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '-360'}, 5000, 'Linear', true, 0, false);
			}
		},
		{
			'name': 'Level 3',
			'pinsToLaunch': 6,
			'pins': pinsAngles(6),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '+360'}, 5000, 'Linear', true, 0, false);
			}
		},
		{
			'name': 'Level 4',
			'pinsToLaunch': 6,
			'pins': pinsAngles(8),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '-360'}, 5000, 'Linear', true, 0, false);
			}
		},
		{
			'name': 'Level 5',
			'pinsToLaunch': 8,
			'pins': pinsAngles(9),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '-360'}, 5000, 'Linear', true, 0, false);
			}
		},
		{
			'name': 'Level 6',
			'pinsToLaunch': 9,
			'pins': pinsAngles(9),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '+360'}, 5000, 'Linear', true, 0, false);
			}
		},

		{
			'name': 'Level 7',
			'pinsToLaunch': 12,
			'pins': pinsAngles(7),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '+360'}, 5000, 'Linear', true, 0, false);
			}
		},
		{
			'name': 'Level 8',
			'pinsToLaunch': 12,
			'pins': pinsAngles(9),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '+360'}, 5000, 'Linear', true, 0, false);
			}
		},
		{
			'name': 'Level 9',
			'pinsToLaunch': 12,
			'pins': pinsAngles(7),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '-360'}, 4000, 'Linear', true, 0, false);
			}
		},
		{
			'name': 'Level 10',
			'pinsToLaunch': 13,
			'pins': pinsAngles(8),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '+360'}, 5500, 'Linear', true, 0, false);
			}
		},
		{
			'name': 'Level 11',
			'pinsToLaunch': 14,
			'pins': pinsAngles(9),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '-360'}, 5500, 'Linear', true, 0, false);
			}
		},
		{
			'name': 'Level 12',
			'pinsToLaunch': 13,
			'pins': pinsAngles(8),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '+360'}, 5000, 'Linear', true, 0, false);
			}
		},
		{
			'name': 'Level 13',
			'pinsToLaunch': 13,
			'pins': pinsAngles(7),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '-360'}, 4500, 'Linear', true, 0, false);
			}
		},
		{
			'name': 'Level 14',
			'pinsToLaunch': 16,
			'pins': pinsAngles(6),
			'rotation': function(){
				game.rotationTween = game.add.tween(LEVEL_rotationSprite).to({angle: '-360'}, 4500, 'Linear', true, 0, false);
			}
		}
	];
	

	var ORBIT_R = 200, PARTICLE_R = 16;
	var centerCircle;

	var LEVEL;
	var LEVEL_PINS = [];
	var LEVEL_pinMoving = [];
	var LEVEL_toLaunch = [];
	var LEVEL_tweenRunning = [];
	var LEVEL_ended;
	var LEVEL_gameover;
	var LEVEL_graphics;
	var LEVEL_bg;
	var LEVEL_time;
	var LEVEL_rotationSprite;
	var HUD_time;
	

	var Level = function (level) {
		LEVEL_ended = false;
	 	LEVEL_gameover = false;
		LEVEL_time = 0;
		
		LEVEL_PINS = [];
		LEVEL_pinMoving = [];
		LEVEL_toLaunch = [];
		LEVEL_tweenRunning = [];

		this.objects = game.add.group();
		var i, p;
		this.data=level;

		LEVEL_graphics = game.add.graphics(0, 0);
		LEVEL_graphics
		.lineStyle(0)
		.beginFill(0xFFFF83)
		//.drawCircle(100, 100, ORBIT_R)
		.drawCircle(100, 100, 140)
		.endFill();

		centerCircle =  game.add.sprite(game.world.centerX, 350, LEVEL_graphics.generateTexture());
		centerCircle.anchor.set(0.5);
		LEVEL_graphics.destroy();
		

		var style = { font: '24px Arial', fill: '#000', align: 'center' };
	    var levelText = game.add.text(0, 0, level.name, style);


	    levelText.anchor.set(0.5);
	    centerCircle.addChild(levelText);
	    
		
		this.objects.add(centerCircle);

		for(i = 0; i < level.pinsToLaunch; i +=1){
			p=game.createPin(game.world.centerX, 650 + (i * 50),false , (level.pinsToLaunch-i).toString());
			LEVEL_toLaunch.push(p);
			this.objects.add(p.sprite);
		}
		



		LEVEL_graphics = game.add.graphics(0, 0);
		LEVEL_graphics.width = ORBIT_R * 2;
		LEVEL_graphics.height = ORBIT_R * 2;

		LEVEL_rotationSprite = game.add.sprite(game.world.centerX, 350, LEVEL_graphics.generateTexture());
		
		LEVEL_graphics.destroy();
		
		LEVEL_rotationSprite.anchor.set(0.5);
		for(i = 0 ; i < level.pins.length; i += 1){
			p = game.createPin(game.world.centerX + ORBIT_R, 150, level.pins[i] ,(level.pinsToLaunch + 1 + i).toString());
			game.addToRotation(p);
		}
		
		this.objects.add(LEVEL_rotationSprite);

		level.rotation();

		this.objects.bringToTop(centerCircle);
    	this.objects.y += game.world.height;
    	


	};


	window.GameCtrl.Main.prototype = {


		preload: function () {
			//this.add.plugin(Phaser.Plugin.Debug);
			game = this;
			
		

			this.load.image('circle', 'img/circle.png');
			this.load.image('bg', 'img/bg.png');

		},
		createPin: function(x, y, dt, text){
			var ret = {x: x, y: y, dt: dt , text: text, sprite: null};

			ret.sprite = this.add.sprite(x, y, 'circle');
			ret.sprite.alpha=0.75;
			ret.sprite.anchor.set(0.5);

			var style = { font: '15px Arial', fill: '#000', align: 'center' };
		    var t = this.add.text(0, 0, text, style);
		    t.anchor.set(0.5, 0.5);
		    ret.name = text;
		    ret.sprite.addChild(t);
		    return ret;
		},
		create: function () {
			var style = { font: '15px Arial', fill: '#FFF', align: 'center' };
			HUD_time = this.add.text(this.world.width - 30 , 30, '', style);
			HUD_time.anchor.set(1, 0.5);
			LEVEL_bg = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'bg');
			
			LEVEL_bg.tileScale.x = 480/900;
			LEVEL_bg.tileScale.y = 480/900;
			LEVEL_bg.alpha = 0.2;
			this.stage.backgroundColor = '#282D33';
			



			this.STATE = ['first'];
			style = { font: '25px Arial', fill: '#FFF', align: 'center', fontWeight:'bold' };
			
			this.help = this.add.text(this.world.centerX , this.world.centerY, 'Touch anywhere to start. \n \n TAP TO RELEASE A DOT.\nJUST AVOID COLLISIONS.', style);
			this.help.anchor.set(0.5);
			

//game.add.tween(this.objects).to({y: '+'+game.world.height}, 1000, Phaser.Easing.Back.InOut, true, 0, false);
			// aprox 10 degree 
			this._limitAngle = 15;


			

			this.input.onDown.add(this.manageINPUT, this);
		},
		manageINPUT: function(){
			var s = this.STATE[0];
			if(s == 'wait'){
				return;
			}else if(s == 'first') {
				this.STATE = ['wait', 'play'];
				

				LEVEL = new Level(__LEVELS[CURRENT_LEVEL]);

				

				game.add.tween(LEVEL.objects).to({y: '-'+game.world.height}, 1000, Phaser.Easing.Exponential.Out, true).onComplete.add(function(){
					this.STATE.shift();
				}, this);
				game.add.tween(this.help).to({y: '-'+380}, 1000, Phaser.Easing.Exponential.Out, true);
				this.add.tween(LEVEL_bg.tilePosition).to({y: '+'+game.world.height}, 1000, Phaser.Easing.Exponential.Out,true);

			}else if(s == 'play') {
				if (!LEVEL_ended) {
					this.releasePin();
				}
			}else if(s == 'win') {
				var old = LEVEL;

				CURRENT_LEVEL += 1;
				LEVEL = new Level(__LEVELS[CURRENT_LEVEL]);

				this.STATE = ['wait', 'play'];
				
				this.add.tween(LEVEL_bg.tilePosition).to({y: '+'+game.world.height}, 1000, Phaser.Easing.Exponential.Out,true);
				
				game.add.tween(LEVEL.objects).to({y: '-'+game.world.height}, 1000, Phaser.Easing.Exponential.Out, true);
				game.add.tween(this.wintext1).to({y: '-'+game.world.height}, 1000, Phaser.Easing.Exponential.Out, true);
				game.add.tween(this.wintext2).to({y: '-'+game.world.height}, 1000, Phaser.Easing.Exponential.Out, true);
				game.add.tween(old.objects).to({y: '-'+game.world.height}, 1000, Phaser.Easing.Exponential.Out, true).onComplete.add(function(){
					this.STATE.shift();
					old.objects.destroy();
				}, this);
			}else if(s == 'lose') {
				var old = LEVEL;
				for(var i = 3; i < LEVEL_toLaunch.length; i++){
					
					LEVEL_toLaunch[i].sprite.alpha= 0 ;
				}

				LEVEL = new Level(__LEVELS[CURRENT_LEVEL]);

				this.STATE = ['wait', 'play'];

				
				game.add.tween(LEVEL.objects).to({y: '-'+game.world.height}, 1000, Phaser.Easing.Exponential.Out, true);
				game.add.tween(old.objects).to({y: '-'+game.world.height}, 1000, Phaser.Easing.Exponential.Out, true).onComplete.add(function(){
					this.STATE.shift();
					old.objects.destroy();
				}, this);
			}
		},
		triggerGameover:function (){
		},

		addToRotation: function (pin) {
			if (this.checkIntersection(pin)){
				return;
			}

			if (pin.dt === false){
				pin.dt = -(LEVEL_rotationSprite.angle - 90);
			}
			var orbitRad = Phaser.Math.degToRad(pin.dt);

			var x = Math.cos(orbitRad) * ORBIT_R;
			var y = Math.sin(orbitRad) * ORBIT_R;

			pin.x = x;
			pin.y = y;

			pin.sprite.x = x;
			pin.sprite.y = y;

			pin.sprite.getChildAt(0).destroy();
	
			
			LEVEL_rotationSprite.addChild(pin.sprite);
			
			LEVEL_graphics = game.add.graphics(0, 0);
			var _line = LEVEL_graphics;
			_line.lineStyle(2, 0xFFFF0B, 0.5);
			_line.moveTo(0, 0);
			//_line.lineTo(x, y);
			_line.lineTo(0, ORBIT_R - PARTICLE_R);
			var s = this.add.sprite(0, 0, _line.generateTexture());
			s.anchor.set(0, 0);
			//s.angle = -LEVEL_rotationSprite.angle;
			s.angle = pin.dt - 90;
			
			LEVEL_rotationSprite.addChild(s);
			LEVEL_graphics.destroy();
			

			LEVEL_PINS.push(pin);

			centerCircle.bringToTop();

		},
		releasePin: function(){
			
			if (LEVEL_toLaunch.length === 0) {
				return;
			}

			
			var current = LEVEL_toLaunch.shift();
			
			var tweenRunning = this.add.tween(current.sprite).to({y: 550}, 150, 'Linear', true);
			LEVEL_tweenRunning.push(tweenRunning);

			
			LEVEL_pinMoving.push(current);

			for(var i = 0 ; i< LEVEL_toLaunch.length; i += 1){				
				this.add.tween(LEVEL_toLaunch[i].sprite).to({y: '-50'}, 50, 'Linear', true);
			}
			current.endmoving=false;

			tweenRunning.onComplete.add(function(){
				if(LEVEL_ended){
					return;
				}

				this.checkIntersection();
				current.endmoving=true;

				this.addToRotation(current);
		
				this.add.tween(LEVEL_bg).to({alpha: 0.7}, 100, Phaser.Easing.Elastic.Out)
				.to({alpha: 0.2}, 100, Phaser.Easing.Exponential.Out)
				.start();

				if ((LEVEL.data.pins.length + LEVEL.data.pinsToLaunch) === LEVEL_PINS.length ) {
					LEVEL_ended = true;
					LEVEL_gameover = false;
					this.winAnimations();
					return;
				}
			}, this);
		},
		winAnimations: function(){
			this.STATE = ['wait', 'win'];
		    this.help.alpha= 0;
		    setTimeout(function(state){
		    	state.shift();
		    }, 300, this.STATE)
			var style = { font: '40px Arial', fill: '#FFF', fontWeight: '800', align: 'center' };
		    var t = this.add.text(this.world.centerX, -50, 'YOU WIN!', style);
		    this.wintext1 = t;
		    t.anchor.set(0.5);
		    this.add.tween(t).to({y: '+100'}, 120, 'Linear', true)
		    .onComplete.addOnce(function(){
		    	var style = { font: '32px Arial', fill: '#FFF', fontWeight: '800', align: 'center' };
			    var t = this.add.text(this.world.centerX, -50, 'TOUCH FOR NEXT LEVEL!', style);
			    this.wintext2 = t;
			    t.anchor.set(0.5);
			    this.STATE = ['win'];
			    this.add.tween(t).to({y: '+180'}, 320, 'Linear', true);
		    }, this);

		    this.add.tween(t)
		    .to( { alpha: 0.6 }, 200, 'Linear', true, 0, -1)
			.yoyo(true);


			//this.add.tween(LEVEL_bg.tilePosition).to({y: '+'+this.game.height}, this.game.height * 3, Phaser.Easing.Exponential.Out,true);
		    
//			this.state.start('Main');
		},
		update: function(){
			//console.log(Phaser.Math.degToRad(LEVEL_rotationSprite.angle);
			if (LEVEL_gameover) {
				this.rotationTween.stop();
				return;
			}
	
			if (!LEVEL_ended) {
				LEVEL_time += this.time.elapsedMS;
				HUD_time.setText((LEVEL_time / 1000).toFixed(2));
			}
			
			//this.checkIntersection();
			
			

			
		},
		checkIntersection: function (pinMoving) {
			if (LEVEL_ended) {
				return LEVEL_gameover;
			}

			if(!pinMoving){
				pinMoving = LEVEL_pinMoving;
			}
			if(pinMoving.length == 0){
				return false;
			}

			var orbitRad, _angle;
			var p, e, i, j;



			var _current = -(LEVEL_rotationSprite.angle - 90);
			var _pinsToCheck = [];
			var _movingPins = [];

			for(i = 0; i < pinMoving.length; i += 1){
				e=pinMoving[i];

				// no in the collition path
				if (!e.endmoving && e.sprite.y > 550+32){
					continue;
				}
				_movingPins.push(e);
			}

			if(_movingPins.length === 0){
				return false;
			}
		
			for(j = 0; j< LEVEL_PINS.length; j += 1){
				p = LEVEL_PINS[j];
				_angle = Math.abs(p.dt - _current);
				if (_angle <= this._limitAngle) {
					_pinsToCheck.push(p);
				}
			}


			var ret = false;
			for(i = 0; i < _movingPins.length; i += 1){
				e = _movingPins[i];
				
				for(j = 0; j < _pinsToCheck.length; j += 1) {
					p = _pinsToCheck[j];

					if(p.text == e.text) continue;
					
/*					orbitRad = Phaser.Math.degToRad(-(LEVEL_rotationSprite.angle - 90));

					var x2 = Math.cos(orbitRad) * ORBIT_R;
					var y2 = Math.sin(orbitRad) * ORBIT_R;*/
					var x2, y2,x,y;
					if (!e.endmoving) {
						orbitRad = Phaser.Math.degToRad(LEVEL_rotationSprite.angle+p.dt+180);

						x = Math.cos(orbitRad) * ORBIT_R;
						y = Math.sin(orbitRad) * ORBIT_R;
						
						x2 = (this.world.centerX-e.sprite.x);
						y2 = 350-e.sprite.y;
					} else {
						x=p.x;
						y=p.y;
						x2 = e.x;
						y2 = e.y;
						
					}
					if (Phaser.Math.distance(x ,y ,x2 ,y2) < PARTICLE_R * 2) {
						game.add.tween(p.sprite).to({tint: 0xCC0000}, 100, 'Linear', true);
						game.add.tween(e.sprite).to({tint: 0xCC0000}, 100, 'Linear', true);

						/*p.sprite.tint = 0xCC0000;
						e.sprite.tint = 0xCC0000;*/
						LEVEL_ended = true;
						LEVEL_gameover = true;
						this.STATE = ['lose'];
						this.rotationTween.stop();
						LEVEL_tweenRunning.forEach(function(a){
							a.pause();
						});

						this.triggerGameover();
						return true;
					
					}
				}
			}

			LEVEL_pinMoving= LEVEL_pinMoving.filter(function(e){ return !e.endmoving; });

			return ret;
			
		}

	};

})();