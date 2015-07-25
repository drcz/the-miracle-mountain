var canvas=document.getElementById("ekraniszcze");
var screen_w=canvas.width;
var screen_h=canvas.height;
var context=canvas.getContext("2d");


var cursign = '';
var mousepos=[0,0];
var CX=-8; var CY=-6;

/*document*/canvas.onmousemove = function(e) {
    var posX = e.offsetX; ///e.clientX;
    var posY = e.offsetY; ///e.clientY;
    mousepos=[Math.floor(posX/32.0)+CX,Math.floor(posY/32.0)+CY];
    document.getElementById('position').innerHTML = '('+mousepos[0]+','+mousepos[1]+') center ('+CX+','+CY+')';
    cursign = '{'+document.getElementById('signature').value+',"x":'+mousepos[0]+',"y":'+mousepos[1]+'}';
    document.getElementById('fullsign').innerHTML = cursign;
    return(mousepos);
}


window.addEventListener('keydown',
			function(evt) {
			    if(evt.keyCode==37) {CX--;} /// left arrow 37
			    if(evt.keyCode==39) {CX++;} /// right arrow 39
			    if(evt.keyCode==38) {CY--;} /// up arrow 38
			    if(evt.keyCode==40) {CY++;} /// down arrow 40
			    /// and some fire button?
			    document.getElementById('position').innerHTML = '('+mousepos[0]+','+mousepos[1]+') center ('+CX+','+CY+')';
			    if(evt.keyCode>=37 && evt.keyCode<=40) evt.preventDefault();
			},
			false);


var CURTYPE='EMPTY1';

var load_image=function(url){
    var i=new Image();
    i.src='img/'+url;
    return(i);
};

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
//Sprites['WALL2'] = {'1':load_image('kafel-25.png')};
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
//Sprites['ROCKS'] = {'1':load_image('kafel-33.png')};
Sprites['ROCKS'] = {'u':load_image('kafel-33g.png'), 'd':load_image('kafel-33d.png'), 'l':load_image('kafel-33l.png'), 'r':load_image('kafel-33p.png')};

Sprites['DETONATOR'] = {'1':load_image('kafel-34.png')};
Sprites['TRACKS'] = {'h':load_image('kafel-35h.png'), 'v':load_image('kafel-35v.png')};
Sprites['CART_ROBOT'] = {'u':load_image('kafel-36g.png'), 'd':load_image('kafel-36d.png'), 'l':load_image('kafel-36l.png'),'r':load_image('kafel-36p.png')};
Sprites['CRATE'] = {'h':load_image('kafel-37h.png'),'v':load_image('kafel-37v.png')};
//Sprites['PIPE-DR'] = {'1':load_image('kafel-38.png')};
//Sprites['PIPE-DL'] = {'1':load_image('kafel-38l.png')};
Sprites['PIPE-TURN'] = {'l':load_image('kafel-38l.png'), 'r':load_image('kafel-38p.png'), 'u':load_image('kafel-38g.png'), 'd':load_image('kafel-38d.png')};

Sprites['ANT2'] = {'u':load_image('kafel-39g.png'), 'd':load_image('kafel-39d.png'), 'l':load_image('kafel-39l.png'),'r':load_image('kafel-39p.png')};
Sprites['BOMB_METER'] = {'l':load_image('kafel-40l.png'),'r':load_image('kafel-40p.png')};
//Sprites['WALL3'] = {'1':load_image('kafel-41p.png')};
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


///////////
Sprites['EMPTY1'] = {'1':load_image('kafel-49.png')};
Sprites['EMPTY2'] = {'1':load_image('kafel-50.png')};
Sprites['EMPTY3'] = {'1':load_image('kafel-52.png')};
Sprites['EMPTY_GLITCH1'] = {'1':load_image('kafel-51.png')};
Sprites['EMPTY_GLITCH2'] = {'1':load_image('kafel-53.png')};
Sprites['EMPTY_GLITCH3'] = {'1':load_image('kafel-54.png')};

/*
var str='';
for(var i=0;i<Object.keys(Sprites).length;i++) {
    var key=Object.keys(Sprites)[i];
    var val=Sprites[key];
    for(var j=0;j<Object.keys(val).length;j++) {
	var key2=Object.keys(val)[j];
	var str = str +key+' img/'+val[key2].src.split("/img/")[1]+' {"type":"'+key+'", "dx":0, "dy":0, "rad":0, "facing":"'+key2+'"}';
	if(i<Object.keys(Sprites).length-1 || j<Object.keys(val).length-1) str=str + ",\n";
	else str=str+"\n";
    }
}
console.log(str);
*/

///////////////////////////////////////////////////////////////////////////////

var WORLD=[
    	{"index":0,"type":"HERO","x":0,"y":0,"dx":0,"dy":0,"facing":"l","inventory":{}}
];

draw_editor=function(world,cx,cy) {
    var tile_w=32;
    var tile_h=32;
    var adjust_x=0-CX;
    var adjust_y=0-CY;
    context.fillStyle="#fceb04";
    context.fillRect(0,0,screen_w,screen_h);
    context.beginPath();
    context.strokeStyle="#ff0000";
    context.lineWidth="3";

    for(var i=0;i<world.length;i++) {
	var object=world[i];
	if(object==null) continue; /// ,,notreached''
	var x=(object.x+adjust_x)*tile_w;
	var y=(object.y+adjust_y)*tile_h;
	///if(Sprites[object.type] == undefined) console.log('nie ma sprajta dla '+object.type+'!');
	if(x>0 && y>0 && x<screen_w && y<screen_h) {
	    var sprite = Sprites[object.type];
	    if(sprite['1']!=null) sprite=sprite['1'];
	    else { // if(sprite['h']!=null) {
	    	sprite=sprite[object.facing];
	    } //else if(sprite['r']!=null) {
		//sprite=sprite[object.facing];
//	    }
	    /* TODO: obiekty radioaktywne wiesz
	    if(Math.random()>0.99) {
		sprite=Sprites['glitch0'];
	    }
	    */
	    context.drawImage(sprite, x, y);
	}
    }

    var cur_x=tile_w*(mousepos[0]+adjust_x);
    var cur_y=tile_h*(mousepos[1]+adjust_y);
    var cursprite=Sprites[CURTYPE]['1'];
    if(cursprite==null) cursprite = Sprites[CURTYPE]['r'];
    if(cursprite==null) cursprite = Sprites[CURTYPE]['h'];
    context.drawImage(cursprite,cur_x,cur_y);
    
    context.rect(cur_x+1,cur_y+1,tile_w-1,tile_h-1);
    context.stroke();
//    context.drawImage(sprites['cursor'], tile_w*mousepos[0],tile_h*mousepos[1]);
}


setInterval(function(){
    draw_editor(WORLD, CX,CY);
//    WORLD=world_step(WORLD);
//    reset_JOYSTICK();
},167);


var out = [];



set_signature = function(s) {
    document.getElementById('signature').value=s;
    if(s=='"type":"null"') CURTYPE='EMPTY1';
    else {
	var type=s.split('"type":"')[1].split('"')[0];
	CURTYPE = type;
    }
//    alert(s);
};


save_world = function(world) {
    world=new_world_order(world);
    var str="world = [\n";
    for(var i=0;i<world.length;i++) {
	str+=JSON.stringify(world[i]);
	if(i<world.length-1) str+=",\n";
	else str+="\n";
    }
    str+="];\n";
    return(str);
};

show_result = function(id) {
    document.getElementById(id).innerHTML=save_world(WORLD);
//    console.out(save_world(WORLD));
};

var find_by_pos=function(world, x,y) {
    for(var i=0;i<world.length;i++) {
	var obj=world[i];
	if(obj!=null && obj.x==x && obj.y==y) return(obj);
    }
    return(null);
};


canvas.onmousedown = function(e) {
    //    console.log(cursign);
    if(e.offsetX>0 && e.offsetX<screen_w && e.offsetY>0 && e.offsetY<screen_h) {
	var obj=JSON.parse(cursign);
	var target=find_by_pos(WORLD,mousepos[0],mousepos[1]);
	if(obj.type=='null') {
	    if(target!=null) {
		console.log('delete:');
		console.log(target);
		WORLD=delete_object(WORLD,target);
	    }
	} else {
	    if(target==null) WORLD = insert_object(WORLD,obj);
	    console.log('create:');
	    console.log(obj);
	}
	//    console.log(WORLD);
    }
    return(true); //?!
}


var insert_object=function(world, obj) {
    obj.index=world.length;
    if(obj.dx==null) obj.dx=0;
    if(obj.dy==null) obj.dy=0;
    world[obj.index]=obj;
    return(world);
};

var update_object=function(world, obj) {
    world[obj.index]=obj;
    return(world);
};

var delete_object=function(world, obj) {
    world[obj.index]=null;
    world=new_world_order(world);
    return(world);
};

var new_world_order=function(world) {
    var new_world=[];
    for(var i=0;i<world.length;i++) {
	var obj=world[i];
	if(obj!=null) {
	    obj.index=new_world.length;
	    new_world[obj.index]=obj;
	}
    }
    return(new_world);
};
