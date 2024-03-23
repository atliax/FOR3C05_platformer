canvas = document.getElementById('mainCanvas');
context = canvas.getContext('2d');
addEventListener("load",initialize);

//key virkni sem ég fann á netinu
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_SPACE = 32;
let lastKeyUpCode = null

const backgroundImage = new Image()

const brickTile = new Image();

const levelWidth = 26;
const levelHeight = 20;
const levelScale = 32;

let levelData = [
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
];

//maxFPS = hve hraður leikurinn er. 
//var lastTimestamp = 0, maxFPS = 60, timestep = 1000 / maxFPS;

const keys = [];

const enemies = [];

const enemy_bullet = [];
const hero_bullet = [];

let hero;

let startTimestamp;
let frameTimeLast;
let frameTimeDelta;

function get_timestamp()
{
    return performance.timeOrigin + performance.now();
}

//key virkni sem ég fann á netinu
function keydown(event)
{
    if(event.keyCode == KEY_LEFT || event.keyCode == KEY_RIGHT ||
       event.keyCode == KEY_UP   || event.keyCode == KEY_SPACE)
    {
        keys[event.keyCode] = true;
    }
}

//key virkni sem ég fann á netinu
function keyup(event)
{
    if(event.keyCode == KEY_LEFT || event.keyCode == KEY_RIGHT ||
       event.keyCode == KEY_UP   || event.keyCode == KEY_SPACE)
    {
        keys[event.keyCode] = false;
        lastKeyUpCode = event.keyCode;
    }
}

//key virkni sem ég fann á netinu
function handle_keys()
{
    if(keys[KEY_LEFT] == true)
    {
        hero.walk(-hero.speed);
        hero.switchSprite("walkLeft")
    }

    if(keys[KEY_RIGHT] == true)
    {
        hero.walk(hero.speed);
        hero.switchSprite("walkRight")
    }

    if(keys[KEY_UP] == true)
    {
        hero.jump();
    }

    if(keys[KEY_SPACE] == true)
    {
        hero.shoot();
        hero.switchSprite("shoot")
    }
    
    if (!keys[KEY_LEFT] && !keys[KEY_RIGHT] && !keys[KEY_UP] && !keys[KEY_SPACE])
    {
        if (lastKeyUpCode == KEY_LEFT)
        {
        hero.switchSprite("idleLeft")
        }
        if (lastKeyUpCode == KEY_RIGHT)
        {
        hero.switchSprite("idleRight")
        }
        if (lastKeyUpCode == KEY_SPACE)
        {
        hero.switchSprite("idleRight")
        }
        if (lastKeyUpCode == KEY_UP)
        {
        hero.switchSprite("idleLeft")
        }
    }
    
}
class Sprite 
{
    constructor({imageSrc, frameRate, frameBuffer = 4, scale = 1})
    {
        this.x = canvas.width/ 2.3;
        this.y = canvas.height;
        this.scale = scale
        this.image = new Image()
        this.frameRate = frameRate

        this.image.onload = () => 
        {
            this.width = (this.image.width / frameRate) * this.scale
            this.height = (this.image.height) * this.scale
        }
        this.image.src = imageSrc
        
        this.currentFrame = 0
        this.frameBuffer =  frameBuffer  // stjórnar hversu hratt sprite-ið skiptir um mynd
        this.elapsedFrames = 0
    }

    draw() 
    {
        context.fillStyle = "tan"
        context.fillRect(this.x, this.y, this.width, this.height)
        if (!this.image) return

        const cropbox = 
        {
            x: this.currentFrame* this.image.width / this.frameRate,
            y: 0,
            width: this.image.width / this.frameRate,  
            height: this.image.height,
        }
        context.drawImage(
            this.image,
            cropbox.x,
            cropbox.y,
            cropbox.width,
            cropbox.height,
            this.x, 
            this.y,
            this.width ,
            this.height,
            );
            this.animation()
        
    }
    switchSprite(key) 
    {
        if (this.image === this.animations[key].image) return
        this.image = this.animations[key].image
        if (this.frameRate === this.animations[key].frameRate) return
        this.frameRate = this.animations[key].frameRate
    }


    
    animation()
    {
        this.elapsedFrames++

        if(this.elapsedFrames % this.frameBuffer === 0)
        {
        if(this.currentFrame < this.frameRate - 1) this.currentFrame++
        else this.currentFrame = 0
    }
    }
    
}

const GRAVITY = 20;
const PLAYER_ACCELERATION = 15;
const PLAYER_MAX_SPEED = 10;
const PLAYER_GROUND_SPEED_MODIFIER = 10;
const PLAYER_JUMP_SPEED = 8;

class Hero extends Sprite
{

    constructor(imageSrc, frameRate, animations, scale = 2)
    {
        super({imageSrc, frameRate, scale });
        //this.width = 80;
        //this.height = 100;
        //this.x = canvas.width/2.3;
        //this.y = canvas.height - this.height;

        this.speed = PLAYER_ACCELERATION;

        this.y = canvas.height - 96;
        this.groundSpeedModifier = PLAYER_GROUND_SPEED_MODIFIER;
        this.maxSpeed = PLAYER_MAX_SPEED;

        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.shootDelay = 600;
        this.lastshotTime = 0;
        this.hitpoints = 3

        this.animations = animations

        for (let key in this.animations) 
        {
            const image = new Image()
            image.src = this.animations[key].imageSrc
            this.animations[key].image = image
        }

    }

    walk(speedchange)
    {
        if(this.onGround)
        {
            if(speedchange > 0)
            {
                speedchange += this.groundSpeedModifier;
            }
            else
            {
                speedchange -= this.groundSpeedModifier;
            }
        }

        this.velocityX += speedchange * frameTimeDelta;

        if(this.velocityX > this.maxSpeed)
        {
            this.velocityX = this.maxSpeed;
        }

        if(this.velocityX < 0 && this.velocityX < -this.maxSpeed)
        {
            this.velocityX = -this.maxSpeed;
        }
    }

    move()
    {
        let newPosY = this.y + this.velocityY;
        let newPosX = this.x + this.velocityX;

        this.onGround = false;
        if(this.velocityY <= 0)
        {
            // engir árekstrar á uppleið
        }
        else
        {
            let mapX = Math.floor(newPosX/levelScale);
            let mapY = Math.floor((newPosY+(2*levelScale))/levelScale);
            let mapX2 = Math.floor((newPosX+(0.9*levelScale))/levelScale);
            let mapX3 = Math.floor((newPosX+(1.8*levelScale))/levelScale);

            if(get_map_collision(mapX,mapY) ||
               get_map_collision(mapX2,mapY) ||
               get_map_collision(mapX3,mapY))
            {
                newPosY = (Math.floor(newPosY/levelScale))*levelScale;
                this.velocityY = 0;
                this.onGround = true;
            }
        }

        this.x = newPosX;
        this.y = newPosY;

        if(this.x > canvas.width)
        {
            this.x -= canvas.width+this.width;
        }

        if(this.x < (0-this.width))
        {
            this.x += canvas.width+this.width;
        }
    }

    gravity()
    {
        if(!this.onGround)
        {
            this.velocityY += GRAVITY * frameTimeDelta;
        }
    }

    drag()
    {
        if(this.onGround)
        {
            this.velocityX = this.velocityX + (-(3*this.velocityX)*frameTimeDelta);
            if(Math.abs(this.velocityX) < 0.1)
            {
                this.velocityX = 0;
            }
        }
    }

    shoot()
    {
        const currentTime = new Date().getTime();
        if(currentTime - this.lastshotTime > this.shootDelay)
        {
            const bullet_speed = -5;
            const bullet = new Bullet("myndir/heroBullet.png", 1, this.x+(this.width*0.5), this.y, bullet_speed);
            hero_bullet.push(bullet);
            this.lastshotTime = currentTime;
        }
    }

    jump()
    {
        if(this.velocityY == 0 && this.onGround)
        {
            this.velocityY = -PLAYER_JUMP_SPEED;
            this.onGround = false;
        }
    }
}

function get_map_collision(X,Y)
{
    if(X < 0 || X >= levelWidth)
        return false;
    if(Y < 0 || Y >= levelHeight)
        return false;

    if(levelData[Y * levelWidth + X] != 0)
        return true;

    return false;
}

class Bullet extends Sprite
{
    constructor(imageSrc, frameRate, x, y, speed)
    {
        super({imageSrc, frameRate, scale: 2.3 })
        this.x = x;
        this.y = y;
        this.speed = speed;
        //this.width = 10;
        //this.height = 10;
    }

    move()
    {
        this.y += this.speed;
    }

    /*draw()
    {
        context.fillStyle = "black";
        context.fillRect(this.x, this.y, this.width, this.height);

    }*/
}

class Goblin extends Sprite
{
    constructor(imageSrc, frameRate, animations, scale = 2 )
    {
        super({imageSrc, frameRate, scale,})
        this.x = Math.random()*15;
        this.y = 60;
        this.width = 200;
        this.height = 35;
        this.speed = 2;
        this.lastshotTime = 0;
        this.shootDelay = 1000;
        this.hitpoints = 2;

        this.animations = animations

        for (let key in this.animations) 
        {
            const image = new Image()
            image.src = this.animations[key].imageSrc
            this.animations[key].image = image
        }

    }

    move()
    {
        this.x += this.speed;

        if (this.x+this.width >= canvas.width)
        {
            this.speed *= -1;
        }

        if (this.x+this.width <= this.width)
        {
            this.speed *= -1;
        }
    }

    /*draw()
    {
        context.fillStyle = "green", 0.2;
        //context.fillRect(this.x, this.y, this.width, this.height, this.speed);
    }*/




    shoot()
    {
        const currentTime = new Date().getTime();

        if (currentTime - this.lastshotTime > this.shootDelay)
        {
            const bullet_speed = 5;
            const bullet = new Bullet("Myndir/enemyBullets.png", 4,  this.x, this.y+this.height, bullet_speed);
            enemy_bullet.push(bullet);
            this.lastshotTime = currentTime;
        }
    }
}

function check_collision(bullet, object)
{
    let bulletleft = bullet.x;
    let bulletright = bullet.x + bullet.width;
    let bullettop = bullet.y - bullet.height;
    let bulletbot = bullet.y;

    let objectleft = object.x;
    let objectright = object.x + object.width;
    let objecttop = object.y;
    let objectbot = object.y + object.height;

    if (bulletright > objectleft && 
        bulletleft < objectright &&
        bulletbot > objecttop && 
        bullettop < objectbot)
    {
        return true;
    }

    return false;
}

function collision_consequence()
{
    for (let i= 0; i < hero_bullet.length; i++)
    {
        for (let j = 0; j < enemies.length; j++)
        {
            if (check_collision(hero_bullet[i], enemies[j]))
            {
                hero_bullet.splice(i, 1);
                enemies[j].hitpoints--;
                enemies[j].switchSprite("halfHealth")
                if (enemies[j].hitpoints <= 0)
                { 
                enemies.splice(j, 1);
                }
            }
        } 
    }

    for (let i= 0; i < enemy_bullet.length; i++)
    {
        if (check_collision(enemy_bullet[i], hero))
        {
            enemy_bullet.splice(i, 1);
            hero.hitpoints--
            console.log("hero hit");
            console.log("hitpoints:", hero.hitpoints)
            if (hero.hitpoints <= 0)
            {
                player_dead()
            }
        }  
    }
}

function player_dead() 
{

}

function enemies_move()
{
    if(enemies.length > 0)
    {
        for (let i = 0; i < enemies.length; i++)
        {
            enemies[i].move();
        }
    }
}

function enemies_draw()
{
    if(enemies.length > 0)
    {
        for (let i = 0; i < enemies.length; i++)
        {
            enemies[i].draw();
        }
    }
}

function enemies_shoot()
{
    if(enemies.length > 0)
    {
        for (let i = 0; i < enemies.length; i++)
        {
            enemies[i].shoot();
        }
    }
}

function bullets_move()
{
    if(enemy_bullet.length > 0)
    {
        for (let i = 0; i < enemy_bullet.length; i++)
        {
            enemy_bullet[i].move();
        }
    }

    if(hero_bullet.length > 0)
    {
        for (let i = 0; i < hero_bullet.length; i++)
        {
            hero_bullet[i].move();
        }
    }
}

function bullets_draw()
{
    if(enemy_bullet.length > 0)
    {
        for (let i = 0; i < enemy_bullet.length; i++)
        {
            enemy_bullet[i].draw();
        }
    }

    if(hero_bullet.length > 0)
    {
        for (let i = 0; i < hero_bullet.length; i++)
        {
            hero_bullet[i].draw();
        }
    }
}

function draw_background()
{
    context.clearRect(0,0, canvas.width, canvas.height);
    context.drawImage(backgroundImage, 0,0 , canvas.width, canvas.height);
    for(let y = 0; y < levelHeight; y++)
    {
        for(let x = 0; x < levelWidth; x++)
        {
            let index = (y * levelWidth) + x;

            if(levelData[index] != 0)
            {
                context.drawImage(brickTile,x*levelScale,y*levelScale);
            }
        }
    }
}

let isPlayerdead = false

function player_dead()
{
    draw_background()
    hero.switchSprite("dead");
    hero.draw();
    context.fillStyle = "red"; 
    context.font = "24px Serif";
    context.fillText("Game Over, Press R to restart. Score: xxx", canvas.width / 3, canvas.height / 2);
    isPlayerdead = true;
}

const heartImage = new Image();
heartImage.src = "Myndir/heart.png"

function draw_life()
{
    const spacing = 10;
    const X = 15
    const Y = canvas.height - 40;

    for (let i =0; i < hero.hitpoints; i++)
    {
        life = X + (heartImage.width + spacing) * i
        context.drawImage(heartImage, life, Y)
    }
}

function draw_game()
{
    if (isPlayerdead) return;  // asnalegt bug ef ég set þetta ekki hérna. textinn kemur ekki af einhverjum ástæðum. 
    draw_background();
    hero.draw();
    enemies_draw();
    draw_life()
    bullets_draw();

    let locString = "".concat("X:",hero.x.toString(),", Y:",hero.y.toString());
    context.fillStyle = "white";
    context.fillText(locString,100,10);

    let velString = "".concat("velX:",hero.velocityX.toString(),", velY:",hero.velocityY.toString());
    context.fillStyle = "white";
    context.fillText(velString,100,20);

    context.beginPath();
    context.fillStyle = "pink";
    context.arc(hero.x,hero.y,4,0,2*Math.PI);
    context.fill();
}

function main_loop(timestamp)
{
    if (isPlayerdead) return;
    window.requestAnimationFrame(main_loop);  
//    if (timestamp - lastTimestamp  < timestep) return;

//    lastTimestamp =  timestamp

    let frameTimeCurrent = get_timestamp();
    frameTimeDelta = (frameTimeCurrent - frameTimeLast)/1000;
    frameTimeLast = frameTimeCurrent;

    handle_keys();

    hero.move();
    hero.gravity();
    hero.drag();

    enemies_move();
    bullets_move();

    enemies_shoot();

    collision_consequence();

    draw_game();
}

function initialize()
{
    startTimestamp = get_timestamp();
    frameTimeDelta = 0.017;
    frameTimeLast = get_timestamp();
    frameTimeCurrent = get_timestamp();

    backgroundImage.src = "Myndir/Bar.jpg" // bara placeholder mögulega
    brickTile.src = "Myndir/tileBrick.png";
    document.addEventListener("keydown",keydown);
    document.addEventListener("keyup",keyup);

    hero = new Hero("Myndir/idleLeft.png", 2, animations = {
        idleLeft: {imageSrc: "Myndir/idleLeft.png", frameRate: 2},
        idleRight: {imageSrc: "Myndir/idleRight.png", frameRate: 2},
        walkRight: {imageSrc: "Myndir/walkRight.png", frameRate: 4},
        walkLeft: {imageSrc: "Myndir/walkLeft.png", frameRate: 4},
        shoot: {imageSrc: "Myndir/shoot.png", frameRate: 2},
        dead: {imageSrc: "Myndir/dead.png", frameRate: 1},
    } );

    //bara til að testa
    enemies.push(new Goblin("Myndir/EnemyP1.png", 1, animations = {
        fullHealth: {imageSrc: "Myndir/EnemyP1.png",frameRate: 1},
        halfHealth: {imageSrc: "Myndir/EnemyP2.png",frameRate: 1},
    }));

    requestAnimationFrame(main_loop);
}
