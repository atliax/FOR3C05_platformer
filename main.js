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

const hero =  
{
    x_coord: canvas.width/2.3,
    height: 100,
    y_coord: canvas.height - 100, 
    width: 80,
    speed: 5,
    velocityX: 0,
    velocityY: 0,
    jumping: false,
    draw()
    {
        context.fillStyle = "blue";
        context.fillRect(hero.x_coord, hero.y_coord, hero.width, hero.height);
        hero.velocityX *= 0.9;
        hero.velocityY += 0.5;
        hero.x_coord += hero.velocityX;
        hero.y_coord += hero.velocityY;
        if (hero.x_coord >= canvas.width - hero.width)
        {
            hero.x_coord =  0
        }   else if (hero.x_coord <= 0) 
        {
            hero.x_coord = canvas.width-hero.width
        }
    
        if (hero.y_coord >= canvas.height - hero.height)
        {
            hero.y_coord = canvas.height - hero.height
            hero.jumping = false
        }
    },
    shoot()
    {
        const bullet_speed = -5 ;
        const bullet = new Bullet(this.x_coord, this.y_coord+this.height, bullet_speed);
        enemy_bullet.push(bullet);
    },
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

class Bullet 
{
    constructor(x, y, speed)
    {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 5
        this.height = 1
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
        this.width = 40
        this.height = 35
        this.speed = 2
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
        const bullet_speed = 5 ;
        const bullet = new Bullet(this.x, this.y+this.height, bullet_speed);
        enemy_bullet.push(bullet);
    }

}
enemy_bullet = [];

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
    for (let i = 0; i < enemy_bullet.length; i++) {
        enemy_bullet[i].draw();
    }



    requestAnimationFrame(draw_game);
    
}

//bara til að testa
enemies.push(new Goblin())

requestAnimationFrame(draw_game);



