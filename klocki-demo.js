/// input ///

var JOYSTICK = {'dx':0, 'dy':0, 'fire':false};

var SUICIDE_PILL = false;

var reset_JOYSTICK = function() {
    JOYSTICK.dx=0; JOYSTICK.dy=0;
    JOYSTICK.fire=false;
};

window.addEventListener('keydown',
			function(evt) {
			    /// "joystick"
			    if(evt.keyCode==37) {JOYSTICK.dx=-1; JOYSTICK.dy=0;} /// left arrow 37
			    if(evt.keyCode==39) {JOYSTICK.dx=1;  JOYSTICK.dy=0;} /// right arrow 39
			    if(evt.keyCode==38) {JOYSTICK.dy=-1; JOYSTICK.dx=0;} /// up arrow 38
			    if(evt.keyCode==40) {JOYSTICK.dy=1;  JOYSTICK.dx=0;} /// down arrow 40
			    ///
			    if(evt.keyCode==83) {if(['GAME','SMALL_MESSAGE'].indexOf(GAME_STATE)>=0) SUICIDE_PILL = true;} /// 's' 83
			    ///
			    if(evt.keyCode==81 && GAME_STATE=='GAME' && LEVEL<5) {GAME_STATE='NEXT_LEVEL';} /// 'q' 81
			    if(evt.keyCode==87 && GAME_STATE=='GAME' && LEVEL>1) {LEVEL=LEVEL-2;GAME_STATE='NEXT_LEVEL';} /// 'w' 87

			    if(JOYSTICK.dx!=0 || JOYSTICK.dy!=0) evt.preventDefault(); /// co by nie skakala stronka...

			},
			false);

window.addEventListener('keyup',
			function(evt) {
			    //reset_JOYSTICK();
			},
			false);


/// output ///
var canvas=document.getElementById("ekraniszcze");
var screen_w=canvas.width;
var screen_h=canvas.height;
var context=canvas.getContext("2d");


/// graphics
var load_image=function(url){
    var i=new Image();
    i.src=('img/'+url);
    return(i);
};

var Sounds = {};
var __sounds_max_index = 8;

var __add_sound = function(name, url) {
    Sounds[name+'_index']=0;
    Sounds[name]=[];
    for(var i=0;i<__sounds_max_index;i++) {
	Sounds[name].push(new Audio(url));
    }
};

__add_sound('walk','snd/walk.ogg');
__add_sound('boom','snd/bomb.ogg');
__add_sound('push','snd/push.ogg');
__add_sound('pick','snd/key.ogg');
__add_sound('act','snd/act.ogg');
__add_sound('fall','snd/fall.ogg');
__add_sound('gong','snd/gong.ogg');
__add_sound('death','snd/death.ogg');
__add_sound('fx1','snd/fx1.ogg');
__add_sound('squeak','snd/squeak.ogg');

var PLAY = function(sample) {    
    var index=Sounds[sample+'_index'];
    if(sample=='walk') Sounds[sample][index].volume=0.5+0.5*(Math.random());
    Sounds[sample][index].play();
    Sounds[sample+'_index']=(index+1)%__sounds_max_index;
}


var tile_w=32;
var tile_h=32;
var Sprites = {};

Sprites['HERO'] = {'u':load_image('kafel-1g.png'), 'd':load_image('kafel-1d.png'), 'l':load_image('kafel-1l.png'),'r':load_image('kafel-1p.png')};
Sprites['BARREL'] = {'h':load_image('kafel-2h.png'),'v':load_image('kafel-2v.png')};
Sprites['PU'] = {'1':load_image('kafel-3.png')};
Sprites['CART_HERO'] = {'u':load_image('kafel-4g.png'), 'd':load_image('kafel-4d.png'), 'l':load_image('kafel-4l.png'),'r':load_image('kafel-4p.png')};
Sprites['GUN'] = {'u':load_image('kafel-5g.png'), 'd':load_image('kafel-5d.png'), 'l':load_image('kafel-5l.png'),'r':load_image('kafel-5p.png')};
Sprites['EXTINGUISHER'] = {'1':load_image('kafel-6.png')};
Sprites['SUIT'] = {'1':load_image('kafel-7.png')};
Sprites['MIRROR'] = {'l':load_image('kafel-8l.png'), 'r':load_image('kafel-8r.png')};
Sprites['HERO_SUIT'] = {'u':load_image('kafel-9g.png'), 'd':load_image('kafel-9d.png'), 'l':load_image('kafel-9l.png'),'r':load_image('kafel-9p.png')};
Sprites['GASBULLET'] = {'1':load_image('kafel-10.png')};
Sprites['ROBOT'] = {'u':load_image('kafel-11g.png'), 'd':load_image('kafel-11d.png'), 'l':load_image('kafel-11l.png'),'r':load_image('kafel-11p.png')};
Sprites['CART_HERO_SUIT'] = {'u':load_image('kafel-12g.png'), 'd':load_image('kafel-12d.png'), 'l':load_image('kafel-12l.png'),'r':load_image('kafel-12p.png')};
Sprites['PARTICLE'] = {'1':load_image('kafel-13.png')};
Sprites['FUSE'] = {'1':load_image('kafel-14.png')};
Sprites['HOLDER'] = {'l':load_image('kafel-15l.png'), 'r':load_image('kafel-15p.png'),'d':load_image('kafel-15d.png'), 'u':load_image('kafel-15g.png')};
Sprites['EXIT'] = {'1':load_image('kafel-16.png')};
Sprites['WALL'] = {'u':load_image('kafel-17g.png'), 'd':load_image('kafel-17d.png'), 'l':load_image('kafel-17l.png'),'r':load_image('kafel-17p.png')};
Sprites['DOOR'] = {'1':load_image('kafel-18.png')};
Sprites['JOYSTICK'] = {'1':load_image('kafel-19.png')};
Sprites['CART_BOMB'] = {'u':load_image('kafel-20g.png'), 'd':load_image('kafel-20d.png'), 'l':load_image('kafel-20l.png'),'r':load_image('kafel-20p.png')};
Sprites['BOOM'] = {'1':load_image('kafel-21.png')};
Sprites['MACHINE'] = {'l':load_image('kafel-22l.png'),'r':load_image('kafel-22p.png'), 'd':load_image('kafel-22d.png'),'u':load_image('kafel-22d.png')};
Sprites['MACHINE_B'] = {'l':load_image('kafel-22l.png'),'r':load_image('kafel-22p.png'), 'd':load_image('kafel-22d.png'),'u':load_image('kafel-22d.png')};
Sprites['BOMB_A'] = {'1':load_image('kafel-23.png')};
Sprites['BOMB_H'] = {'1':load_image('kafel-24.png')};

Sprites['WALL2'] = {'l':load_image('kafel-25l.png'), 'r':load_image('kafel-25p.png')};
Sprites['KEY'] = {'1':load_image('kafel-26.png')};
Sprites['LEVER'] = {'l':load_image('kafel-27l.png'), 'r':load_image('kafel-27p.png')};
Sprites['LEVER_OF_DOOM1'] = {'l':load_image('kafel-27l.png'), 'r':load_image('kafel-27p.png')};
Sprites['LEVER_OF_DOOM2'] = {'l':load_image('kafel-27l.png'), 'r':load_image('kafel-27p.png')};
Sprites['CART_PU'] = {'u':load_image('kafel-28g.png'), 'd':load_image('kafel-28d.png'), 'l':load_image('kafel-28l.png'),'r':load_image('kafel-28p.png')};
Sprites['FIRE'] = {'1':load_image('kafel-29.png'),'2':load_image('kafel-29b.png')};
Sprites['WATER'] = {'1':load_image('kafel-30.png'),'2':load_image('kafel-30b.png')};
Sprites['ANT'] = {'u':load_image('kafel-31g.png'), 'd':load_image('kafel-31d.png'), 'l':load_image('kafel-31l.png'),'r':load_image('kafel-31p.png')};
Sprites['ANT_CORPSE'] = {'1':load_image('kafel-32.png')};

Sprites['ROCKS'] = {'u':load_image('kafel-33g.png'), 'd':load_image('kafel-33d.png'), 'l':load_image('kafel-33l.png'), 'r':load_image('kafel-33p.png')};

Sprites['DETONATOR'] = {'1':load_image('kafel-34.png')};
Sprites['TRACKS'] = {'h':load_image('kafel-35h.png'), 'v':load_image('kafel-35v.png')};
Sprites['CART_ROBOT'] = {'u':load_image('kafel-36g.png'), 'd':load_image('kafel-36d.png'), 'l':load_image('kafel-36l.png'),'r':load_image('kafel-36p.png')};

Sprites['CRATE'] = {'h':load_image('kafel-37h.png'),'v':load_image('kafel-37v.png')};

Sprites['PIPE-TURN'] = {'l':load_image('kafel-38l.png'), 'r':load_image('kafel-38p.png'), 'u':load_image('kafel-38g.png'), 'd':load_image('kafel-38d.png')};

Sprites['ANT2'] = {'u':load_image('kafel-39g.png'), 'd':load_image('kafel-39d.png'), 'l':load_image('kafel-39l.png'),'r':load_image('kafel-39p.png')};
Sprites['BOMB_METER'] = {'l':load_image('kafel-40l.png'),'r':load_image('kafel-40p.png')};

Sprites['WALL3'] = {'u':load_image('kafel-41g.png'), 'd':load_image('kafel-41d.png'), 'l':load_image('kafel-41l.png'),'r':load_image('kafel-41p.png')};

Sprites['BOMB'] = {'1':load_image('kafel-42.png')};
Sprites['CART_EMPTY'] = {'u':load_image('kafel-44g.png'), 'd':load_image('kafel-44d.png'), 'l':load_image('kafel-44l.png'),'r':load_image('kafel-44p.png')};
Sprites['PIPE'] = {'h':load_image('kafel-45h.png'), 'v':load_image('kafel-45v.png')};

Sprites['TURNCOCK'] = {'v':load_image('kafel-46v.png'),'h':load_image('kafel-46h.png')};
Sprites['TURNCOCK_ACTIVE'] = {'v':load_image('kafel-46v.png'),'h':load_image('kafel-46h.png')};

Sprites['EGG'] = {'v':load_image('kafel-47v.png'),'h':load_image('kafel-47h.png')};

Sprites['SPANNER'] = {'1':load_image('kafel-48.png')};
Sprites['HOLE'] = {'1':load_image('kafel-55.png')};
Sprites['GRASS'] = {'1':load_image('kafel-56.png')};
Sprites['SMOKE'] = {'u':load_image('smoke-1g.png'),'d':load_image('smoke-1d.png'),'l':load_image('smoke-1l.png'),'r':load_image('smoke-1p.png')};

Sprites['TELEPORT'] = {'h':load_image('kafel-45h.png'), 'v':load_image('kafel-45v.png')}; // :D

///////////
Sprites['EMPTY1'] = {'1':load_image('kafel-49.png')};
Sprites['EMPTY2'] = {'1':load_image('kafel-50.png')};
Sprites['EMPTY3'] = {'1':load_image('kafel-52.png')};
Sprites['EMPTY_GLITCH1'] = {'1':load_image('kafel-51.png')};
Sprites['EMPTY_GLITCH2'] = {'1':load_image('kafel-53.png')};
Sprites['EMPTY_GLITCH3'] = {'1':load_image('kafel-54.png')};

///Sprites['glitch0'] = load_image('smoke-1p.png');

//// letters [21x21]:
var letter_size = 21;
Sprites['A'] = load_image('kafel-A.png');
Sprites['B'] = load_image('kafel-B.png');
Sprites['C'] = load_image('kafel-C.png');
Sprites['D'] = load_image('kafel-D.png');
Sprites['E'] = load_image('kafel-E.png');
Sprites['F'] = load_image('kafel-F.png');
Sprites['G'] = load_image('kafel-G.png');
Sprites['H'] = load_image('kafel-H.png');
Sprites['I'] = load_image('kafel-I.png');
Sprites['J'] = load_image('kafel-J.png');
Sprites['K'] = load_image('kafel-K.png');
Sprites['L'] = load_image('kafel-L.png');
Sprites['M'] = load_image('kafel-M.png');
Sprites['N'] = load_image('kafel-N.png');
Sprites['O'] = load_image('kafel-O.png');
Sprites['P'] = load_image('kafel-P.png');
Sprites['Q'] = load_image('kafel-Q.png');
Sprites['R'] = load_image('kafel-R.png');
Sprites['S'] = load_image('kafel-S.png');
Sprites['T'] = load_image('kafel-T.png');
Sprites['U'] = load_image('kafel-U.png');
Sprites['V'] = load_image('kafel-V.png');
Sprites['W'] = load_image('kafel-W.png');
Sprites['X'] = load_image('kafel-X.png');
Sprites['Y'] = load_image('kafel-Y.png');
Sprites['Z'] = load_image('kafel-Z.png');
Sprites['0'] = load_image('kafel-d0.png');
Sprites['1'] = load_image('kafel-d1.png');
Sprites['2'] = load_image('kafel-d2.png');
Sprites['3'] = load_image('kafel-d3.png');
Sprites['4'] = load_image('kafel-d4.png');
Sprites['5'] = load_image('kafel-d5.png');
Sprites['6'] = load_image('kafel-d6.png');
Sprites['7'] = load_image('kafel-d7.png');
Sprites['8'] = load_image('kafel-d8.png');
Sprites['9'] = load_image('kafel-d9.png');
Sprites['plus'] = load_image('kafel-plus.png');
Sprites['hyphen'] = load_image('kafel-hyphen.png');
Sprites['excl'] = load_image('kafel-excl.png');
Sprites['dot'] = load_image('kafel-dot.png');
Sprites['colon'] = load_image('kafel-colon.png');
Sprites['comma'] = load_image('kafel-comma.png');
Sprites['quest'] = load_image('kafel-quest.png');
Sprites['space'] = load_image('kafel-space1.png');
Sprites['space2'] = load_image('kafel-space2.png');
Sprites['space3'] = load_image('kafel-space3.png');
Sprites['space4'] = load_image('kafel-space4.png');
Sprites['space5'] = load_image('kafel-space5.png');
/////////////////////////////////////////////////////////////////////////////

var text2image = function(text,x,y) {
    var letter_sprites=[];
    for(var i=0;i<text.length;i++) {
	var ch=text[i];
	var sprname='space';
	switch(ch) {
	case '.': sprname = 'dot'; break;
	case ':': sprname = 'colon'; break;
	case '!': sprname = 'excl'; break;
	case '?': sprname = 'quest'; break;
	case '+': sprname = 'plus'; break;
	case '-': sprname = 'hyphen'; break;
	case ',': sprname = 'comma'; break;
	case '0': case '1': case '2': case '3': case '4':
	case '5': case '6': case '7': case '8': case '9':
	    sprname=ch;
	    break;
	case 'A': case 'B': case 'C': case 'D':	case 'E': case 'F': case 'G': case 'H':
	case 'I': case 'J': case 'K': case 'L':	case 'M': case 'N': case 'O': case 'P':
	case 'Q': case 'R': case 'S': case 'T':	case 'U': case 'V': case 'W': case 'X':
	case 'Y': case 'Z':
	    sprname = ch;
	    break;
	default:
	    if(Math.random()>0.69) {
		sprname='space2';
	    } else if(Math.random()>0.69) {
		sprname='space3';
	    } else if(Math.random()>0.69) {
		sprname='space4';
	    }
	}
	/// TODO: tu wklejamy sprajta sprname na img...
	letter_sprites.push(sprname);	
    }
    return(letter_sprites);
}

var small_message_timeout = 0;
var small_message_text = '';

var SET_SMALL_MESSAGE = function(msg) {
    small_message_text = msg;
    small_message_timeout = 5;
    GAME_STATE = 'SMALL_MESSAGE';
};
var SET_SMALL_MESSAGE_INTRO = function(msg,to) {
    small_message_text = msg;
    small_message_timeout = to;
    GAME_STATE = 'SMALL_MESSAGE_INTRO';
};


var big_message_timeout = 0;
var big_message_texs = [];

var SET_BIG_MESSAGE = function(msg) {
    big_message_texts = msg;
    big_message_timeout = 5;
    reset_JOYSTICK();
    GAME_STATE = 'BIG_MESSAGE';
    /////PLAY('fx1'); /// ?!
};


var gameover_timeout = 0;

var anim_frame=0; /// crappy animation effect...

var draw_sheet = function(dx,dy, glitch_freq) {
    /// build sheet of paper
    for(var x=0;x<screen_w;x+=tile_w) {
    	for(var y=0;y<screen_h;y+=tile_h) {
	    var sprite = Sprites['EMPTY1'];
	    switch(Math.floor(Math.random()*5)) {
	    case 0:
	    case 1:
	    case 2:
		sprite = Sprites['EMPTY1'];
		break;
	    case 3:
		sprite = Sprites['EMPTY2'];
		break;
	    default:
		sprite = Sprites['EMPTY3'];
	    };
	    if(Math.random() < glitch_freq/66 /* *64>63.0 */) {
		switch(Math.floor(Math.random()*5)) {
		case 0:
		case 1:
		case 2:
		    sprite = Sprites['EMPTY_GLITCH1'];
		    break;
		case 3:
		    sprite = Sprites['EMPTY_GLITCH2'];
		    break;
		default:
		    sprite = Sprites['EMPTY_GLITCH3'];
		}
	    }
	    context.drawImage(sprite['1'], x+dx, y+dy);
	}
    }
}

var draw_world = function(world, center_x, center_y, quake_r, quake_freq, flash) {

    var screen_h2=screen_h-2*tile_h; /// miejsce na statusbox "na dole"...

    if(anim_frame++>5) anim_frame=0;
    var dx=0;
    var dy=0;
    if(Math.random()>0.33) {
	dx=Math.floor(Math.random()*1.99)-1;
//	dy=Math.floor(Math.random()*1.99)-1;
    }
    if(quake_r>0 && Math.random()<=quake_freq) {
        if(Math.random()<0.666)
	    dx+=Math.floor(Math.random()*quake_r)-(quake_r*0.5);
	else dy+=Math.floor(Math.random()*quake_r)-(quake_r*0.5);
    }
    var mid_tile_x=Math.floor(screen_w/(tile_w*2.0));
    var mid_tile_y=Math.floor(screen_h2/(tile_h*2.0));
    var adjust_x=mid_tile_x-center_x;
    var adjust_y=mid_tile_y-center_y;

    /// draw background:
    /*
    context.fillStyle="#fceb04";
    context.fillRect(0,0,screen_w,screen_h);
    */

    /// use radiation level at where the hero is as the base for the frequency of glitches...
    var current_radiation_dose = radiation_dose_at(world,center_x,center_y);
    if(WORLD_quake_r>26) current_radiation_dose+=WORLD_quake_r*0.17+Math.floor(Math.random()+1);
    draw_sheet(dx,dy, current_radiation_dose);

    if(flash) return([dx,dy]); // !!!!

    /// and now the objects...
    for(var i=0;i<world.length;i++) {
	var object=world[i];
	if(object==null) continue; /// ,,notreached''
	var x=(object.x+adjust_x)*tile_w;
	var y=(object.y+adjust_y)*tile_h;
	///if(Sprites[object.type] == undefined) console.log('nie ma sprajta dla '+object.type+'!');
	if(x>=-1 && y>=-1 && x<=screen_w && y<=screen_h2) {
	    var sprite = Sprites[object.type];

	    if(object.type=='HERO' && object.inventory["SUIT"]>0) sprite = Sprites['HERO_SUIT'];
	    if(object.type=='CART_HERO' && object.inventory["SUIT"]>0) sprite = Sprites['CART_HERO_SUIT'];

	    if(sprite['1']!=null) {
		/// wacky animation effects for water and fire
		if(sprite['2']!=null &&
		   ((object.type=='WATER' && (anim_frame<3?i%2==0:i%2==1))
		    || (object.type=='FIRE' && (anim_frame%2==0?i%2==0:i%2==1))))
		    sprite=sprite['2'];
		else sprite=sprite['1'];
	    } else sprite=sprite[object.facing];

	    /*
	    /// "radiation-induced blink" effect:	   
	    var chance_on_blink=Math.floor(10*radiation_dose_at(world,object.x,object.y)/66.6);
	    if(chance_on_blink>(Math.random()*9.3)) {
		sprite=Sprites['BOOM']['1'];
		///console.log(chance_on_blink);
	    }
	    */

	    /*
	    if(Math.random()>0.66
	       && object.type!='HERO'
	       && object.type!='HERO_SUIT'
	       && object.type!='ROCKS'
	       && object.type!='WALL'
	       && object.type!='WALL2'
	       && object.type!='WALL3') { /// ?!
		dx1=Math.floor(Math.random()*1.99)-1;
		dy1=Math.floor(Math.random()*1.99)-1;
		context.drawImage(sprite, x+dx+dx1, y+dy+dy1);
	    } else
	    */
	    context.drawImage(sprite, x+dx, y+dy);
	}
    }

    /// statusbox

    if(GAME_STATE == 'INTRO'
    || GAME_STATE == 'SMALL_MESSAGE_INTRO')
    return([dx,dy]); // no status on intro mister.

    // LIVES:&&&&& PACK:XXXXXX    
    var y=screen_h2+tile_h; /// !
    var x=10;
    /*
    var letters=text2image('LIVES:');
    for(var i=0;i<letters.length;i++) {
	var dy2=Math.floor(Math.random()*1.99)-1 - 3; /// !
	var sprite=Sprites[letters[i]];
	context.drawImage(sprite,x+dx,y+dy+dy2);
	x=x+letter_size;
    }   
    x+=2; /// !
    */

    for(var i=0;i<LIVES;i++) {
	var dy2=0;//Math.floor(Math.random()*1.99)-1;
	dy2-=14;  /// !
	sprite = Sprites['HERO']['r'];
	context.drawImage(sprite,x+dx,y+dy+dy2);
	x+=32;
    }
    x+=11; /// !
    /*
    letters=text2image('PACK:');    
    for(var i=0;i<letters.length;i++) {
	var dy2=Math.floor(Math.random()*1.99)-1 - 3; /// !
	var sprite=Sprites[letters[i]];
	context.drawImage(sprite,x+dx,y+dy+dy2);
	x=x+letter_size;
    }
    x+=2; /// !
    */
    x+=tile_w; /// !

    var hero=find_hero(world);
    if(hero) {
	var inv=Object.keys(hero.inventory);
	for(var i=0;i<inv.length;i++) {
	    var key=inv[i];
	    if(hero.inventory[key]==0) continue;
	    var dy2=0;//Math.floor(Math.random()*1.99)-1;
	    dy2-=14; /// !
	    sprite = Sprites[inv[i]]['1'];
	    context.drawImage(sprite,x+dx,y+dy+dy2);
	    x+=tile_w;
	    letters = text2image("X"+hero.inventory[inv[i]]);
	    x+=10;
	    for(var j=0;j<letters.length;j++) {
		var dy2=Math.floor(Math.random()*1.99)-1 - 3; /// !
		var sprite=Sprites[letters[j]];
		context.drawImage(sprite,x+dx,y+dy+dy2);
		x=x+letter_size;
	    }
	    x+=11;//tile_w;
	}
    }
    ///////////

    return([dx,dy]);
};

var draw_small_message = function(text, dx,dy) {
    var letters=text2image(text);
    var y=screen_h/2-2*tile_h; /// !
    var x=screen_w/2-(letters.length)*letter_size/2 +1; /// !
    for(var i=0;i<letters.length;i++) {
	//dx2=Math.floor(Math.random()*1.99)-1;
	var dy2=Math.floor(Math.random()*1.99)-1;
	var sprite=Sprites[letters[i]];
	context.drawImage(sprite,x+dx,y+dy+dy2);
	x=x+letter_size;
    }
}


var draw_big_message = function(texts) {
    var dx=0;
    var dy=0;
    if(Math.random()>0.33) {
	dx=Math.floor(Math.random()*1.99)-1;
//	dy=Math.floor(Math.random()*1.99)-1;
    }
    draw_sheet(dx,dy,0.23);   

    for(var j=0;j<texts.length;j++) {
	var text=texts[j];
	var letters=text2image(text);
	var y=64+j*tile_h;
	var x=screen_w/2-(letters.length)*letter_size/2;
	for(var i=0;i<letters.length;i++) {
	//dx2=Math.floor(Math.random()*1.99)-1;
	    var dy2=0;///Math.floor(Math.random()*1.99)-1;
	    var sprite=Sprites[letters[i]];
	    context.drawImage(sprite,x+dx,y+dy+dy2);
	    x=x+letter_size;
	}
    }
}

//////////////////////////////////

var __clone = function(obj) { /// TMP for inventory only...
    var newobj = {};
    var inv=Object.keys(obj);
    for(var i=0;i<inv.length;i++) {
	var key=inv[i];
        if(obj[key]==0) continue;
	newobj[key] = obj[key];
    }
    return(newobj);
};


/// game state ////////////////////////////////////////////////////////////////

var WORLD = [];
var MESSAGES = [];
var LEVEL = 1;
var STARTING_INVENTORY = {};
var STARTING_ABSORBED = Math.ceil(Math.random()*7);
var MAX_LIVES = 4;
var LIVES = MAX_LIVES;

var ABSORBED = 0.0;
var CZAD = 0.0;

var ADDCZAD=function(a) {
    CZAD+=a;
    if(CZAD<0) CZAD=0;
};

/// ready, steady, tanz mit klocuszki:

var last_hero_x = 0;
var last_hero_y = 0;

var GAME_STATE = 'PRE-SCREEN';///'TITLE';


var draw_first_info = function() {
    draw_big_message([
	'HEADPHONES HEAVILY RECOMMENDED.',
	'',
//    	'THIS IS AN ALPHA VERSION.',
	'',
    //	'THE ACTUAL GAME IS FAR AWAY.',
	'ARROW KEYS -- CONTROL',
	'MOVE OR ACT OTHERWISE',
	'',
	'S KEY -- EAT CYANIDE AMPOULE',
	'+JUST IN CASE+',
	'',
	'',
	'ANY MOVE TO SKIP THE INTRO.',
	'',	
	'',
	'',
	'-- ANY MOVE TO START --'	
    ]);
};

var draw_title = function() {
    draw_big_message([
	              '',
		      'T H E',
		      'M I R A C L E',
		      'M O U N T A I N',
		      '',
		      '',
		      'COPYLEFT MMXV GDANSK,GDYNIA',
		      '',
		      '',
		      '',
		      'THIS IS A TEASER ONLY.',
	//'THE ACTUAL GAME IS FAR AWAY.',
		      '',
		      '',
		      '-- ANY MOVE TO START --'
]);
};


var draw_death = function() {  
    var msg='';
    var any_key = '';
    if(gameover_timeout<1) any_key = '-- ANY MOVE TO CONTINUE --';
    if(small_message_text!='') msg = small_message_text;
    draw_big_message(['',
		      '',
		      '',
		      '',
		      'KUANYSZ IS DEAD.',
		      '',
		      msg,
		      '',
		      '',
		      '',		      
		      any_key]);
};

var draw_gameover = function() {  
    var msg='';
    var any_key = '';
    if(gameover_timeout<1) any_key = '-- ANY MOVE TO CONTINUE --';
    if(small_message_text!='') msg = small_message_text;
    draw_big_message(['',
		      '',
		      '',
		      '',
		      'GAME OVER',
		      '',
		      msg,
		      '',
		      '',
		      '',
		      any_key]);
};

var draw_nextlevel= function() {
    draw_big_message(['',
		      '',
		      '+ LEVEL '+(LEVEL+1)+' +',
		      '',
		      '',
		      'KUANYSZ CLIMBS DOWNWARDS',
		      'BY A VERY NARROW TUNNEL...',
		      '',
		      '',
		      '',
		      '',
		      '-- ANY MOVE TO CONTINUE --']);
};


var draw_coda =function() {
    draw_big_message(['',
		      '',
		      '',
		      '',
		      'THE MOUNTAIN BECOMES',
		      'A RADIOACTIVE VOLCANO...',
		      'IT WILL SHROUD THE EARTH',
		      'WITH A  P L U M E',
		      'WHICH CEASES ALL LIFE.',
		      '',
		      'WELL DONE KUANYSZ!',
		      ''
		     ]);
};


var rotate_rocks = function(world) {
    for(var i=0;i<world.length;i++) {
	var obj=world[i];
	if(obj.type=='ROCKS') {
	    obj.facing = random_facing();
	    world[i]=obj;
	} else if(obj.type=='WALL3') {
	    obj.facing = random_facing();

	    switch(Math.floor(Math.random()*4)) {
	    case 0: obj['facing']='u'; break;
	    case 1: obj['facing']='d'; break;
	    case 2: obj['facing']='l'; break;
	    case 3: obj['facing']='r'; break;
	    }
	    world[i]=obj;
	}
    }
    return(world);
};

var rotate_random_items = function(world, prob) {
    for(var i=0;i<world.length;i++) {
	var obj=world[i];
	if(Math.random()>prob) continue;
	switch(obj.type) {
	case 'ROCKS':
	case 'WALL3':
	    /// todo: perhaps some other stuff?
	    switch(Math.floor(Math.random()*4)) {
	    case 0: obj['facing']='u'; break;
	    case 1: obj['facing']='d'; break;
	    case 2: obj['facing']='r'; break;
	    case 3: obj['facing']='l'; break;
	    }
	default: continue;
	}
    }
    return(world);
};



var put_fire_everywhere = function(world) {
    for(var i=0;i<world.length;i++) {
	if(Math.random()>0.888) continue;
	var obj=world[i];
	if(obj==null) continue;
	switch(obj.type) {
	case 'GASBULLET':
	case 'BOMB':
	case 'CART_BOMB':
	    world = explosion_big(world,obj);
	    break;
	case 'CRATE':
	case 'GRASS':
	case 'HOLDER':
	case 'GUN':
	case 'ANT_CORPSE':
	case 'MACHINE':
	case 'MACHINE_B':
	case 'CART_EMPTY':
	case 'BOMB_METER':
	case 'A-BOMB':
	case 'DOOR':
	case 'LEVER':
	    world = explosion_fire(world, obj);
	    break;
	}
    }
    world = new_world_order(world);
    return(world);
};

var WORLD_flash = false;
var WORLD_flash_timeout = 3;

var SET_flash = function(timeout) {
    WORLD_flash = true;
    WORLD_flash_timeout = timeout;
};

var WORLD_doom = false;
var WORLD_doom_clock = 6;

//var radiation_sicness_hidden_time = 666.0;
var last_radiation_sickness_alert = -1;

var suit_sweat = 0;

var SET_worlddoom = function() { WORLD_doom=true; };

var WORLD_rotate_timeout=5;

var WORLD_quake_r = 0;
var WORLD_quake_freq = 0.0;
var WORLD_quake_timeout = 0;

var SET_quake = function(r,freq,to) {
    WORLD_quake_r = r;
    WORLD_quake_freq = freq*1.0;
    WORLD_quake_timeout = to;
};



var LOAD_LEVEL=function() {
    switch(LEVEL) {
    case 1:
	WORLD = load_level1(GAME_STATE=='INTRO');
	if(MESSAGES==false) {
	    if(GAME_STATE=='INTRO') {
		MESSAGES = load_intro_messages();
		MESSAGES = MESSAGES.concat(load_level1_messages());
	    } else {
		MESSAGES = load_level1_messages();
	    }
	}
	break;
    case 2:
	WORLD = load_level2();
	if(MESSAGES==false) MESSAGES = load_level2_messages();
	break;
    case 3:
	WORLD = load_level3();
	if(MESSAGES==false) MESSAGES = load_level3_messages();
	break;
    case 4:
	WORLD = load_level4();
	if(MESSAGES==false) MESSAGES = load_level4_messages();
	break;
    case 5:
	WORLD = load_level5();
	if(MESSAGES==false) MESSAGES = load_level5_messages();
	break;
    }
    WORLD = rotate_rocks(WORLD);
    var hero = find_hero(WORLD);
    hero.inventory = __clone(STARTING_INVENTORY);
    ABSORBED = STARTING_ABSORBED;
    WORLD = update_object(WORLD, hero);
    return(true);
};

setInterval(function(){

    switch(GAME_STATE) {

    case 'PRE-SCREEN':
	draw_first_info();
	if(JOYSTICK.dx!=0 || JOYSTICK.dy!=0) {
	    GAME_STATE = 'SET_INTRO';
	}
	break;

    case 'TITLE':
	draw_title();
	if(JOYSTICK.dx!=0 || JOYSTICK.dy!=0) {
	    GAME_STATE = 'GAME';
	    //SET_SOUNDTRACK("track1");
	    LEVEL=1;
	    MESSAGES = false;
	    LOAD_LEVEL();
	}
	break;

	case 'DEATH':
	SUICIDE_PILL=false;
	 WORLD_doom = false; // !!
	 WORLD_doom_clock = 6; // !!

	PLAY('death');
	if(LIVES<=0) {
	    GAME_STATE = 'GAMEOVER';
	    gameover_timeout=7;
	} else {
	    GAME_STATE = 'DEATH2';		
	    gameover_timeout=5;
	}
	break;

    case 'DEATH2':
	draw_death();
	if(gameover_timeout-- < 0) {
	    if(JOYSTICK.dx!=0 || JOYSTICK.dy!=0) {
		/// laduj ost. level i back do gry
		LIVES--;	    
		LOAD_LEVEL();
		GAME_STATE = 'GAME'; //?
	    }
	}
	break;
	
    case 'GAMEOVER':
	draw_gameover();
	if(gameover_timeout-- < 0)
	    GAME_STATE = 'GAMEOVER2';
	break;

    case 'GAMEOVER2':
	draw_gameover();
	if(JOYSTICK.dx!=0 || JOYSTICK.dy!=0) {	
	    LIVES = MAX_LIVES;
	    GAME_STATE = 'SET_INTRO'; //'TITLE';
	}
	break;

    case 'CODA':
	draw_coda();
	//	if(JOYSTICK.dx!=0 || JOYSTICK.dy!=0) GAME_STATE = 'TITLE';
	break;

    case 'NEXT_LEVEL':
	draw_nextlevel();
	if(JOYSTICK.dx!=0 || JOYSTICK.dy!=0) {
	    var hero = find_hero(WORLD);
	    STARTING_INVENTORY = __clone(hero.inventory); /// ?! jakiś clone?? TODO !!!
	    STARTING_ABSORBED = ABSORBED;
	    //CZAD=0;
	    LEVEL++;
	    MESSAGES = false;
	    LOAD_LEVEL();
	    GAME_STATE = 'GAME';
	}
	break;

    case 'BIG_MESSAGE':
	draw_big_message(big_message_texts);
	if(big_message_timeout-- < 0) {	
	    big_message_texts.push("");
	    big_message_texts.push("-- ANY MOVE TO CONTINUE --");
	    GAME_STATE = 'BIG_MESSAGE2';
	}
	break;

    case 'BIG_MESSAGE2': /// to samo co BIG_MESSAGE ale czeka na ruch
	/// bo inaczej jak się szybko idzie to big message można przeoczyć
	/// -- więc te big_message_timeout taktów czekamy bezwarunkowo.
	draw_big_message(big_message_texts);
	if(JOYSTICK.dx!=0 || JOYSTICK.dy!=0) {
	    GAME_STATE = 'GAME'; 
	    big_message_texts = [];
	}
	break;

    case 'DOOM':
	if(WORLD_doom_clock--<0) {
	    GAME_STATE = 'CODA';
	}
	var dxdy=draw_world(WORLD, last_hero_x,last_hero_y, WORLD_quake_r, WORLD_quake_freq, WORLD_flash);
	break;

    case 'SET_INTRO':
	//SET_SOUNDTRACK("track1");
	GAME_STATE = 'INTRO';
	STARTING_INVENTORY = {};
	LEVEL=1;
	CZAD=0;
	SUICIDE_PILL=false;
	MESSAGES = false;
	LOAD_LEVEL();
	SET_flash(10);
    new Audio('snd/ost.ogg').play()
	break;

    case 'INTRO':
	if(JOYSTICK.dx!=0 || JOYSTICK.dy!=0) {
	    GAME_STATE = 'GAME';
	    //SET_SOUNDTRACK("track1");
	    LEVEL=1;
	    MESSAGES = false;
	    LOAD_LEVEL();
	    reset_JOYSTICK();
	    SET_SMALL_MESSAGE('HI!');
	}
	/// sic! no break
    case 'GAME':
    case 'SMALL_MESSAGE':
    case 'SMALL_MESSAGE_INTRO':

	if(GAME_STATE=='SMALL_MESSAGE_INTRO' && (JOYSTICK.dx!=0 || JOYSTICK.dy!=0)) {
	    GAME_STATE = 'GAME';
	    //SET_SOUNDTRACK("track1");
	    LEVEL=1;
	    MESSAGES = false;
	    LOAD_LEVEL();
	    reset_JOYSTICK();
	    SET_SMALL_MESSAGE('HI!');
	}


	var hero=find_hero(WORLD);
	if(hero!=null /*&& (hero.type=='HERO' || hero.type=='CART_HERO')*/) {
	    last_hero_x = hero.x;
	    last_hero_y = hero.y;
	} else {	    
	    GAME_STATE = 'DEATH';
	    gameover_timeout=6;
	    break;
	}
	var dxdy=draw_world(WORLD, last_hero_x,last_hero_y, WORLD_quake_r, WORLD_quake_freq, WORLD_flash);
	if(GAME_STATE == 'SMALL_MESSAGE'
	  || GAME_STATE == 'SMALL_MESSAGE_INTRO') {
	    var dx=dxdy[0];
	    var dy=dxdy[1];
	    draw_small_message(small_message_text, dx,dy);
	    if(small_message_timeout-- < 0) {
		if(GAME_STATE == 'SMALL_MESSAGE_INTRO')
		    GAME_STATE = 'INTRO';
		else GAME_STATE = 'GAME';
		small_message_text = '';
	    }
	}
	WORLD=world_step(WORLD);

	/// irradiation:
	if(GAME_STATE == 'GAME' && Math.random()<0.666) { /// i small_message?...
	    var current_radiation_dose = radiation_dose_at(WORLD,last_hero_x,last_hero_y);
	    if(WORLD_quake_r>26) current_radiation_dose+=WORLD_quake_r*0.17+Math.floor(Math.random()+1);	
	    ABSORBED+=0.2*current_radiation_dose + 0.0666*Math.random();
	}
	/// radiation sickness?
	new_radiation_sickenss_alert = Math.floor((ABSORBED-222.6+Math.random()*23.0)/400.0);
	if(new_radiation_sickenss_alert > last_radiation_sickness_alert) {
	    switch(new_radiation_sickenss_alert) {    
	    case 0: msg="KUANYSZ FEELS DIZZY."; break;
	    case 1: msg="IT IS VERY HOT IN HERE."; break;
	    case 2: msg="KUANYSZ FEELS A SLIGHT HEADACHE."; break;
	    case 3: msg="IT IS VERY HOT IN HERE."; break;
	    case 4: msg="KUANYSZ FEELS HEADACHE."; break;
	    case 5: msg="KUANYSZ VOMITS."; break;
	    case 6: msg="IT IS SO COLD IN HERE..."; break;
	    case 7: msg="THE HEADACHE IS GETTING PRETTY SERIOUS."; break;
	    case 8: msg="KUANYSZ VOMITS."; break;
	    case 9: msg="KUANYSZ VOMITS WITH BLOOD."; break;
	    default: msg='';
	    }
	    if(msg!='') {
		SET_SMALL_MESSAGE(msg);
		last_radiation_sickness_alert = new_radiation_sickenss_alert;
	    }
	}

	/// causing death?
	if(ABSORBED > 4224 + Math.floor(Math.random()*66.6)) {
	    SET_SMALL_MESSAGE("KUANYSZ DIES OF RADIATION POISONING.");
	    WORLD=delete_object(WORLD, hero);
	}

	//////////////////
	// novum^2: zaczadzenie
	var sm_n=find_all_by_pos(WORLD,hero.x,hero.y-1);
	var sm_s=find_all_by_pos(WORLD,hero.x,hero.y+1);
	var sm_e=find_all_by_pos(WORLD,hero.x+1,hero.y);
	var sm_w=find_all_by_pos(WORLD,hero.x-1,hero.y);

	var sm_sum=0;
	if(sm_n.length>0 && sm_n[0].type=='SMOKE') sm_sum++;
	if(sm_s.length>0 && sm_s[0].type=='SMOKE') sm_sum++;
	if(sm_e.length>0 && sm_e[0].type=='SMOKE') sm_sum++;
	if(sm_w.length>0 && sm_w[0].type=='SMOKE') sm_sum++;
	if(hero.inventory['SUIT']>0) {
	    if(sm_sum>0) ADDCZAD(0.93);
	} else ADDCZAD(sm_sum*0.69);
	//console.log(CZAD);

	if(CZAD>99+Math.random()*23.23) {
	    SET_SMALL_MESSAGE("...FROM CARBON MONOXIDE POISONING.");
	    WORLD=delete_object(WORLD, hero);
	    CZAD=0.0; // !!
	}

	/////////////////////////
	/// novum: suicide
	if(SUICIDE_PILL) {
	    var hero = find_hero(WORLD);
	    SET_SMALL_MESSAGE('POOR KUANYSZ COMMITS SUICIDE!');
	    WORLD = delete_object(WORLD,hero);
	    SUICIDE_PILL = false;
	}
	/////////////////////

	break;
    }
    reset_JOYSTICK();

    if(WORLD_flash) {
	if(WORLD_flash_timeout--<1) {
	    WORLD_flash = false;
	}
    }

    if(WORLD_doom) {
	if(WORLD_doom_clock-- <= 0) {
	    GAME_STATE = 'CODA';
	}
    }
    
    WORLD_quake_timeout--;
    if(WORLD_quake_timeout<1) {
	WORLD_quake_timeout=0;
	WORLD_quake_r=0;
    }


    /*
    /// jeszcze trochę fx:
    if(WORLD_rotate_timeout--<=0) {
	WORLD = rotate_random_items(WORLD,0.066);
	WORLD_rotate_timeout=2;//2+Math.floor(Math.random()*6);
    }
    */
    
    /// boom done.

},136); //167);


