
var enemies = {};
var player;

class Player {
	constructor(scene, x, y, username) {
		var text = scene.add.text(32, -15, username, {fill: "black"});
		var image = scene.add.image(0, 0, "ball");
		text.setOrigin(0.5);
		image.setOrigin(0);
		this.body = scene.add.container(x, y, [image, text]);
		this.scale = 0;
		scene.physics.world.enable(this.body);
		//this.body.body.setCollideWorldBounds(true);
	}

	move(x, y) {
		this.body.x = x;
		this.body.y = y;
	}
};

class Enemy {
	constructor(scene, id, startx, starty) {
		this.id = id;
		this.body = scene.add.image(startx, starty, "enemy");
		scene.physics.world.enable(this.body);
		this.body.par_obj = this; // Just to associate this id with the image
	}
};

function createPlayer(data) {
	player = new Player(this, data.x, data.y, data.username);
	this.cameras.main.startFollow(player.body);
}

function createEnemy (data) {
	var new_enemy = new Enemy(this, data.id, data.x, data.y);
	enemies[data.id] = new_enemy
	this.physics.add.collider(player.body, new_enemy.body, fight, null, this);

}

function player_coll (body, bodyB, shapeA, shapeB, equation) {
	console.log("collision");

	//the id of the collided body that player made contact with
	var key = body.sprite.id;
	//the type of the body the player made contact with
	var type = body.sprite.type;

	if (type == "player_body") {
		//send the player collision
		socket.emit('player_collision', {id: key});
	} else if (type == "food_body") {
		console.log("items food");
		socket.emit('item_picked', {id: key});
	}
}

function fight(player, enemy) {
	console.log("YAYAY");
	socket.emit("player_collision", {id: enemy.par_obj.id});
}

function pickup_food(player, food) {
	console.log("YAY");
	socket.emit("item_picked", {id: food.par_obj.id});
}
