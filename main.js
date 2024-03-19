canvas = document.getElementById('mainCanvas');
context = canvas.getContext('2d');

//key virkni sem ég fann á netinu
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_SPACE = 32;

document.addEventListener("keydown",keydown);
document.addEventListener("keyup",keyup);

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
    }
}

//key virkni sem ég fann á netinu
function handleKeys()
{
    if(keys[KEY_LEFT] == true)
    {
        hero.move(-hero.speed);
    }

    if(keys[KEY_RIGHT] == true)
    {
        hero.move(hero.speed);
    }

    if(keys[KEY_UP] == true)
    {
        hero.jump();
    }

    if(keys[KEY_SPACE] == true)
    {
        hero.shoot();
    }
}

class Hero  
{
    constructor()
    {
        this.width = 80;
        this.height = 100;
        this.x = canvas.width/2.3;
        this.y = canvas.height - this.height;
        this.speed = 5;
        this.velocityX = 0;
        this.velocityY = 0;
        this.jumping = false;
        this.shootDelay = 600;
        this.lastshotTime = 0;
    }

    move(speedchange)
    {
        if(speedchange < 0)
        {
            if(this.velocityX > speedchange)
            {
                this.velocityX--;
            }
        }
        else
        {
            if(this.velocityX < speedchange)
            {
                this.velocityX++;
            }
        }

        this.velocityX *= 0.9;
        this.velocityY += 0.5;
        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.x >= canvas.width)
        {
            this.x = 0;
        }
        else if (this.x <= 0 - this.width) 
        {
            this.x = canvas.width - this.width;
        }
    
        if (this.y >= canvas.height - this.height)
        {
            this.y = canvas.height - this.height;
            this.jumping = false;
        }
    }

    draw()
    {
        context.fillStyle = "blue";
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    shoot()
    {
        const currentTime = new Date().getTime();
        if(currentTime - this.lastshotTime > this.shootDelay)
        {
            const bullet_speed = -5;
            const bullet = new Bullet(this.x+(this.width*0.5), this.y+this.height, bullet_speed);
            hero_bullet.push(bullet);
            this.lastshotTime = currentTime;
        }
    }

    jump()
    {
        if(!this.jumping)
        {
            this.velocityY = -this.speed * 2;
            this.jumping = true;
        }
    }
}

class Bullet 
{
    constructor(x, y, speed)
    {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 10;
        this.height = 10;
    }

    move()
    {
        this.y += this.speed;
    }

    draw()
    {
        context.fillStyle = "black";
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Goblin
{
    constructor()
    {
        this.x = Math.random()*15;
        this.y = 60;
        this.width = 200;
        this.height = 35;
        this.speed = 2;
        this.lastshotTime = 0;
        this.shootDelay = 1000;
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

    draw()
    {
        context.fillStyle = "green";
        context.fillRect(this.x, this.y, this.width, this.height, this.speed);
    }

    shoot()
    {
        const currentTime = new Date().getTime();

        if (currentTime - this.lastshotTime > this.shootDelay)
        {
            const bullet_speed = 5;
            const bullet = new Bullet(this.x, this.y+this.height, bullet_speed);
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
                enemies.splice(j, 1);
            }
        }
    }

    for (let i= 0; i < enemy_bullet.length; i++)
    {
        if (check_collision(enemy_bullet[i], hero))
        {
            enemy_bullet.splice(i, 1);
            console.log("hero dead");
        }  
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

function draw_game()
{
    context.clearRect(0,0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0,0, canvas.width, canvas.height );

    hero.draw();
    enemies_draw();

    bullets_draw();
}

function main_loop()
{
    handleKeys();

    hero.move();
    enemies_move();
    bullets_move();

    enemies_shoot();

    collision_consequence();

    draw_game();

    requestAnimationFrame(main_loop);    
}

const keys = [];

const enemies = [];

const enemy_bullet = [];
const hero_bullet = [];

const hero = new Hero();

//bara til að testa
enemies.push(new Goblin());

requestAnimationFrame(main_loop);
