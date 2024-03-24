const DEBUG = true;

canvas = document.getElementById('mainCanvas');
context = canvas.getContext('2d');
addEventListener("load",initialize);

let runGame;
let numEnemies;
let isHeroDead;

let musicStarted = false;

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_SPACE = 32;
const KEY_R = 82;
let lastKeyUpCode = null

const GRAVITY = 0.5;
const HERO_ACCELERATION = 0.5;
const HERO_MAX_SPEED = 6;
const HERO_GROUND_SPEED_MODIFIER = 0.25;
const HERO_JUMP_SPEED = 10;

const HERO_BULLET_SPEED = -5;
const ENEMY_BULLET_SPEED = 5;

const DEFAULT_MAX_ENEMIES = 3;
const DEFAULT_ENEMY_SPAWN_INTERVAL = 5000;
const DEFAULT_DIFFICULTY = 1000;

let maxEnemies = DEFAULT_MAX_ENEMIES;
let enemySpawnInterval = DEFAULT_ENEMY_SPAWN_INTERVAL;
let difficulty = DEFAULT_DIFFICULTY

let lastEnemySpawn;

const musicTrack1 = new Audio();
const heroDead = new Audio(); heroDead.src = "Music/heroDead.mp4";
const heroShoot = new Audio(); heroShoot.src ="Music/heroShoot.mp3"; heroShoot.volume = 0.4;
const bulletHit = new Audio(); bulletHit.src = "Music/bulletHit.mp3";
const goblinShoot = new Audio(); goblinShoot.src = "Music/goblinShoot.mp3"; goblinShoot.volume = 0.3;
const heroDamage = new Audio(); heroDamage.src = "Music/heroDamage.wav";
const heroWalk = new Audio(); heroWalk.src = "Music/walk.flac"; heroWalk.volume = 0.2;
const heroJump = new Audio(); heroJump.src = "Music/jump.ogg"; heroJump.volume = 0.1

const backgroundImage = new Image()
const heartImage = new Image();
const heartBigImage = new Image();
const brickTile = new Image();

let extraLife = [];
const EXTRA_LIFE_INTERVAL = 45000;
let lastExtraLife = 0;

const LEVEL_WIDTH = 26;
const LEVEL_HEIGHT = 20;
const LEVEL_SCALE = 32;

const levelData = [
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

const keyDown = [];

const enemies = [];
let score = 0
const enemy_bullet = [];
const hero_bullet = [];

let hero;

const heroAnimations = {
    idleLeft: {imageSrc: "Myndir/IDLE_L_2x.png", frameRate: 2},
    idleRight: {imageSrc: "Myndir/IDLE_R_2x.png", frameRate: 2},
    walkRight: {imageSrc: "Myndir/WALK_R_2x.png", frameRate: 4},
    walkLeft: {imageSrc: "Myndir/WALK_L_2x.png", frameRate: 4},
    shoot: {imageSrc: "Myndir/SHOOT_2x.png", frameRate: 2},
    dead: {imageSrc: "Myndir/DEAD_2x.png", frameRate: 2}
};

const enemyAnimations = {
    fullHealth: {imageSrc: "Myndir/EnemyP1Big.png",frameRate: 1},
    halfHealth: {imageSrc: "Myndir/EnemyP2Big.png",frameRate: 1}
};

class HitBox
{
    constructor(X,Y,W,H)
    {
        this.X = X;
        this.Y = Y;
        this.W = W;
        this.H = H;
    }
}

const heroHitbox = new HitBox(12,0,32,64);
const heroBulletHitbox = new HitBox(0,0,18,23);
const enemyHitbox = new HitBox(0,0,64,45);
const enemyBulletHitbox = new HitBox(2,2,29,28);
const defaultHitbox = new HitBox(0,0,1,1);
const extraLifeHitbox = new HitBox(0,0,23,22);

class Sprite
{
    constructor({imageSrc, frameRate, frameBuffer = 4, scale = 1})
    {
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

        this.hitbox = defaultHitbox;
    }

    draw() 
    {
        if(DEBUG) // teiknar hitboxið
        {
            context.save();
            context.strokeStyle = "cyan";
            context.lineWidth = 1;
            context.beginPath();
            context.rect(this.x+this.hitbox.X,this.y+this.hitbox.Y,this.hitbox.W,this.hitbox.H);
            context.stroke();
            context.restore();
        }

        if (!this.image)
            return

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

class Hero extends Sprite
{
    constructor(imageSrc, frameRate, scale = 2, hitbox)
    {
        super({imageSrc, frameRate, scale });

        this.speed = HERO_ACCELERATION;

        this.x = canvas.width/2.3;
        this.y = canvas.height - (3*LEVEL_SCALE);

        this.groundSpeedModifier = HERO_GROUND_SPEED_MODIFIER;
        this.maxSpeed = HERO_MAX_SPEED;

        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.shootDelay = 600;
        this.lastshotTime = 0;
        this.hitpoints = 3

        this.animations = heroAnimations;

        for (let key in this.animations) 
        {
            const image = new Image()
            image.src = this.animations[key].imageSrc
            this.animations[key].image = image
        }

        this.hitbox = hitbox;
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

        this.velocityX += speedchange;

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
        else if(!isHeroDead)
        {
            let mapX  = Math.floor((newPosX+16)/LEVEL_SCALE);
            let mapY  = Math.floor((newPosY+(2*LEVEL_SCALE))/LEVEL_SCALE);
            let mapX3 = Math.floor(((newPosX-16)+(1.8*LEVEL_SCALE))/LEVEL_SCALE);


            if(get_map_collision(mapX,mapY) ||
               get_map_collision(mapX3,mapY))
            {
                newPosY = (Math.floor(newPosY/LEVEL_SCALE))*LEVEL_SCALE;
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
            this.velocityY += GRAVITY;
        }
    }

    drag()
    {
        if(this.onGround)
        {
            this.velocityX *= (2/3);
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
            const bullet = new HeroBullet(this.x+(this.width*0.5), this.y);
            hero_bullet.push(bullet);
            this.lastshotTime = currentTime;
            heroShoot.play()
        }
    }

    jump()
    {
        if(this.velocityY == 0 && this.onGround)
        {
            this.velocityY = -HERO_JUMP_SPEED;
            this.onGround = false;
            heroJump.play()
        }
    }
}

class Bullet extends Sprite
{
    constructor(imageSrc, frameRate, x, y, speed, hitbox)
    {
        super({imageSrc, frameRate, scale: 1 })
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.hitbox = hitbox;
    }

    move()
    {
        this.y += this.speed;
    }
}

class HeroBullet extends Bullet
{
    constructor(X,Y)
    {
        super("Myndir/heroBulletBig.png", 1, X, Y, HERO_BULLET_SPEED, heroBulletHitbox);
    }
}

class EnemyBullet extends Bullet
{
    constructor(X,Y)
    {
        super("Myndir/enemyBulletsBig.png", 4, X, Y, ENEMY_BULLET_SPEED, enemyBulletHitbox);
    }
}

class Goblin extends Sprite
{
    constructor(imageSrc, frameRate, scale = 2, hitbox )
    {
        super({imageSrc, frameRate, scale,})
        this.y = 60;
        this.width = 200;
        this.x = Math.random()*(canvas.width-this.width);
        this.height = 35;
        this.speed = 2;
        this.lastshotTime = 0;
        this.shootDelay = 1000;
        this.hitpoints = 2;

        this.animations = enemyAnimations;

        for (let key in this.animations) 
        {
            const image = new Image()
            image.src = this.animations[key].imageSrc
            this.animations[key].image = image
        }
        this.hitbox = hitbox;
        numEnemies++;
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

    shoot()
    {
        const currentTime = new Date().getTime();

        if (document.hasFocus() && currentTime - this.lastshotTime > this.shootDelay)
        {
            const bullet = new EnemyBullet(this.x,this.y+this.height);
            enemy_bullet.push(bullet);
            this.lastshotTime = currentTime;
            goblinShoot.play()
        }
    }
}

class ExtraLife extends Sprite
{
    constructor(X,Y)
    {
        super({imageSrc:"Myndir/heart.png",frameRate:1,scale:1});
        this.x = X;
        this.y = Y;
        this.hitbox = extraLifeHitbox;
    }
}

function get_timestamp()
{
    return performance.timeOrigin + performance.now();
}

function keydown(event)
{
    if(event.keyCode == KEY_LEFT || event.keyCode == KEY_RIGHT ||
       event.keyCode == KEY_UP   || event.keyCode == KEY_SPACE ||
       event.keyCode == KEY_R)
    {
        keyDown[event.keyCode] = true;
    }

    if(musicStarted == false)
    {
        musicTrack1.play();
    }
}

function keyup(event)
{
    if(event.keyCode == KEY_LEFT || event.keyCode == KEY_RIGHT ||
       event.keyCode == KEY_UP   || event.keyCode == KEY_SPACE ||
       event.keyCode == KEY_R)
    {
        keyDown[event.keyCode] = false;
        lastKeyUpCode = event.keyCode;
    }
}

function restart_game()
{
    hero.switchSprite("idleRight");
    hero.x = canvas.width/2.3;
    hero.y = canvas.height - 96;
    hero.velocityX = 0;
    hero.velocityY = 0;
    hero.hitpoints = 3;
    isHeroDead = false;

    hero_bullet.splice(0,hero_bullet.length);
    enemy_bullet.splice(0,enemy_bullet.length);

    enemies.splice(0,numEnemies);
    numEnemies = 0;
    score = 0;

    maxEnemies = DEFAULT_MAX_ENEMIES;
    enemySpawnInterval = DEFAULT_ENEMY_SPAWN_INTERVAL;
    difficulty = DEFAULT_DIFFICULTY;
    lastEnemySpawn = get_timestamp()-enemySpawnInterval;

    if(extraLife.length > 0)
    {
        extraLife.splice(0,1);
    }

    lastExtraLife = get_timestamp();
}

function handle_keys()
{
    if(isHeroDead)
    {
        if(keyDown[KEY_R] == true)
        {
            restart_game();
        }
        return;
    }

    if(keyDown[KEY_LEFT] == true)
    {
        hero.walk(-hero.speed);
        hero.switchSprite("walkLeft")
        heroWalk.play()
    }

    if(keyDown[KEY_RIGHT] == true)
    {
        hero.walk(hero.speed);
        hero.switchSprite("walkRight")
        heroWalk.play()
    }

    if(keyDown[KEY_UP] == true)
    {
        hero.jump();
        heroWalk.pause()
    }

    if(keyDown[KEY_SPACE] == true)
    {
        hero.shoot();
        hero.switchSprite("shoot")
    }
    
    if (!keyDown[KEY_LEFT] && !keyDown[KEY_RIGHT] && !keyDown[KEY_UP] && !keyDown[KEY_SPACE])
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

function get_map_collision(X, Y)
{
    if(Y == 19)
        return true;
    if(X < 0 || X >= LEVEL_WIDTH)
        return false;
    if(Y < 0 || Y >= LEVEL_HEIGHT)
        return false;

    if(levelData[Y * LEVEL_WIDTH + X] != 0)
        return true;

    return false;
}

function check_collision(bullet, object)
{
    let bulletleft  = bullet.x + bullet.hitbox.X;
    let bulletright = bullet.x + bullet.hitbox.X + bullet.hitbox.W;
    let bullettop   = bullet.y + bullet.hitbox.Y;
    let bulletbot   = bullet.y + bullet.hitbox.Y + bullet.hitbox.H;

    let objectleft  = object.x + object.hitbox.X;
    let objectright = object.x + object.hitbox.X + object.hitbox.W;
    let objecttop   = object.y + object.hitbox.Y;
    let objectbot   = object.y + object.hitbox.Y + object.hitbox.H;

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
                bulletHit.play()
                if (enemies[j].hitpoints <= 0)
                {
                    numEnemies--;
                    enemies.splice(j, 1);
                    score += 100;
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
            heroDamage.play()
            if (hero.hitpoints <= 0)
            {
                player_dead()
            }
        }  
    }

    if(extraLife.length > 0)
    {
        if(hero.hitpoints < 3)
        {
            if(check_collision(extraLife[0],hero))
            {
                extraLife.splice(0,1);
                hero.hitpoints++;
            }
        }
    }
}

function draw_score()
{
    context.save();
    context.fillStyle = "black"
    context.fillRect(canvas.width -190, canvas.height - 35, 200, 35)
    context.fillStyle = "lightblue"; 
    context.font = "24px Serif";
    context.fillText("score: "+score, canvas.width -170 , canvas.height - 10);
    context.restore();
}

function adjust_difficulty()
{
    if (score >= difficulty){enemySpawnInterval -= 500, difficulty += 1000};
    if (score === 2000) maxEnemies = 4
    if (score === 5000) maxEnemies = 6
    if (score === 8000) maxEnemies = 12
}

function spawn_extra_life()
{
    if(extraLife.length < 1)
    {
        if(get_timestamp() - lastExtraLife > EXTRA_LIFE_INTERVAL)
        {
            extraLife.push(new ExtraLife(50,200));
            lastExtraLife = get_timestamp();
        }
    }
}

function draw_bonus()
{
    if(extraLife.length > 0)
    {
        extraLife[0].draw();
    }
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

function draw_enemies()
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

function bullets_move(array)
{
    if(array.length > 0)
    {
        for (let i = 0; i < array.length; i++)
        {
            array[i].move();
            if(array[i].y > canvas.height || array[i].y < 0)
            {
                array.splice(i,1);
            }
        }
    }
}

function draw_bullets(array)
{
    if(array.length > 0)
    {
        for (let i = 0; i < array.length; i++)
        {
            array[i].draw();
        }
    }
}

function draw_background()
{
    context.clearRect(0,0, canvas.width, canvas.height);
    context.drawImage(backgroundImage, 0,0 , canvas.width, canvas.height);
    for(let y = 0; y < LEVEL_HEIGHT; y++)
    {
        for(let x = 0; x < LEVEL_WIDTH; x++)
        {
            let index = (y * LEVEL_WIDTH) + x;

            if(levelData[index] != 0)
            {
                context.drawImage(brickTile,x*LEVEL_SCALE,y*LEVEL_SCALE);
            }
        }
    }
}

function player_dead()
{
    hero.switchSprite("dead");
    isHeroDead = true;
    heroDead.play()
}

function draw_dead_message()
{
    let deadMessage = "Game Over, Press R to restart. Score: ".concat(score.toString());

    context.save();

    // stillingar fyrir textann
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.font = "24px Serif";

    // stillingar fyrir boxið
    context.fillStyle = "grey";
    context.strokeStyle = "black";
    context.lineWidth = 2;

    // mæling á textanum til að stilla stærðina á boxinu
    let boxWidth = context.measureText(deadMessage).width + 20;
    let boxHeight = 46;

    // teikna boxið
    context.beginPath();
    context.rect((canvas.width/2)-(boxWidth/2),(canvas.height/2)-(boxHeight/2)-1,boxWidth,boxHeight);
    context.fill();
    context.stroke();

    // teikna textann
    context.fillStyle = "red"; 
    context.fillText(deadMessage, canvas.width / 2, canvas.height / 2);

    context.restore();
}

function draw_life()
{
    const spacing = 10;
    const X = 7
    const Y = 7

    for (let i =0; i < hero.hitpoints; i++)
    {
        life = X + (heartBigImage.width + spacing) * i
        context.drawImage(heartBigImage, life, Y)
    }
}

function draw_game()
{
    draw_background();
    hero.draw();
    draw_enemies();
    draw_life()
    draw_bullets(hero_bullet);
    draw_bullets(enemy_bullet);
    draw_score()
    draw_bonus()

    if(isHeroDead)
    {
        draw_dead_message();
    }

    if(DEBUG)
    {
        context.save();
        let locString = "".concat("X:",hero.x.toString(),", Y:",hero.y.toString());
        context.fillStyle = "white";
        context.fillText(locString,100,10);
    
        let velString = "".concat("velX:",(hero.velocityX).toString(),", velY:",(hero.velocityY).toString());
        context.fillStyle = "white";
        context.fillText(velString,100,20);
    
        context.beginPath();
        context.fillStyle = "pink";
        context.arc(hero.x,hero.y,4,0,2*Math.PI);
        context.fill();
        context.restore();
    }
}

function main_loop(timestamp)
{
    handle_keys();

    adjust_difficulty();

    spawn_enemies();
    spawn_extra_life();
    
    hero.move();
    hero.gravity();
    hero.drag();
    
    enemies_move();
    bullets_move(hero_bullet);
    bullets_move(enemy_bullet);
    
    enemies_shoot();

    collision_consequence();

    draw_game();
}

function initialize()
{
    isHeroDead = false;
    numEnemies = 0;
    lastEnemySpawn = 0;
    extraFlag = false;

    musicTrack1.src = "Music/track1.mp3";
    musicTrack1.loop = true;
    musicTrack1.volume = 0.2

    backgroundImage.src = "Myndir/Bar.jpg" // bara placeholder mögulega
    brickTile.src = "Myndir/tileBrick.png";
    heartImage.src = "Myndir/heart.png";
    heartBigImage.src = "Myndir/heartBig.png";

    document.addEventListener("keydown",keydown);
    document.addEventListener("keyup",keyup);

    hero = new Hero("Myndir/IDLE_L_2x.png", 2, 1, heroHitbox );

    runGame = setInterval(main_loop,1000/60)
    lastExtraLife = get_timestamp();
}

function spawn_enemies()
{
    if(numEnemies >= maxEnemies)
    {
        return;
    }

    if(get_timestamp() - lastEnemySpawn > enemySpawnInterval)
    {
        enemies.push(new Goblin("Myndir/EnemyP1Big.png", 1, 1, enemyHitbox));
        lastEnemySpawn = get_timestamp();
    }
}
