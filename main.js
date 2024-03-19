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

const keys = []

const enemies = []

const enemy_bullet = [];
const hero_bullet = [];

const hero =  
{
    x: canvas.width/2.3,
    height: 100,
    y: canvas.height - 100, 
    width: 80,
    speed: 5,
    velocityX: 0,
    velocityY: 0,
    jumping: false,
    shootDelay: 600,
    lastshotTime: 0,

    draw()
    {
        context.fillStyle = "blue";
        context.fillRect(hero.x, hero.y, hero.width, hero.height);
        hero.velocityX *= 0.9;
        hero.velocityY += 0.5;
        hero.x += hero.velocityX;
        hero.y += hero.velocityY;
        if (hero.x >= canvas.width)
        {
            hero.x =  0
        }   else if (hero.x <= 0-hero.width) 
        {
            hero.x = canvas.width-hero.width
        }
    
        if (hero.y >= canvas.height - hero.height)
        {
            hero.y = canvas.height - hero.height
            hero.jumping = false
        }
    },
    shoot(){
    const currentTime = new Date().getTime();
    if (currentTime - hero.lastshotTime > hero.shootDelay)

    {
        const bullet_speed = -5 ;
        const bullet = new Bullet(hero.x+(hero.width*0.5), hero.y+hero.height, bullet_speed);
        hero_bullet.push(bullet);
        hero.lastshotTime  =currentTime
    }
    }
}

//key virkni sem ég fann á netinu
function handleKeys()
{
    if(keys[KEY_LEFT] == true)
    {
        if (hero.velocityX > -hero.speed)
        {
            hero.velocityX--;
        }
    }

    if(keys[KEY_RIGHT] == true)
    {
        if (hero.velocityX < hero.speed)
        {
            hero.velocityX++;
        }
    }

    if(keys[KEY_UP] == true)
    {
        if (!hero.jumping)
        {
            hero.velocityY = -hero.speed *2;
            hero.jumping = true
        }
    }

    if(keys[KEY_SPACE] == true)
    {
        hero.shoot()
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
        {return true}

    return false
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
            console.log("hero dead")
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
        this.width = 10
        this.height = 10
    }

    draw()
    {
        context.fillStyle = "black";
        this.y += this.speed;
        
        context.fillRect(this.x, this.y, this.width, this.height)

        
    }
}
class Goblin
{
    constructor()
    {
        this.x = Math.random()*15
        this.y = 60
        this.width = 200
        this.height = 35
        this.speed = 2
        this.lastshotTime = 0
        this.shootDelay = 1000
    }
    draw()
    {
        context.fillStyle = "green"
        this.x += this.speed
        if (this.x+this.width >= canvas.width)
        {
            this.speed *= -1
        }
        if (this.x+this.width <= this.width)
        {
            this.speed *= -1
        }
        context.fillRect(this.x, this.y, this.width, this.height, this.speed)
    }
    shoot()
    {
        const currentTime = new Date().getTime();
        if (currentTime - this.lastshotTime > this.shootDelay)
        {
            const bullet_speed = 5 ;
            const bullet = new Bullet(this.x, this.y+this.height, bullet_speed);
            enemy_bullet.push(bullet);
            this.lastshotTime  =currentTime
        }
    }

}

function draw_enemies()
{
    for (let i = 0; i < enemies.length; i++)
    {
        enemies[i].draw()
        enemies[i].shoot()
    }
}

function enemies_shoot()
{
    for (let i = 0; i < enemies.length; i++)
    {
        for (let i = 0; i < enemy_bullet.length; i++) {
            enemy_bullet[i].draw();
        }  
        for (let i = 0; i < hero_bullet.length; i++) {
            hero_bullet[i].draw();
        }        

    }
}

function draw_game()
{
   
    context.clearRect(0,0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0,0, canvas.width, canvas.height );
    handleKeys()
    hero.draw()
    draw_enemies()
    enemies_shoot()
    collision_consequence()




    requestAnimationFrame(draw_game);
    
}

//bara til að testa
enemies.push(new Goblin())

requestAnimationFrame(draw_game);



