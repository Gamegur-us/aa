(function(){

	'use strict';


	window.GameCtrl = {
		/* Your game can check GameCtrl.orientated in internal loops to know if it should pause or not */
		orientated: false

	};


	GameCtrl.Boot = function () {
	};

	GameCtrl.Boot.prototype = {

		preload: function () {
		},

		create: function () {
			this.input.maxPointers = 1;
			this.stage.disableVisibilityChange = true;

			this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
                

			this.game.input.maxPointers = 1;
            this.game.stage.disableVisibilityChange = true;
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

               var aspect = 480 / 800;


                this.scale.pageAlignHorizontally = true;
                this.scale.pageAlignVertically = true;

            if (this.game.device.desktop) {
                this.scale.setMinMax(426, Math.floor(426 / aspect), 480, Math.floor(480 / aspect));
            } else {
            	var w = window.innerWidth;
                var h = window.innerHeight;
                var _w = w;
                var _h = Math.floor(w / aspect);
                if (_h > h) {
                    _w = Math.floor(h * aspect);
                    _h = h;
                }

                this.scale.setMinMax(_w /2, _h /2, _w, _h);
                this.scale.forceOrientation(true,false);
				/*this.scale.setResizeCallback(this.gameResized, this);
				this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
				this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);*/
				this.scale.setScreenSize(true);
			}

			this.state.start('Main');
		},

/*
		gameResized: function () {

			//  This could be handy if you need to do any extra processing if the game resizes.
			//  A resize could happen if for example swapping orientation on a device.

		},
   		enterIncorrectOrientation: function () {
/*
            GameCtrl.orientated = false;

            document.getElementById('orientation').style.display = 'block';* /

        },

        leaveIncorrectOrientation: function () {
/*
            GameCtrl.orientated = true;

            document.getElementById('orientation').style.display = 'none';

        }
*/
	};

})();