///////////////////////////////////////////////////////////////////////////////////////
/// World := [Object] -- in our case the world is the totality of things, not facts. //
///////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////
/// ,,read''

var find_all_by_label=function(world, label) {
    var found=[];
    for(var i=0;i<world.length;i++) {
	var obj=world[i];
	if(obj!=null && obj.label==label) found.push(obj);
    }
    return(found);
};

var find_all_by_pos=function(world, x,y) {
    var found=[];
    for(var i=0;i<world.length;i++) {
	var obj=world[i];
	if(obj!=null && obj.x==x && obj.y==y) found.push(obj);
    }
    return(found);
};

/// ...I don't think we'll have more than one object occupying single location.
var find_by_pos=function(world, x,y) {
    for(var i=0;i<world.length;i++) {
	var obj=world[i];
	if(obj!=null && obj.x==x && obj.y==y) return(obj);
    }
    return(null);
};



var find_hero=function(world) {
    for(var i=0;i<world.length;i++) {
	var obj=world[i];
	if(obj!=null
	   && (obj.type=='HERO' || obj.type=='CART_HERO')) return(obj);
    }
    return(null); /// lost life?
};


//// novum: radiation issues [TODO: sickness??]

/// some kind of metrics...
var dist=function(x1,y1,x2,y2) {
    var dx=Math.abs(x1-x2);
    var dy=Math.abs(y1-y2);
    return Math.max(dx,dy);
    ///return(dx*dx+dy*dy);
};

/// locate all nearby radiation sources
var find_radioactive_near=function(world,x,y) {
    var near_distance=5; /// const!
    var found=[];    
    for(var i=0;i<world.length;i++) {
	var obj=world[i];
	if(obj!=null && obj.radiation>0 && dist(obj.x,obj.y,x,y)<=near_distance) found.push(obj);
    }
    return(found);
};

/// and now...
var radiation_dose_at=function(world,x,y) {
    var dose=0.0;
    var sources=find_radioactive_near(world,x,y);
    for(var i=0;i<sources.length;i++) {
	var source=sources[i];
	/// this should be probably the square of distance, but dist(...) is not euclidean anyway.
	dose += source.radiation / (1.0+dist(source.x,source.y,x,y));
    }
    return(dose); /// no point figuring out what the dose unit is.
};


/////////////////////////////////////////////////
/// ,,write''

var insert_object=function(world, obj) {
    obj.index=world.length;
    world[obj.index]=obj;
    return(world);
};

var update_object=function(world, obj) {
    if(world[obj.index]!=null) world[obj.index]=obj; /// ??
    return(world);
};

var delete_object=function(world, obj) {
//    console.log('delete');
//    console.log(obj);
    world[obj.index]=null;
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


/////////////////////////////////////////////////
/// now the movements...
/////////////////////////////////////////////////

/////////////////////////////////////////////////
/// A) bumping

var identity_collision=function(world, obj1, obj2) { return(world); };

var signum=function(n) { if(n==0) return 0; else if(n<0) return -1; else return 1; };

var dxdy2facing=function(dx,dy) {
    var facing = 'r';
    if(dx>0) facing='r';
    else if(dx<0) facing='l';
    else if(dy>0) facing='d';
    else if(dy<0) facing='u';
    return facing;
};

var facing2dxdy=function(facing) {
    var dx = 0;
    var dy = 0;
    switch(facing) {
    case 'u': dy--; break;
    case 'd': dy++; break;
    case 'l': dx--; break;
    case 'r': dx++; break;
    }
    return([dx,dy]);
};


/// push something and move to its previous position
var collision_push=function(world, o1, o2) {
    var x=o2.x;
    var y=o2.y;
    var dx=signum(o2.x-o1.x);
    var dy=signum(o2.y-o1.y);
    world=move_object(world, o2, x+dx,y+dy);
    var is_it_still_there=find_by_pos(world, x,y);
    if(is_it_still_there==null) {
	o1.x=x;
	o1.y=y;
	world=update_object(world, o1);
	PLAY('push');
    } // else { console.log('still there!'); console.log(is_it_still_there); }
    return(world);
};

/// push something and move to its previous position
var collision_set_in_motion=function(world, o1, o2) {
    var x=o2.x;
    var y=o2.y;
    var dx=signum(o2.x-o1.x);
    var dy=signum(o2.y-o1.y);
    o2.dx=dx;
    o2.dy=dy;
    o2.facing=dxdy2facing(dx,dy);
    world=update_object(world, o2);
    PLAY('act');
    return(world);
};

var collision_annihilate=function(world, o1, o2) {
    //if(o1.persistent!=1)
    world=delete_object(world, o1); // !!
    if(o2.persistent!=1) world=delete_object(world, o2);
    //PLAY('pick');    
    return(world);
};

var collision_ant_kills=function(world, o1, o2) {
    if(o1.type=='ANT') {
	world=delete_object(world, o2);
    } else {
	world=delete_object(world, o1);
    }
    SET_SMALL_MESSAGE("GOT KILLED BY THE ANT."); /// przez symetrie z wpadaniem, no...
    return(world);
};


var collision_nothing=function(world, o1, o2) {
    if(Math.random()<0.77)  SET_SMALL_MESSAGE('NOTHING HAPPENS.');
    return(world);
};



var collision_someting=function(world, o1, o2) {
    var msgs=null;
    if(o1.type=='HERO'
      && o1.inventory['FUSE']>0
      && Math.random()<0.93) {
	if(o2.type=='MACHINE' /* && o2.working==1*/) {
	    var msgs=[];
	    switch(Math.floor(Math.random()*10.1)) {
	    case 0:
	    case 1:
	    case 2:
		/// explosion
		var month='MARCH';
		if(Math.random()>0.5) month='AUGUST';
		var year=1961 + Math.floor(Math.random()*29.001);
		var yeild=5;
		var pleple='GREAT ';
		switch(Math.floor(Math.random()*4)) {
		case 0:
		case 1: pleple='MEMORABLE '; break;
		case 2: pleple='DOUBLE '; break;
		case 3: pleple=''; break;
		}
		if(Math.random()>0.8317952) {
		    /// large yeild
		    yeild+=55+Math.floor(Math.random()*13)*10;
		} else {
		    /// small yeild
		    yeild+=Math.floor(Math.random()*17);
		}
		if(Math.random()>0.666) yeild*=20;
		var mood='PASSIONATE';
		if(yeild<10) mood='GENTLE';
		else if(yeild<60) mood='FIRM';
		else if(yeild<100) mood='INTENSIVE';
		msgs=['I REMEMBER',
		      'THE '+pleple+'TEST',
		      'OF '+month+' '+year,
		      'VERY '+mood+', '+yeild+'KT.',
		      '',''
		     ];
		break;
	    case 3:
	    case 4:
		if(LEVEL<3) {
		    /// hole
		    msgs=['I HAVE HEARD THAT',
		    	  'THERE IS A MAGICAL',
			  'OBJECT CALLED',
			  'THE H O L E.',
			  'I ALSO HEARD',
			  'IT REPRESENTS A MAN.',
			  ''
			 ];
		} else {
		    msgs=['HMM... WHO ARE YOU?',''];
		}
		break;
	    case 5:
	    case 6:
		/// beamsting
		msgs=['THERE WAS SOME RESEARCH',
		      'ON A MAGICAL WEAPON,',
		      '+ B E A M S T I N G +',
		      '',
		      'I BARELY REMEMBER THAT...',
		      '',
		      'THEY USED THOSE BIG PIPES',
		      'TO CONDUCT',
		      'A BEAM',
		      'OF LETHAL LIGHT.',
		      ''
		     ];
		break;

	    case 7:
		msgs=[		    
		    'IT WAS NOT ONLY',
		    'THE WEAPONS THEY',
		    'STUDIED IN HERE,',
		    'BUT THE MOUNTAIN',
		    'ITSELF...',
		    ''
		];
		break;

	    case 8:
		msgs=[
		    'BE CAREFUL KUANYSZ,',
		    'THERE ARE',
		    'L O T S OF',
		    'TRAPS HERE...',
		    ''
		];
		break;

	    case 9:
		msgs=[
		    'THIS MIRACLE MOUNTAIN',
		    'IS A SORT OF FUSE...',
		    'A GLOBAL FUSE...',
		    ''
		];
		break;



	    default:
		msgs=['WELL...',
		      'THE MILITARY',
		      'CAME AND WENT.',
		      '',
		      'THEY TRIED TO PLUMB',
		      'THESE TUNNELS',
		      'BUT SOONAFTER',
		      'THE WEIRD NOISES',
		      'STARTED HERE...',
		      ''
		];
	    }
	    o1.inventory['FUSE']--;
	    world=update_object(world,o1);
	    o2.wasted=1;
	    world=update_object(world,o2);
	    SET_BIG_MESSAGE(['','THE MACHINE SAYS:'].concat(msgs));
	    //	    console.log('jjo');
	}
    }
    return(world);
};



var collision_fall_into=function(world, o1, o2) {
    var world=collision_annihilate(world, o1, o2);
    var o1_name = o1.type;
    var o2_name = o2.type;
    if(o1_name=='HERO') o1_name ='KUANYSZ';
     else o1_name = 'THE '+ o1_name;
        
    var dh = o1.x-last_hero_x;
    var dv = o1.y-last_hero_y;
    if(dh*dh+dv+dv<49) { /// close enough... !!	
	SET_SMALL_MESSAGE(o1_name+' FELL INTO THE '+o2_name);
    }
    ///console.log(o1_name+' FELL INTO '+o2_name+''+o1.x+','+o1.y);
    world=insert_object(world, new_boom(o2.x,o2.y,1));
    PLAY('fall'); /// PLAY('fx1');
    return(world);
}

/// change something's facing [u,d,l,r]
var collision_face=function(world, o1, o2) {
    var dx=signum(o2.x-o1.x);
    var dy=signum(o2.y-o1.y);
    o2.facing = dxdy2facing(dx,dy);
    world=update_object(world, o2);
    return(world);
};

var collision_pickup=function(world,o1,o2) {
    var item=o2.type;
    if(typeof o1.inventory[item] == "undefined") o1.inventory[item]=0;
    o1.inventory[item]++;
    world = update_object(world,o1);
    //console.log(o1.inventory); /// dbg
    world = delete_object(world,o2);
    SET_SMALL_MESSAGE('FOUND '+("AEIOUY".indexOf(o2.type[0])>-1?'AN':'A')+' '+o2.type+'.');
    PLAY('pick');
    return(world);
};

var collision_dummy_lever=function(world,o1,o2) {
/// TODO -- żeby coś się działo przy jebnięciu w ten levar... -- to będzie rodzina procedur? --> na razie wylacza dzialka...
    if(o2.facing=='r') o2.facing='l';
    else o2.facing='r';
    world=update_object(world, o2);
    /// turn on/off the guns, or sth...
    var set_to_on=(o2.facing=='l');
    var children=find_all_by_label(world, o2['label']);
    for(var i=0;i<children.length;i++) {
	var child=children[i];
	if(child.type=='GUN' /* !!! */) {
	    child.on=set_to_on;
	    world=update_object(world, child);
	}
    }
    SET_SMALL_MESSAGE("PULLED THE LEVER TO THE "+(o2.facing=='r'?"RIGHT":"LEFT")+".");
    PLAY('act');
    return(world);
};

var _doom_=0;
var collision_doomlever=function(world,o1,o2) {
/// TODO -- żeby coś się działo przy jebnięciu w ten levar... -- to będzie rodzina procedur? --> na razie wylacza dzialka...
    if(o2.facing=='r') {
	o2.facing='l';
	world=update_object(world, o2);
	PLAY('act');
	world = rotate_rocks(world);
	world = put_fire_everywhere(world);
	SET_quake(27,0.91,54321);
	SET_flash(2);
	SET_worlddoom();
        SET_SMALL_MESSAGE("PULLED THE LEVER OF DOOM TO THE "+(o2.facing=='r'?"RIGHT":"LEFT")+".");
    } else {
        PLAY('act'); /// PLAY('fx1');
	_doom_++;	
	if(_doom_>5) _doom_=5;
	world = rotate_rocks(world);
	world = delete_object(world, o2);
	world = insert_object(world, new_fire(o2.x, o2.y, 23));
	SET_quake(44+_doom_*_doom_,0.96-0.01*_doom_,54321);
	SET_flash(1);	
        SET_SMALL_MESSAGE("DO NOT DO THAT!");
    }
    return(world);
};


var collision_try_to_open=function(world,o1,o2) {    
    if(o1.inventory['KEY']>0) {
	o1.inventory['KEY']--;
	world=update_object(world, o1);
	world=delete_object(world, o2);
	SET_SMALL_MESSAGE("KUANYSZ UNLOCKS THE DOOR.");
	PLAY('act');
    } else SET_SMALL_MESSAGE("THE DOOR SEEMS LOCKED.");
    return(world);
};

var collision_try_to_put_out=function(world,o1,o2) {
    if(o1.inventory['EXTINGUISHER']>0) {
	o1.inventory['EXTINGUISHER']--;
	world=update_object(world, o1);
	world=delete_object(world, o2);
	SET_SMALL_MESSAGE('PUT THE FIRE OUT WITH EXTINGUISHER.');
	PLAY('act');
    } else {
	/// TODO: tu będzie w else śmierć bohatera od popażeń...
	SET_SMALL_MESSAGE('NOTHING TO PUT THE FIRE OUT WITH.');
    }
    return(world);
};

var collision_detonate=function(world,o1,o2) {
    world=delete_object(world,o2); /// drop detonator
    var bombs=find_all_by_label(world,o2['label']);
    var boom=false;
    for(var i=0;i<bombs.length;i++) {
	var bomb = bombs[i];
	if(world[bomb.index]!=null && (bomb.type=='BOMB' || bomb.type=='CART_BOMB')) {
	    world=(explosion_for(bomb))(world, bomb);
	    boom=true;
	}
    }
    if(boom) {
	SET_SMALL_MESSAGE("BOOM!!!");
    } else {
	SET_SMALL_MESSAGE("...NO BOOM?");
    }
    PLAY('act'); /// PLAY('fx1');
    return(world);
};

var collision_set_on_fire=function(world,o1,o2) {
    var x=o2.x;
    var y=o2.y;
    var exp=66+Math.floor(Math.random()*33);
    world=delete_object(world,o2);
    world=insert_object(world, new_fire(x,y,exp));
    world=insert_object(world, new_boom(x,y,1)); // !!
    SET_SMALL_MESSAGE("THIS MACHINE IS BROKEN...");
    PLAY('act');
    PLAY('squeak');
    return(world);
};

var collision_turncock=function(world,o1,o2) {
    var water=find_all_by_label(world,o2['label']);
    for(var i=0;i<water.length;i++) {
       	//console.log(i); /// !!
	var o = water[i];
	if(world[o.index]!=null && o.type!="TURNCOCK_ACTIVE") {
	    o.expires=3+Math.ceil(Math.random()*13);
	    world = update_object(world,o);
	}
    }
    SET_SMALL_MESSAGE("SQUEAK! HSHHHH...");
    o2.type='TURNCOCK';
    world=update_object(world,o2);
    PLAY('squeak');
    return(world);
};



var collision_explosion=function(world,o1,o2) {
    world=(explosion_for(o1))(world, o1);
    world=(explosion_for(o2))(world, o2);
    return(world);
};

var collision_explosion_actor=function(world,o1,o2) {
    world=(explosion_for(o1))(world, o1);
    return(world);
};

var collision_explosion_target=function(world,o1,o2) {
    world=(explosion_for(o2))(world, o1);
    return(world);
};

var collision_fission=function(world,o1,o2) {
    /// o1==PARTICLE, o2==PU
    world = delete_object(world,o1);
    if(o1.dy==0) {
	world = shoot_particle(world, o2.x,o2.y-1, 0,-1);
	world = shoot_particle(world, o2.x,o2.y+1, 0,1);
    } else {
	world = shoot_particle(world, o2.x-1,o2.y, -1,0);
	world = shoot_particle(world, o2.x+1,o2.y, 1,0);
    }
    return(world);
};

/// a to zeby przez ogien czastki przechodzili...
var collision_jump_over=function(world,o1,o2) {
    /// o1==PARTICLE, o2==FIRE
    var dx=o1.dx;
    var dy=o1.dy;
    world = delete_object(world,o1);
    var nx=o2.x+dx;
    var ny=o2.y+dy;
    var something=find_by_pos(world, nx,ny);
    if(something==null) {
	world = shoot_particle(world, nx,ny, dx,dy);
    } else {
	switch(something.type) {
	case 'SMOKE':
	    world = delete_object(world, something);
	    world = shoot_particle(world, nx,ny, dx,dy);
	default:
	    world = (explosion_for(something))(world, something); // ??
	}
    }
    return(world);
};

var collision_mirror=function(world,o1,o2) {
    /// o1==PARTICLE, o2==MIRROR
    world = delete_object(world,o1);
    var deflect = 1;
    if(o2.facing=="r") deflect = -1;
    if(o1.dy==0) { /// vertical
	var ndx = deflect*o1.dx;
	world = shoot_particle(world, o2.x,o2.y+ndx, 0,ndx);
    } else { /// horizontal
	var ndy = deflect*o1.dy;
	world = shoot_particle(world, o2.x+ndy,o2.y, ndy,0);
    }
    return(world);
};

var collision_steer=function(world,o1,o2) {
    /// o1==HERO, o2==JOYSTICK
    var robots=find_all_by_label(world,o2.label);
    for(var i=0;i<robots.length;i++) {
	var robot=robots[i];
	if(robot.type!='ROBOT' && robot.type!='CART_ROBOT') continue;
	var dx=signum(o2.x-o1.x);
	var dy=signum(o2.y-o1.y);
	if(robot.type=='CART_ROBOT') {
	    var nx=robot.x + JOYSTICK.dx;
	    var ny=robot.y + JOYSTICK.dy;
	    var what_is_there = find_by_pos(world,nx,ny);
	    if(what_is_there==null || what_is_there.type!='TRACKS') {
		/// get out.
		var ox=robot.x;
		var oy=robot.y;
		var odx=robot.dx;
		var ody=robot.dy;
		var ofacing = robot.facing;
		robot.type = 'ROBOT';
		robot.dx=0;
		robot.dy=0;
		world=update_object(world, robot);
		world=move_object(world, robot, nx, ny);
		world=insert_object(world, new_empty_cart(ox,oy, odx,ody,ofacing));
		// ?
	    } else { /// tracks?
	    	robot.dx=dx;
		robot.dy=dy;
		robot.facing=dxdy2facing(robot.dx,robot.dy);
		world=update_object(world,robot);
	    }
	} else {
	    robot.facing=dxdy2facing(dx,dy);
	    world=update_object(world, robot);
	    world=move_object(world, robot, robot.x+dx,robot.y+dy);
	}
	PLAY('act');PLAY('pick');
	if(small_message_timeout<1) SET_SMALL_MESSAGE("CLICK");
    }
    return(world);
};


var collision_ant_turn_right=function(world,o1,o2) {
    if(o2.type!='EGG' || Math.random()>0.69) { 
	var tmp=o1.dx;
	o1.dx=-1*o1.dy;
	o1.dy=tmp;
	o1.facing=dxdy2facing(o1.dx,o1.dy);
	world=update_object(world,o1);
    }
    return(world);
};

var collision_ant_turn_left=function(world,o1,o2) {
    var tmp=o1.dx;
    o1.dx=o1.dy;
    o1.dy=tmp;
    o1.facing=dxdy2facing(o1.dx,o1.dy);
    world=update_object(world,o1);
    return(world);
};



var collision_load_cart=function(world,o1,o2) {
    switch(o1.type) {
    case 'BOMB':
	world=delete_object(world,o1);
	o2.type="CART_BOMB";
	o2.label=o1.label;
	world=update_object(world,o2);
	break;

    case 'PU':
	world=delete_object(world,o1);
	o2.type="CART_PU";
	o2.label=o1.label;
	world=update_object(world,o2);
	break;

    case 'ROBOT':
	world=delete_object(world,o1);
	o2.type="CART_ROBOT";
	o2.label=o1.label;
	world=update_object(world,o2);
	break;

    case 'HERO':
	world=delete_object(world,o2); // sic!
	o1.type="CART_HERO";
	o1.facing = o2.facing;
	o1.x=o2.x;
	o1.y=o2.y;
	o1.dx=0;
	o1.dy=0;
	//o2.label=o1.label;
	world=update_object(world,o1);
	break;

    default: world=world;
    }
    PLAY('pick');
    return(world);
};

var collision_unload_cart=function(world,o1,o2) {
    var dx=signum(o2.x-o1.x);
    var dy=signum(o2.y-o1.y);
    var ox=o2.x;
    var oy=o2.y;
    var nx=ox+dx;
    var ny=oy+dy;
    var odx=o2.dx;
    var ody=o2.dy;
    var ofacing=o2.facing;
    var new_type = 'error';
    switch(o2.type) {
    case 'CART_BOMB':new_type="BOMB"; break;
    case 'CART_ROBOT':new_type="ROBOT"; break;
    case 'CART_PU':new_type="PU"; break;
    case 'CART_HERO': new_type="HERO"; break;
    default: new_type='WALL3'; /// tmp!!
    }
    var what_is_there = find_by_pos(world, nx,ny);    
    if(what_is_there != null && what_is_there.type == 'SMOKE') {
	world = delete_object(world, what_is_there);
	what_is_there = null;
    }
    if(what_is_there == null) {
	o2.type=new_type;
	o2.dx=0;
	o2.dy=0;
	world=update_object(world, o2);
	world=move_object(world, o2, nx,ny);
	var new_cart = new_empty_cart(ox,oy, odx,ody,ofacing);
	world=insert_object(world, new_cart);
	PLAY('push');
    } else {
	console.log("aaa?! "+what_is_there.type+"|"+nx+"|"+ny);
	/// some other collision??
    }
    return(world);
};


collision_dig = function(world,obj1,obj2) {
    obj1.x=obj2.x;
    obj1.y=obj2.y;
    world=delete_object(world,obj2);
    world=update_object(world,obj1);
    switch(obj1.type) {
    case 'HERO':
    case 'CART_HERO':
	if(obj1.inventory['SUIT']>0) ADDCZAD(Math.ceil(Math.random()*7.0));
	    else ADDCZAD(3+Math.ceil(Math.random()*10.0));
	break;
    }
    return(world);
};

collision_teleport=function(world,obj1,obj2) {
    var nx=obj2.tgtx;
    var ny=obj2.tgty;
    var what_is_there=find_by_pos(world,nx,ny);
    if(what_is_there==null) {
	obj1.x=nx;
	obj1.y=ny;
	world = update_object(world, obj1);
	PLAY("act");	
	if(obj1.type=='HERO') {
	    var msg='';
	    switch(Math.floor(Math.random()*3.99)) {
	    case 0: msg='THAT WAS WEIRD.'; break;
	    case 1: msg='THAT WAS SPOOKY.'; break;
	    case 2: msg='THAT WAS CREEPY.'; break;
	    case 2: msg='THAT WAS SCARY.'; break;
	    }
	    SET_SMALL_MESSAGE(msg);
	}
    }
    return(world);
};


random_facing=function() {
    switch(Math.floor(Math.random()*4)) {
    case 0: return('u');
    case 1: return('d');
    case 2: return('l');
    case 3: return('r');
    }    
};

/// ...
new_particle=function(x, y, dx,dy, expires) {
    return({
	'index': -1,
	'type': 'PARTICLE',
	'x': x,
	'y': y,
	'dx': dx,
	'dy': dy,
	'expires': expires
    });
};

new_boom=function(x, y, expires) {
    return({
	'index': -1,
	'type': 'BOOM',
	'x': x,
	'y': y,
	'dx': 0,
	'dy': 0,
	'expires': expires
    });
};

new_fire=function(x, y, expires) {
    return({
	'index': -1,
	'type': 'FIRE',
	'x': x,
	'y': y,
	'dx': 0,
	'dy': 0,
	'expires': expires
    });
};


new_smoke=function(x, y, expires) {
    return({
	'index': -1,
	'type': 'SMOKE',
	'x': x,
	'y': y,
	'facing' : random_facing(),
	'dx': 0,
	'dy': 0,
	'expires': expires
    });
};

new_empty_cart=function(x,y,dx,dy,facing) {
    return({
	'index': -1,
	'type': 'CART_EMPTY',
	'x': x,
	'y': y,
	'dx': dx,
	'dy': dy,
	'facing': facing///dxdy2facing(dx,dy)
    });
};



var explosion_none=function(world,obj) { return(world); };

var explosion_small=function(world,obj) {
    world = delete_object(world, obj);
    world = insert_object(world, new_boom(obj.x, obj.y, 1));
    PLAY('boom'); /// !!
    return(world);
};

var silent_explosion=function(world,obj) {
    world = delete_object(world, obj);
    world = insert_object(world, new_boom(obj.x, obj.y, 1));
    return(world);
};

var explosion_fire=function(world,obj) {
    world = delete_object(world, obj);
    world = insert_object(world, new_fire(obj.x, obj.y, 33+Math.floor(Math.random()*93)));
    PLAY('boom'); /// !!
    return(world);
};


var collision_doom = function(world,o1,o2) {
    for(var i=0;i<6;i++)
	PLAY('boom');
    SET_flash(6);    
    GAME_STATE='DOOM';
}

var explosion_big=function(world,obj) {
    var radius = 1;
    world = delete_object(world, obj);
    for(var i=-radius;i<=radius;i++) {
	for(var j=-radius;j<=radius;j++) {
	    var x=obj.x+i;
	    var y=obj.y+j;
	    var obj2=find_by_pos(world,x,y);
	    if(obj2==null) {
		world = insert_object(world, new_boom(x,y,1));
	    } else {
		world = (explosion_for(obj2))(world, obj2);
	    }
	}
    }
    world = insert_object(world, new_boom(obj.x, obj.y, 1));
    PLAY('boom'); /// !!
    SET_quake(17,0.93,7); /// !!
    PLAY('boom'); /// !!
    return(world);
}


var explosion_for=function(obj) {
    if(obj==null) return(explosion_small);
    switch(obj.type) {
    case 'BOMB':
    case 'CART_BOMB':
    case 'GASBULLET': return(explosion_big);
    case 'CRATE':
    case 'GRASS':
    case 'HOLDER':
    case 'GUN':
    case 'ANT':
    case 'ANT_CORPSE':
    case 'WALL2':
    case 'PU': /// TODO: RADIOACTIVE FIRE?
	return(explosion_fire);
    case 'WALL':
	/// ...
    case 'WALL3':
    case 'TRACKS':
    case 'FIRE':
    case 'BOOM':
    case 'PIPE':
    case 'PIPE-TURN':
	return(explosion_none);
    case 'PARTICLE':
	return(silent_explosion);
    default:
	return(explosion_small);	
    }
}


var collision_for=function(obj1, obj2) {
    //console.log(obj1.type+'|'+obj2.type);

    /// part A: exceptions -- collisions other than B [and C].
    switch(obj1.type+'|'+obj2.type) {

    case 'HERO|EXIT': //// ?!!
	return(function(world,o1,o2) {	    
	    SET_flash(2);
	    GAME_STATE = 'NEXT_LEVEL'; // !!
	    return(world);
	});

    case 'HERO|HOLE':
    case 'ROBOT|HOLE':
    case 'HERO|WATER':
    case 'CART_HERO|WATER':
    case 'ROBOT|WATER':
    case 'ANT|WATER':
	return(collision_fall_into);	

    case 'HERO|TELEPORT':
    case 'ROBOT|TELEPORT':
    case 'BOMB|TELEPORT':
	return(collision_teleport);

    case 'HERO|CRATE':
    case 'HERO|EGG':
    case 'HERO|BARREL':
    case 'HERO|GASBULLET':
    case 'HERO|PU':
    case 'HERO|MIRROR':
    case 'PU|PU':
    case 'HERO|BOMB':
    case 'ROBOT|CRATE':
    case 'ROBOT|EGG':
    case 'ROBOT|BARREL':
    case 'ROBOT|GASBULLET':
    case 'ROBOT|PU':
    case 'ROBOT|MIRROR':
    case 'ROBOT|BOMB':
	return(collision_push);

    case 'CRATE|WATER': return(collision_fall_into);
    case 'CRATE|HOLE': return(collision_fall_into);
    case 'BARREL|WATER': return(collision_fall_into);
    case 'BARREL|HOLE': return(collision_fall_into);
    case 'GASBULLET|WATER': return(collision_fall_into);
    case 'GASBULLET|HOLE': return(collision_fall_into);

    case 'HERO|GUN': return(collision_face);
    case 'HERO|ROBOT': return(collision_face);

    case 'HERO|LEVER': return(collision_dummy_lever);
    case 'ROBOT|LEVER': return(collision_dummy_lever);
    case 'HERO|LEVER_OF_DOOM1': return(collision_doomlever);
    case 'ROBOT|LEVER_OF_DOOM1': return(collision_doomlever);
    case 'HERO|LEVER_OF_DOOM2': return(collision_doom);
    case 'ROBOT|LEVER_OF_DOOM2': return(collision_doom);

    case 'HERO|TURNCOCK': return(collision_nothing);
    case 'HERO|BOMB_METER': return(collision_nothing);
    case 'HERO|MACHINE': return(collision_someting);

    case 'HERO|TURNCOCK_ACTIVE': return(collision_turncock);
    case 'ROBOT|TURNCOCK_ACTIVE': return(collision_turncock);

    case 'HERO|MACHINE_B': return(collision_set_on_fire);

    case 'HERO|JOYSTICK':return(collision_steer);

    case 'HERO|DOOR': return(collision_try_to_open);

    case 'HERO|FIRE': return(collision_try_to_put_out);

    case 'ROBOT|DETONATOR': return(collision_detonate);
    case 'BARREL|DETONATOR': return(collision_detonate);
    case 'HERO|DETONATOR': return(collision_detonate);

    case 'HERO|KEY':
    case 'HERO|FUSE':
    case 'HERO|SPANNER':
    case 'HERO|SUIT':
	/// ...    
    case 'HERO|EXTINGUISHER':
        return(collision_pickup);

    case 'BOMB|CART_EMPTY':
    case 'PU|CART_EMPTY':
    case 'ROBOT|CART_EMPTY':
	return(collision_load_cart);

    case 'HERO|CART_EMPTY':
    case 'ROBOT|CART_EMPTY':
	return(function(world,obj,cart) {
	    var collision = collision_nothing;
	    switch(obj.facing+'|'+cart.facing) {
	    case 'u|u':
	    case 'd|u':
	    case 'u|d':
	    case 'd|d':
	    case 'l|l':
	    case 'r|l':
	    case 'l|r':
	    case 'r|r':
		collision = collision_set_in_motion;
		break;
	    default:
		collision = collision_load_cart;
	    }
	    return(collision(world,obj,cart));
	});

    case 'HERO|CART_ROBOT':
    case 'HERO|CART_BOMB':
    case 'HERO|CART_PU':
    case 'ROBOT|CART_ROBOT':
    case 'ROBOT|CART_BOMB':
    case 'ROBOT|CART_PU':
	return(function(world,obj,cart) {
	    var collision = collision_nothing;
	    switch(obj.facing+'|'+cart.facing) {
	    case 'u|u':
	    case 'd|u':
	    case 'u|d':
	    case 'd|d':
	    case 'l|l':
	    case 'r|l':
	    case 'l|r':
	    case 'r|r':
		collision = collision_set_in_motion;
		break;
	    default:
		collision = collision_unload_cart;
	    }
	    return(collision(world,obj,cart));
	});

    case 'PARTICLE|WALL2':
    case 'PARTICLE|WATER':
    case 'PARTICLE|ROCKS':
    case 'PARTICLE|PIPE':
    case 'PARTICLE|PIPE-TURN':
    case 'PARTICLE|TURNCOCK':
    case 'PARTICLE|TURNCOCK_ACTIVE':
    case 'PARTICLE|EXIT':
	return(collision_explosion_actor);

    case 'PARTICLE|JOYSTICK':
    case 'PARTICLE|CRATE':
	return(collision_explosion); // ?! musiełem dodać...
    case 'PARTICLE|SMOKE':
	return(collision_dig); // ?! jw

    case 'PARTICLE|PU':
	return(collision_fission);

    case 'PARTICLE|FIRE':
	return(collision_jump_over);

    case 'PARTICLE|MIRROR':
	return(collision_mirror);

    case 'HERO|ANT':
    case 'ANT|HERO':
	return(collision_ant_kills);	


    case 'ANT|HOLE':
    return(collision_ant_turn_right);


    /// szurpryza:
    case 'EGG|HOLE':
	PLAY('fx1'); /// @#$%%$?!
	return(collision_fall_into);

    ///SZURPRYZA2

    case 'CRATE|FIRE':
    return( function(world,o1,o2) {
	var x=o1.x;
	var y=o1.y;
	var exp=66+Math.floor(Math.random()*33);
	world=delete_object(world,o1);
	world=insert_object(world, new_fire(x,y,exp));
	world=insert_object(world, new_boom(x,y,1)); // !!
	/// message??
    	PLAY('pick');
	return(world);
    });

    case 'BOMB|FIRE':
    case 'GASBULLET|FIRE':
    return( function(world,o1,o2) {
	world = (explosion_for(o1))(world,o1);
	return(world);
    });

	/// TODO: PU|WATER -> mk radioactive water?
    }


    /// part B: regular actions:
    switch(obj2.type) {
    case 'SMOKE': return(collision_dig);
    case 'CRATE': return(collision_push);
    case 'PARTICLE': return(collision_explosion);
    case 'HOLE': return(collision_fall_into);
    }

    switch(obj1.type) {
    case 'PARTICLE': return(collision_explosion);
    case 'ANT':
	//if(Math.random()>0.5) return(collision_turn_right);
	//else 
	return(collision_ant_turn_right); /// ??
    }

    /// part C: all the rest...
    return(identity_collision);
};


/////////////////////////////////////////////////
/// B) actual movement

var move_object=function(world, obj, nx, ny) {
    //console.log('move '+obj.index+' to '+nx+','+ny);
    if(obj==null) return(world);
    var obstacle=find_by_pos(world, nx, ny);
    if(obstacle==null) {
	obj.x=nx;
	obj.y=ny;
	world=update_object(world, obj);
    } else {
	world=(collision_for(obj, obstacle))(world, obj, obstacle);
    }
    return(world);
};

/////////////////////////////////////////////////
/// the final spark of life:
/////////////////////////////////////////////////

var step_identity=function(world, obj) { return(world); };

var step_smoke=function(world,obj) {
    obj.facing=random_facing();
    /// new smoke?
    if(Math.random()<(Math.min(obj.expires*0.042, 0.71))) {
	var tries=3;
	while(tries-->0) {
	    var dx=-1+Math.floor(Math.random()*3);
	    var dy=-1+Math.floor(Math.random()*3);
	    var nx=obj.x+dx;
	    var ny=obj.y+dy;
	    var exp=3+Math.min(Math.ceil(Math.random()*13),obj.expires-1);
	    var what_is_there=find_by_pos(world, nx,ny)
	    if(what_is_there==null) {
		world = insert_object(world, new_smoke(nx,ny,exp));
		tries=0;
	    } else if(what_is_there.type=='SMOKE'
		      && what_is_there.expires<exp
		      && Math.random()<0.666) {
		what_is_there.expires=exp;
		world = update_object(world,what_is_there);
		tries=0;
	    } else {
		/// nothing...
	    }
	}
    }
    /// disappear?
    world = step_expires(world, obj);
    return(world);
};

var step_expires=function(world,obj) {
    obj.expires--;
    if(obj.expires<=0) {
	world = delete_object(world, obj);
    } else {
	world = update_object(world, obj);
    }
    return(world);
}

var step_movable=function(world, obj) {
    var nx=obj.x + obj.dx;
    var ny=obj.y + obj.dy;
    // obj.facing = dxdy2facing(obj.dx, obj.dy); // ?!
    world=move_object(world, obj, nx, ny);
    world = step_expires(world, obj);
    return(world);
}

var step_cart=function(world, obj) {
    var nx=obj.x + obj.dx;
    var ny=obj.y + obj.dy;
    //obj.facing = dxdy2facing(obj.dx, obj.dy);
    var target=find_by_pos(world, nx,ny);
    if(target!=null && target.type=='TRACKS') {
	target.x=obj.x;
	target.y=obj.y;
	target.facing=((obj.facing=='u'||obj.facing=='d')?'v':'h');
	world=update_object(world, target);
	world=move_object(world, obj, nx, ny); //??
    } else {
	obj.dx=0;
	obj.dy=0;
	world=update_object(world, obj);	
    }
    return(world);
};

var step_cart_intro=function(world, obj) {
    var nx=obj.x + obj.dx;
    var ny=obj.y + obj.dy;
    //obj.facing = dxdy2facing(obj.dx, obj.dy);
    var target=find_by_pos(world, nx,ny);
    if(target!=null && target.type=='TRACKS') {
	target.x=obj.x;
	target.y=obj.y;
	target.facing=((obj.facing=='u'||obj.facing=='d')?'v':'h');
	world=move_object(world, obj, nx, ny); //??
	world=update_object(world, target);
	for(var i=0;i<MESSAGES.length;i++) {
	    var m=MESSAGES[i];
	    if(m==null) continue;
	    if(nx>=m.x0 && nx<=m.x1 && ny>=m.y0 && ny<=m.y1) {
		SET_SMALL_MESSAGE_INTRO(m.msg, m.duration);
		MESSAGES[i] = null;
		//MESSAGES = MESSAGES.splice(i);
		break;
	    }
	}

    } else {
	/// wysiadka!
	var ox=obj.x;
	var oy=obj.y;
	obj.type='HERO';
	obj.dx=0;
	obj.dy=0;		
	world = update_object(world, obj);	
	world = move_object(world, obj, ox-1, oy);
	var new_cart = new_empty_cart(ox,oy, 1,0,'r');
	world=insert_object(world, new_cart);
	GAME_STATE='GAME';
    }
    return(world);
};


var shoot_particle=function(world, x,y, dx,dy) {
    var particle=new_particle(x,y,dx,dy,100);
    /// stop! what if there is already something at (px,py)?
    var target=find_by_pos(world,x,y);
    if(target==null) {
	world = insert_object(world, particle);
    } else if(target.type=='SMOKE') {
	world = (collision_for(particle, target))(world, particle, target);
	world = insert_object(world, particle);
    } else {
	world = (collision_for(particle, target))(world, particle, target);
    }
    return(world);
}


var step_gun=function(world,obj) {
    if(obj.on) {
	if(obj.count--<0) {
	    obj.count=obj.count_max;
	    var dxdy=facing2dxdy(obj.facing);
	    var dx=dxdy[0];
	    var dy=dxdy[1];
	    var px=obj.x+dx;
	    var py=obj.y+dy;
	    world = shoot_particle(world, px,py, dx,dy);
	}	
	world=update_object(world, obj);	
    }
    return(world);
}

var step_hero=function(world, obj) {
    if(JOYSTICK.dx!=0 || JOYSTICK.dy!=0) {
	var nx=obj.x + JOYSTICK.dx;
	var ny=obj.y + JOYSTICK.dy;
	/// hero facing:
	obj.facing = dxdy2facing(JOYSTICK.dx, JOYSTICK.dy);
	world=move_object(world, obj, nx, ny);
	var me=world[obj.index];
	if(me!=null) {
	    if(me.x==nx && me.y==ny) {
		PLAY('walk');

	    } else {
		/// tu sampla na kolizje, choc w sumie cisza jest ok...
	    }
	} else {
	    /// tu mozna by walic sampla "ze umar" np wrzask jak w chimera?
	}

	ADDCZAD(-1*(2+Math.floor(Math.random()*3.1)));

	/// NOVUM -- zczajamy czy tu nie ma mesydżu...
	for(var i=0;i<MESSAGES.length;i++) {
	    var m=MESSAGES[i];
	    if(m==null) continue;
	    if(nx>=m.x0 && nx<=m.x1 && ny>=m.y0 && ny<=m.y1) {
		SET_BIG_MESSAGE(m.msg);
		MESSAGES[i] = null;
		//MESSAGES = MESSAGES.splice(i);
		PLAY('gong');
		break;
	    }
	}

	//////////////////////
	// novum^3: kombinezonek.
	if(me.inventory['SUIT']>0) {
	    if(suit_sweat++>333) {
		me.inventory['SUIT']--;
		world=update_object(world,me);
		SET_SMALL_MESSAGE("THIS SUIT IS WAY TOO SWEATY!");
		suit_sweat=0;
	    }
	}

    }
    return(world);
};

var step_carthero=function(world, obj) {
    if(JOYSTICK.dx!=0 || JOYSTICK.dy!=0) {
	var ox=obj.x;
	var oy=obj.y;
	var odx=obj.dx;
	var ody=obj.dy;
	var ofacing=obj.facing;
	var nx=ox + JOYSTICK.dx;
	var ny=oy + JOYSTICK.dy;
	var what_is_there = find_by_pos(world,nx,ny);
	if(what_is_there != null && what_is_there.type == 'SMOKE') {
	    world = delete_object(world, what_is_there);
	    what_is_there = null;
	}
	if(what_is_there==null) {
	    /// get out.
	    obj.type = 'HERO';
	    obj.dx=0;
	    obj.dy=0;
	    world=update_object(world, obj);
	    world=move_object(world, obj, nx, ny);
	    world=insert_object(world, new_empty_cart(ox,oy, odx,ody,ofacing));
	} else {
	    /// if there are tracks, then set cart in motion...
	    if(what_is_there.type=='TRACKS') {		
		obj.dx=JOYSTICK.dx;
		obj.dy=JOYSTICK.dy;
		obj.facing=dxdy2facing(obj.dx,obj.dy);
		world=update_object(world,obj);
	    } else {
		/// collision? -> perhaps we should change to HERO for a while...
		//world=move_object(world, obj, nx, ny);

		if(what_is_there.type=='WATER') {
		    /// ?!?!
		    obj.type = 'HERO';
		    obj.dx=0;
		    obj.dy=0;
		    world=update_object(world, obj);
		    world=move_object(world, obj, nx, ny);
		    if(find_by_pos(world, ox,oy)==null)
			world=insert_object(world, new_empty_cart(ox,oy, odx,ody,ofacing));
		    /// \?!?!
		}
	    }
	}
	PLAY("act");
	return(world);
    } else {
	return(step_cart(world,obj));
	/// play "stukpuk"?
    }
};

/// ...

var step_for=function(obj) {
    switch(obj.type) {

    case 'HERO':
	switch(GAME_STATE) {
	case 'SMALL_MESSAGE_INTRO':
	case 'INTRO':
	  return(step_movable);

	default:
	  return(step_hero);
	}
	
    case 'CART_HERO':
	switch(GAME_STATE) {
	case 'SMALL_MESSAGE_INTRO':
	case 'INTRO':
 	  return(step_cart_intro);
	default:
 	  return(step_carthero);
	}

    case 'ANT':
    case 'PARTICLE':
	return(step_movable);

    case 'CART_EMPTY':
    case 'CART_HERO':
    case 'CART_BOMB':
    case 'CART_ROBOT':
	return(step_cart);

    case 'GUN':
	return(step_gun);

    case 'SMOKE':
	return(step_smoke);
    case 'FIRE':
	return(step_smoke); /// todo: step fire?
    case 'BOOM':
	return(step_expires);
    case 'WATER':
	if(typeof obj['expires'] == "number") return(step_expires);
	else return(step_identity);

	/// ...

    default:
	return(step_identity);
    }
};

/////////////////////////////////////////////////

var world_step=function(world) {
    var lim=world.length;
    for(var i=0;i<lim;i++) {
	var obj=world[i];
	if(!obj) continue;
	world=(step_for(obj))(world, obj);	
    }
    world=new_world_order(world);
    return(world);
};

/////////////////////////////////////////////////
/// koniec bomba.
