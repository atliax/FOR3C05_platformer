const DEBUG = true;

canvas = document.getElementById('mainCanvas');
context = canvas.getContext('2d');
addEventListener("load",initialize);

let runGame;
let extraFlag;
let bonusInterval;
let numEnemies;
let isPlayerdead;

let musicStarted = false;

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_SPACE = 32;
const KEY_R = 82;
let lastKeyUpCode = null

const GRAVITY = 0.5;
const PLAYER_ACCELERATION = 0.5;
const PLAYER_MAX_SPEED = 6;
const PLAYER_GROUND_SPEED_MODIFIER = 0.25;
const PLAYER_JUMP_SPEED = 10;

let MAX_ENEMIES = 3;
let ENEMY_SPAWN_INTERVAL = 5000;
let lastEnemySpawn;
let difficulty = 1000

const musicTrack1 = new Audio();
const heroDead = new Audio(); heroDead.src = "Music/heroDead.mp4";
const heroShoot = new Audio(); heroShoot.src ="Music/heroShoot.mp3"; heroShoot.volume = 0.4;
const bulletHit = new Audio(); bulletHit.src = "Music/bulletHit.mp3";
const goblinShoot = new Audio(); goblinShoot.src = "Music/goblinShoot.mp3"; goblinShoot.volume = 0.3;
const heroDamage = new Audio(); heroDamage.src = "Music/heroDamage.wav";
const heroWalk = new Audio(); heroWalk.src = "Music/walk.flac"; heroWalk.volume = 0.2;
const heroJump = new Audio(); heroJump.src = "Music/jump.ogg"; heroJump.volume = 0.3


const backgroundImage = new Image()
const heartImage = new Image();
const heartBigImage = new Image();
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
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
];

const keys = [];

const enemies = [];
let score = 0
const enemy_bullet = [];
const hero_bullet = [];

let hero;

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
        if(DEBUG)
        {
            context.save();
            context.fillStyle = "tan"
            context.fillRect(this.x, this.y, this.width, this.height)
            context.restore();
        }
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

class Hero extends Sprite
{

    constructor(imageSrc, frameRate, animations, scale = 2)
    {
        super({imageSrc, frameRate, scale });

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
        else if(!isPlayerdead)
        {
            let mapX  = Math.floor((newPosX+5)/levelScale);
            let mapY  = Math.floor((newPosY+(2*levelScale))/levelScale);
            let mapX3 = Math.floor(((newPosX-16)+(1.8*levelScale))/levelScale);

            if(get_map_collision(mapX,mapY) ||
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
            this.velocityY += GRAVITY;
        }
    }

    drag()
    {
        if(this.onGround)
        {
            this.velocityX = this.velocityX - ((1/3)*this.velocityX);
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
            const bullet = new Bullet("Myndir/heroBulletBig.png", 1, this.x+(this.width*0.5), this.y, bullet_speed);
            hero_bullet.push(bullet);
            this.lastshotTime = currentTime;
            heroShoot.play()
        }
    }

    jump()
    {
        if(this.velocityY == 0 && this.onGround)
        {
            this.velocityY = -PLAYER_JUMP_SPEED;
            this.onGround = false;
            heroJump.play()
        }
    }
}

class Bullet extends Sprite
{
    constructor(imageSrc, frameRate, x, y, speed)
    {
        super({imageSrc, frameRate, scale: 1 })//scale: 2.3 })
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    move()
    {
        this.y += this.speed;
    }
}

class Goblin extends Sprite
{
    constructor(imageSrc, frameRate, animations, scale = 2 )
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

        this.animations = animations

        for (let key in this.animations) 
        {
            const image = new Image()
            image.src = this.animations[key].imageSrc
            this.animations[key].image = image
        }
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

        if (currentTime - this.lastshotTime > this.shootDelay)
        {
            const bullet_speed = 5;
            const bullet = new Bullet("Myndir/enemyBulletsBig.png", 4,  this.x, this.y+this.height, bullet_speed);
            enemy_bullet.push(bullet);
            this.lastshotTime = currentTime;
            goblinShoot.play()
        }
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
        keys[event.keyCode] = true;
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
        keys[event.keyCode] = false;
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
    isPlayerdead = false;
    enemies.splice(0,numEnemies);
    numEnemies = 0;
    score = 0;
    MAX_ENEMIES = 3;
    ENEMY_SPAWN_INTERVAL = 5000
    difficulty = 1000
    hero_bullet.splice(0,hero_bullet.length);
    enemy_bullet.splice(0,enemy_bullet.length);
    clearInterval(bonusInterval);
    extraFlag = false;

}

function handle_keys()
{
    if(isPlayerdead)
    {
        if(keys[KEY_R] == true)
        {
            restart_game();
        }
        return;
    }

    if(keys[KEY_LEFT] == true)
    {
        hero.walk(-hero.speed);
        hero.switchSprite("walkLeft")
        heroWalk.play()
    }

    if(keys[KEY_RIGHT] == true)
    {
        hero.walk(hero.speed);
        hero.switchSprite("walkRight")
        heroWalk.play()
    }

    if(keys[KEY_UP] == true)
    {
        hero.jump();
        heroWalk.pause()
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
}

function score_draw()
{
    context.save();
    context.fillStyle = "black"
    context.fillRect(canvas.width -190, canvas.height - 35, 200, 35)
    context.fillStyle = "lightblue"; 
    context.font = "24px Serif";
    context.fillText("score: "+score, canvas.width -170 , canvas.height - 10);
    context.restore();
    if (score >= difficulty){ENEMY_SPAWN_INTERVAL -= 500, difficulty += 1000};
    if (score === 2000) MAX_ENEMIES = 4
    if (score === 5000) MAX_ENEMIES = 6
    if (score === 8000) MAX_ENEMIES = 12
}

function draw_bonus()
{
    if (extraFlag === true)
    {
        let extra_life = {x: 50, y: 200, width: heartImage.width, height: heartImage.height};
        extra_lifer = context.drawImage(heartImage, extra_life.x, extra_life.y)
        if (check_collision(extra_life, hero))
        {
            hero.hitpoints ++
            extraFlag = false
        }
    }
}

function bonus()
{
    extraFlag = true
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

function bullets_draw(array)
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

function player_dead()
{
    hero.switchSprite("dead");
    isPlayerdead = true;
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
    enemies_draw();
    draw_life()
    bullets_draw(hero_bullet);
    bullets_draw(enemy_bullet);
    score_draw()
    draw_bonus()
    console.log(ENEMY_SPAWN_INTERVAL)

    if(isPlayerdead)
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

    spawn_enemies();
    
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
    isPlayerdead = false;
    numEnemies = 0;
    lastEnemySpawn = 0;
    extraFlag = false;

    //musicTrack1.src = "Music/track1.mp3";
    musicTrack1.loop = true;
    musicTrack1.volume = 0.3

    backgroundImage.src = "Myndir/Bar.jpg" // bara placeholder mögulega
    brickTile.src = "Myndir/tileBrick.png";
    heartImage.src = "Myndir/heart.png";
    heartBigImage.src = "Myndir/heartBig.png";

    document.addEventListener("keydown",keydown);
    document.addEventListener("keyup",keyup);

    hero = new Hero("Myndir/IDLE_L_2x.png", 2, animations = {
        idleLeft: {imageSrc: "Myndir/IDLE_L_2x.png", frameRate: 2},
        idleRight: {imageSrc: "Myndir/IDLE_R_2x.png", frameRate: 2},
        walkRight: {imageSrc: "Myndir/WALK_R_2x.png", frameRate: 4},
        walkLeft: {imageSrc: "Myndir/WALK_L_2x.png", frameRate: 4},
        shoot: {imageSrc: "Myndir/SHOOT_2x.png", frameRate: 2},
        dead: {imageSrc: "Myndir/DEAD_2x.png", frameRate: 2},
    },1 );
    runGame = setInterval(main_loop,1000/60)
    bonusInterval = setInterval(bonus, 45000)
}

function spawn_enemies()
{
    if(numEnemies >= MAX_ENEMIES)
    {
        return;
    }

    if(get_timestamp() - lastEnemySpawn > ENEMY_SPAWN_INTERVAL)
    {
        enemies.push(new Goblin("Myndir/EnemyP1Big.png", 1, animations = {
            fullHealth: {imageSrc: "Myndir/EnemyP1Big.png",frameRate: 1},
            halfHealth: {imageSrc: "Myndir/EnemyP2Big.png",frameRate: 1},
        },1));
        lastEnemySpawn = get_timestamp();
    }
}
