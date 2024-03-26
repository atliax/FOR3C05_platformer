// þetta teiknar debug upplýsingar á skjáinn ef þetta er sett sem true
const DEBUG = true;

// breytur sem geyma reitina sem Hero collision er að skoða
// (til að geta teikna debug box á þeim)
let mapTest1X = -1;
let mapTestY = -1;
let mapText2X = -1;

/*******************************************************************************
*                            Hérna byrja galdrarnir                            *
*******************************************************************************/

canvas = document.getElementById('mainCanvas');
context = canvas.getContext('2d');

// fyrsta fallið sem keyrir eftir að síðan hleðst inn
addEventListener("load",initialize);

/*******************************************************************************
*                                    Fastar                                    *
*******************************************************************************/

// allir tímatengdir fastar og hlutir eru í millisekúndum

// til að auðvelda læsileika í lyklaborðsföllum
const KEY_SPACE = 32;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_R = 82;

// stillingar leikmanns
const HERO_GRAVITY = 0.5;
const HERO_ACCELERATION = 0.5;
const HERO_MAX_SPEED = 6;
const HERO_GROUND_SPEED_MODIFIER = 0.5;
const HERO_JUMP_SPEED = 10;
const HERO_BULLET_SPEED = -5;
const HERO_SHOOT_DELAY = 600;
const HERO_HITPOINTS = 3;

// stillingar óvina
const ENEMY_BULLET_SPEED = 5;
const ENEMY_SPEED = 2;
const ENEMY_BULLET_DELAY = 1000;
const ENEMY_HITPOINTS = 2;
const ENEMY_Y_SPAWN = 60;

// upphafsstillingar á erfiðleika
const DEFAULT_MAX_ENEMIES = 3;
const DEFAULT_ENEMY_SPAWN_INTERVAL = 5000;
const DEFAULT_DIFFICULTY = 1000;

// tími milli aukalífa
const EXTRA_LIFE_INTERVAL = 45000;

// stillingar á pöllunum í borðinu
const LEVEL_WIDTH = 26;
const LEVEL_HEIGHT = 20;
const LEVEL_SCALE = 32;

// gögnin fyrir pallana sjálfa
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

/*******************************************************************************
*                              Hljóð og myndskrár                              *
*******************************************************************************/

// tveir litlir wrapperar til að auðvelda skilgreiningarnar neðan við þá
// þeir gera ekkert nema hlaða inn hljóði og myndum
class AudioWrapper extends Audio
{
    constructor(src,volume = 1.0,loop = false)
    {
        super();
        this.src = src;
        this.volume = volume;
        this.loop = loop;
    }
}
class ImageWrapper extends Image
{
    constructor(src)
    {
        super();
        this.src = src;
    }
}

// tónlistin
const audioMusicTrack = new AudioWrapper("Music/track1.mp3", 0.2, true);

// effectarnir
const audioHeroDead = new AudioWrapper("Music/heroDead.mp4");
const audioHeroShoot = new AudioWrapper("Music/heroShoot.mp3", 0.4);
const audioBulletHit = new AudioWrapper("Music/bulletHit.mp3");
const audioGoblinShoot = new AudioWrapper("Music/goblinShoot.mp3", 0.3);
const audioHeroDamage = new AudioWrapper("Music/heroDamage.wav");
const audioHeroWalk = new AudioWrapper("Music/walk.flac",0.2);
const audioHeroJump = new AudioWrapper("Music/jump.ogg",0.1);

// bakgrunnsmynd
const imageBackground = new ImageWrapper("Myndir/Bar.jpg");
// aukalífsmynd
const imageExtraLife = new ImageWrapper("Myndir/heart.png");
// stóru hjörtun á notendaviðmótinu
const imageGUILife = new ImageWrapper("Myndir/heartBig.png");
// pallamynd
const imageBrickTile = new ImageWrapper("Myndir/tileBrick.png");

// myndir fyrir leikmann
const imageHeroIdleLeft = new ImageWrapper("Myndir/IDLE_L_2x.png");
const imageHeroIdleRight = new ImageWrapper("Myndir/IDLE_R_2x.png");
const imageHeroWalkLeft = new ImageWrapper("Myndir/WALK_L_2x.png");
const imageHeroWalkRight = new ImageWrapper("Myndir/WALK_R_2x.png");
const imageHeroShoot = new ImageWrapper("Myndir/SHOOT_2x.png");
const imageHeroDead = new ImageWrapper("Myndir/DEAD_2x.png");

// myndir fyrir óvini
const imageEnemyFullHealth = new ImageWrapper("Myndir/EnemyP1Big.png");
const imageEnemyHalfHealth = new ImageWrapper("Myndir/EnemyP2Big.png");

// myndir fyrir byssukúlur
const imageEnemyBullet = new ImageWrapper("Myndir/enemyBulletsBig.png");
const imageHeroBullet = new ImageWrapper("Myndir/heroBulletBig.png");

// animation upplýsingar, skilgreina mynd og svo hversu margir rammar
// af animation eru á viðkomandi mynd. Notað af Sprite klass til að
// teikna hluti

// leikmaður
const heroAnimations = {
    idleLeft: {image:imageHeroIdleLeft, frames: 2},
    idleRight: {image: imageHeroIdleRight, frames: 2},
    walkLeft: {image: imageHeroWalkLeft, frames: 4},
    walkRight: {image: imageHeroWalkRight, frames: 4},
    shoot: {image: imageHeroShoot, frames: 2},
    dead: {image: imageHeroDead, frames: 2}
};

// óvinir
const enemyAnimations = {
    fullHealth: {image: imageEnemyFullHealth, frames: 1},
    halfHealth: {image: imageEnemyHalfHealth, frames: 1}
};

// byssukúlur óvina
const enemyBulletAnimations = {
    main: {image: imageEnemyBullet, frames: 4}
};

// byssukúlur leikmanns
const heroBulletAnimations = {
    main: {image: imageHeroBullet, frames: 1}
};

// aukalíf
const extraLifeAnimations = {
    main: {image: imageExtraLife, frames: 1}
};

/*******************************************************************************
*                                    Breytur                                   *
*******************************************************************************/

// geymir setInterval fyrir aðallykkju
let runGame;

// verður seinna eintak af Hero klassa
let hero;

// fjöldi óvina
let numEnemies;

// game over breyta
let isHeroDead;

// stig leikmanns
let score;

// skeiðklukkur, notaðar til að stýra tímasetningum á aukalífum og óvinum
let lastExtraLife;
let lastEnemySpawn;

// erfiðleikastillingar, hámarksfjöldi óvina og tíminn á milli sköpunar þeirra
let maxEnemies = DEFAULT_MAX_ENEMIES;
let enemySpawnInterval = DEFAULT_ENEMY_SPAWN_INTERVAL;

// erfiðleikastilling, þröskuldur fyrir stig þar sem erfiðleiki hækkar
let difficulty = DEFAULT_DIFFICULTY;

// geymir seinasta takka sem var sleppt til að velja hvaða mynd af leikmanni á að teikna
let lastKeyUpCode = null;

// ákvarðar hvort tónlistin hafi byrjað að spilast eða ekki
let musicStarted = false;

// árekstraboxin fyrir hlutina í leiknum
let heroHitbox;
let heroBulletHitbox;
let enemyHitbox;
let enemyBulletHitbox;
let defaultHitbox;
let extraLifeHitbox;

// fylki af true/false eftir því hvaða takkar á lyklaborði eru niðri
const keyDown = [];

// fylki fyrir Sprite hlutina í leiknum
const extraLife = [];
const enemies = [];
const enemy_bullet = [];
const hero_bullet = [];

/*******************************************************************************
*                               Atburðahlustarar                               *
*******************************************************************************/

// keydown()
// skráir niður lyklaborðstakka sem er ýtt niður
function keydown(event)
{
    if(event.keyCode == KEY_LEFT || event.keyCode == KEY_RIGHT ||
       event.keyCode == KEY_UP   || event.keyCode == KEY_SPACE ||
       event.keyCode == KEY_R)
    {
        keyDown[event.keyCode] = true;
    }

    // smá hack svo að browserinn leyfi okkur að spila bakgrunnstónlistina
    if(musicStarted == false)
    {
        musicStarted = true;
        audioMusicTrack.play();
    }

    // hindra space í að fara neðar á síðunni
    if(event.keyCode == KEY_SPACE)
    {
        event.preventDefault();
    }
}

// keyup()
// skráir niður lyklaborðstakka sem er sleppt
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

/*******************************************************************************
*                                     Föll                                     *
*******************************************************************************/

// initialize()
// Stillir hitt og þetta í upphafi keyrslu
function initialize()
{
    // stillum árekstraboxin fyrir hlutina í leiknum
    heroHitbox = new Hitbox(12,0,32,64);
    heroBulletHitbox = new Hitbox(0,0,18,23);
    enemyHitbox = new Hitbox(0,0,64,45);
    enemyBulletHitbox = new Hitbox(2,2,29,28);
    defaultHitbox = new Hitbox(0,0,1,1);
    extraLifeHitbox = new Hitbox(0,0,23,22);

    // stofnum hetjuna okkar og núllstillum nokkra hluti
    hero = new Hero();
    score = 0;
    isHeroDead = false;
    numEnemies = 0;
    lastEnemySpawn = get_timestamp()-DEFAULT_ENEMY_SPAWN_INTERVAL;
    lastExtraLife = get_timestamp();

    // virkjum lyklaborðshlustarana
    document.addEventListener("keydown",keydown);
    document.addEventListener("keyup",keyup);

    // og setjum allt í gang - 1000/60 = 16.67ms, eða c.a. 60 lykkjur á sekúndu
    runGame = setInterval(main_loop,1000/60);
}

// main_loop()
// Keyrt aftur og aftur með setInterval()
// Aðalvirkni leiksins fer fram hérna
function main_loop()
{
    // fyrst kíkjum við á input atburði og bregðumst við þeim
    handle_keys();

    // breyta hlutum og stofna hluti eftir því hvað er að gerast í leiknum
    adjust_difficulty();
    spawn_enemies();
    spawn_extra_life();
    
    // svo hreyfum við hlutina
    hero.move();
    enemies_move();
    bullets_move(hero_bullet);
    bullets_move(enemy_bullet);

    // leyfum óvinunum að skjóta líka og bregðumst svo við því
    enemies_shoot();
    collision_consequence();

    // og teiknum að lokum öll herlegheitin
    draw_game();
}

// handle_keys()
// kíkir á það hvaða takkar eru niðri á lyklaborðinu
// og bregst við eftir því sem við á
function handle_keys()
{
    // ef hetjan er dáin, þá skoðum við bara R takkann (sem byrjar nýjan leik)
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
        hero.switch_sprite("walkLeft");
        audioHeroWalk.play();
    }

    if(keyDown[KEY_RIGHT] == true)
    {
        hero.walk(hero.speed);
        hero.switch_sprite("walkRight");
        audioHeroWalk.play();
    }

    if(keyDown[KEY_UP] == true)
    {
        hero.jump();
        audioHeroWalk.pause();
    }

    if(keyDown[KEY_SPACE] == true)
    {
        hero.shoot();
        hero.switch_sprite("shoot");
    }

    // ef enginn af tökkunum er niðri
    if(!keyDown[KEY_LEFT] && !keyDown[KEY_RIGHT] && !keyDown[KEY_UP] && !keyDown[KEY_SPACE])
    {
        // þá skiptum við um útlit á hetjunni eftir því hvaða takka var sleppt seinast
        if(lastKeyUpCode == KEY_LEFT)
        {
            hero.switch_sprite("idleLeft");
        }

        if(lastKeyUpCode == KEY_RIGHT)
        {
            hero.switch_sprite("idleRight");
        }

        if(lastKeyUpCode == KEY_SPACE)
        {
            hero.switch_sprite("idleRight");
        }

        if(lastKeyUpCode == KEY_UP)
        {
            hero.switch_sprite("idleLeft");
        }
    }
}

// restart_game()
// byrjar nýjan leik
function restart_game()
{
    // núllstillum leikmann
    hero.switch_sprite("idleRight");
    hero.x = canvas.width/2.3;
    hero.y = canvas.height - 96;
    hero.velocityX = 0;
    hero.velocityY = 0;
    hero.hitpoints = 3;
    isHeroDead = false;
    score = 0;

    // eyðum öllum byssukúlum
    hero_bullet.splice(0,hero_bullet.length);
    enemy_bullet.splice(0,enemy_bullet.length);

    // eyðum öllum óvinum
    enemies.splice(0,numEnemies);
    numEnemies = 0;

    // núllstillum erfiðleikann
    maxEnemies = DEFAULT_MAX_ENEMIES;
    enemySpawnInterval = DEFAULT_ENEMY_SPAWN_INTERVAL;
    difficulty = DEFAULT_DIFFICULTY;

    // fjarlægjum aukalífið ef það er til staðar
    if(extraLife.length > 0)
    {
        extraLife.splice(0,1);
    }

    // núllstillum skeiðklukkur fyrir tímasetta atburði
    lastEnemySpawn = get_timestamp()-enemySpawnInterval;
    lastExtraLife = get_timestamp();
}

// adjust_difficulty()
// stillir erfiðleikann á leiknum eftir stigum leikmanns
function adjust_difficulty()
{
    // ef næsta erfiðleikaþröskuldi er náð
    if(score >= difficulty)
    {
        // þá styttist tíminn á milli óvina
        enemySpawnInterval -= 500;
        difficulty += 1000;
    }

    // síðan er hámarksfjöldi óvina hækkaður eftir stigafjölda
    if(score == 2000)
    {
        maxEnemies = 4;
    }

    if(score == 5000)
    {
        maxEnemies = 6;
    }

    if(score == 8000)
    {
        maxEnemies = 12;
    }
}

// spawn_enemies()
// býr til nýja óvini ef það er pláss fyrir þá og ef það er kominn tími til þess
function spawn_enemies()
{
    if(numEnemies >= maxEnemies)
    {
        return;
    }

    if(get_timestamp() - lastEnemySpawn > enemySpawnInterval)
    {
        enemies.push(new Goblin());
        lastEnemySpawn = get_timestamp();
    }
}

// spawn_extra_life()
// býr til aukalíf uppi á pallinum ef það er kominn tími á það
function spawn_extra_life()
{
    // og bara ef það er ekki þegar til staðar
    if(extraLife.length < 1)
    {
        if(get_timestamp() - lastExtraLife > EXTRA_LIFE_INTERVAL)
        {
            extraLife.push(new ExtraLife(50,200));
            lastExtraLife = get_timestamp();
        }
    }
}

// enemies_move()
// ... þarf að segja meira?
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

// bullets_move()
// tekur við fylki af byssukúlum, hreyfir þær og eyðir
// þeim svo ef þær eru komnar út fyrir skjáinn
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

// enemies_shoot()
// ...
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

// collision_consequence()
// kíkir á árekstra á eftirfarandi:
//   hero_bullet[] -> enemies[]
//   enemy_bullet[] -> hero
//   extra_life[] -> hero
//
// bregst við eftir þörfum með því að minnka líf,
// drepa óvini, drepa leikmann eða gefa aukalíf
function collision_consequence()
{
    for (let i= 0; i < hero_bullet.length; i++)
    {
        for (let j = 0; j < enemies.length; j++)
        {
            if (check_collision(hero_bullet[i], enemies[j]))
            {
                // hér hefur orðið árekstur á milli óvins og byssukúlu leikmanns
                hero_bullet.splice(i, 1);

                enemies[j].hitpoints--;
                enemies[j].switch_sprite("halfHealth");

                audioBulletHit.play();

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
            // hér hefur orðið árekstur á milli leikmanns og byssukúlu óvins
            enemy_bullet.splice(i, 1);

            hero.hitpoints--;

            audioHeroDamage.play();

            if (hero.hitpoints <= 0)
            {
                player_dead();
            }
        }  
    }

    if(extraLife.length > 0)
    {
        if(hero.hitpoints < 3)
        {
            if(check_collision(extraLife[0],hero))
            {
                // hér hefur orðið árekstur á milli leikmanns og aukalífs
                extraLife.splice(0,1);
                hero.hitpoints++;
                lastExtraLife = get_timestamp();
            }
        }
    }
}

// check_collision()
// skoðar rectangle-rectangle árekstra á milli hluta
//
// báðir hlutirnir verða að vera afleiður af Sprite klassanum
// eða a.m.k. að hafa viðeigandi gögn í sér til að fallið virki
function check_collision(object1, object2)
{
    // skilgreinum fyrst X og Y hnit á hliðum ferhyrninganna
    // þau hliðrast/breytast um hitbox sem objectið hefur
    let object1left  = object1.x + object1.hitbox.X;
    let object1right = object1.x + object1.hitbox.X + object1.hitbox.W;
    let object1top   = object1.y + object1.hitbox.Y;
    let object1bot   = object1.y + object1.hitbox.Y + object1.hitbox.H;

    let object2left  = object2.x + object2.hitbox.X;
    let object2right = object2.x + object2.hitbox.X + object2.hitbox.W;
    let object2top   = object2.y + object2.hitbox.Y;
    let object2bot   = object2.y + object2.hitbox.Y + object2.hitbox.H;

    // hefðbundin rectangle-rectangle prófun með tölunum hér að ofan
    if(object1right > object2left  &&
        object1left < object2right &&
         object1bot > object2top   &&
         object1top < object2bot)
    {
        return true;
    }

    return false;
}

// player_dead()
// myrðir leikmann í köldu blóði
function player_dead()
{
    hero.switch_sprite("dead");
    isHeroDead = true;
    audioHeroDead.play();
}

// draw_game()
// teiknar það sem þarf að teikna
function draw_game()
{
    // fyrst bakgrunn
    draw_background();

    // svo sprite
    hero.draw();
    draw_enemies();
    draw_bullets(hero_bullet);
    draw_bullets(enemy_bullet);
    draw_bonus();

    // svo notendaviðmót
    draw_life();
    draw_score();

    if(isHeroDead)
    {
        draw_dead_message();
    }

    // og að lokum smá debug með staðsetningu leikmanns
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

// draw_background()
// teiknar bakgrunnsmyndina og pallana í borðinu
function draw_background()
{
    // bakgrunnsmynd
    context.clearRect(0,0, canvas.width, canvas.height);
    context.drawImage(imageBackground, 0,0 , canvas.width, canvas.height);

    // pallar, fyrst línu fyrir línu
    for(let y = 0; y < LEVEL_HEIGHT; y++)
    {
        // svo dálk fyrir dálk
        for(let x = 0; x < LEVEL_WIDTH; x++)
        {
            let index = (y * LEVEL_WIDTH) + x;

            // teiknum bara ef það er eitthvað
            if(levelData[index] != 0)
            {
                context.drawImage(imageBrickTile,x*LEVEL_SCALE,y*LEVEL_SCALE);

                // debug box sem birtir reitina sem er verið að skoða í Hero collision
                if(((mapTest1X == x || mapText2X == x) && mapTestY == y) && DEBUG)
                {
                    context.save();
                    context.strokeStyle = "green";
                    context.beginPath();
                    context.rect(x*LEVEL_SCALE,y*LEVEL_SCALE,LEVEL_SCALE,LEVEL_SCALE);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }
}

// draw_enemies()
// ...
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

// draw_life()
// teiknar líf leikmanns á notendaviðmótið
function draw_life()
{
    const spacing = 10;
    const X = 7;
    const Y = 7;

    for(let i = 0; i < hero.hitpoints; i++)
    {
        life = X + (imageGUILife.width + spacing) * i;
        context.drawImage(imageGUILife, life, Y);
    }
}

// draw_bullets()
// tekur við fylki af byssukúlum og teiknar þær
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

// draw_score()
// teiknar stig leikmanns á notendaviðmótið
function draw_score()
{
    context.save();
    context.fillStyle = "black"; 
    context.font = "24px Serif";
    context.fillText("score: "+score, canvas.width -190 , 30);
    context.restore();
}

// draw_bonus()
// teiknar aukalíf ef það er til staðar
function draw_bonus()
{
    if(extraLife.length > 0)
    {
        extraLife[0].draw();
    }
}

// draw_dead_message()
// teiknar miðjusett textabox með game over skilaboðum og stigafjölda leikmanns
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

// get_map_collision()
// athugar hvort gefinn reitur í borðinu sé solid eða ekki
// við gerum ekki ráð fyrir götum þannig að allt sem er í neðstu línu er solid
// auk þess er allt utan við lögleg gildi ekki solid
function get_map_collision(X, Y)
{
    if(Y == LEVEL_HEIGHT-1)
        return true;
    if(X < 0 || X >= LEVEL_WIDTH)
        return false;
    if(Y < 0 || Y >= LEVEL_HEIGHT)
        return false;

    // hérna er loksins flett upp í levelData fylkinu
    if(levelData[Y * LEVEL_WIDTH + X] != 0)
        return true;

    return false;
}

// get_timestamp()
// skilar út tíma síðan 1. janúar 1970 í millisekúndum
// notað fyrir skeiðklukkur
function get_timestamp()
{
    return performance.timeOrigin + performance.now();
}

/*******************************************************************************
*                                    Klassar                                   *
*******************************************************************************/

// Sprite
// grunnklass á öllum hlutum í leiknum nema borðinu
// sér um að teikna viðeigandi mynd eftir því hvaða ástand er á hlutnum
//
// það er ekki hægt að búa til eintak af þessum klassa, það verður að stofna
// afleiðuklassa og gefa honum ýmsar upplýsingar eins og t.d. this.x og this.y
class Sprite
{
    constructor(animations)
    {
        this.currentFrame = 0;
        this.frameBuffer = 8;  // stjórnar hversu hratt sprite-ið skiptir um mynd
        this.elapsedFrames = 0;

        this.hitbox = defaultHitbox;

        this.animations = animations;

        // sækjum key á fyrsta animation
        let loadedFirst = false;
        let firstKey;
        for(let key in this.animations) 
        {
            if(loadedFirst == false)
            {
                firstKey = key;
                loadedFirst = true;
                break;
            }
        }

        // til að geta svo virkjað það hér
        this.switch_sprite(firstKey);
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

        // skilgreinum hvaða svæði á myndinni við ætlum að teikna
        // eftir því á hvaða animation frame við erum
        const cropbox = 
        {
            x: this.currentFrame * this.image.width / this.frames,
            y: 0,
            width: this.image.width / this.frames,  
            height: this.image.height
        }

        // og teiknum svo það svæði á skjáinn
        context.drawImage(
            this.image,
            cropbox.x,
            cropbox.y,
            cropbox.width,
            cropbox.height,
            this.x, 
            this.y,
            this.width,
            this.height);

        // kíkjum svo á hvort það sé kominn tími á að skipta um frame
        this.animate();
        
    }

    switch_sprite(key) 
    {
        // ef myndin er þegar valin, þá þarf ekkert að gera
        if(this.image === this.animations[key].image)
        {
            return;
        }

        // annars sækjum við rétta mynd
        this.image = this.animations[key].image;
        this.frames = this.animations[key].frames;

        // og stillum breiddina okkar eftir því
        this.width = this.image.width / this.frames;
        this.height = this.image.height;

        // byrjum svo upp á nýtt á viðkomandi animation
        this.currentFrame = 0;
        this.elapsedFrames = 0;
    }

    animate()
    {
        // teljum upp
        this.elapsedFrames++;

        // athugum hvort teljarinn hafi náð yfir frame buffer
        if(this.elapsedFrames % this.frameBuffer === 0)
        {
            // og veljum næsta frame
            if(this.currentFrame < this.frames - 1)
            {
                this.currentFrame++;
            }
            else// eða fyrsta ramma ef það er komið að því að fara í hring
            {
                this.currentFrame = 0;
            }
        }
    }
}

// Hero
// leikmaðurinn
class Hero extends Sprite
{
    constructor()
    {
        super(heroAnimations);

        // upphafsstaðsetning leikmanns
        this.x = canvas.width/2.3;
        this.y = canvas.height - (3*LEVEL_SCALE);

        this.speed = HERO_ACCELERATION;
        this.groundSpeedModifier = HERO_GROUND_SPEED_MODIFIER;
        this.maxSpeed = HERO_MAX_SPEED;

        this.velocityX = 0;
        this.velocityY = 0;

        this.onGround = false;

        this.shootDelay = HERO_SHOOT_DELAY;
        this.lastshotTime = 0;

        this.hitpoints = HERO_HITPOINTS;

        this.hitbox = heroHitbox;
    }

    walk(speedchange)
    {
        // hækkum hraðan aðeins ef við erum á jörðinni
        // svo að mótstaðan hægi ekki of mikið á okkur
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

        // hækkum/lækkum núverandi hraða
        this.velocityX += speedchange;

        // læsum honum svo í hámarkshraða
        if(this.velocityX > this.maxSpeed)
        {
            this.velocityX = this.maxSpeed;
        }

        if(this.velocityX < 0 && this.velocityX < -this.maxSpeed)
        {
            this.velocityX = -this.maxSpeed;
        }
    }

    jump()
    {
        // við getum bara stokkið af jörðinni og bara ef við erum ekki að detta
        if(this.velocityY == 0 && this.onGround)
        {
            this.velocityY = -HERO_JUMP_SPEED;
            this.onGround = false;
            audioHeroJump.play();
        }
    }

    shoot()
    {
        // athugum hvort nægur tími sé liðinn til að við megum skjóta
        const currentTime = get_timestamp();
        if(currentTime - this.lastshotTime > this.shootDelay)
        {
            // stillum X hnitið til eftir staðsetningu byssunnar
            let shootX = this.x+(this.width*0.5)-10;

            hero_bullet.push(new HeroBullet(shootX, this.y));
            this.lastshotTime = currentTime;

            audioHeroShoot.play();
        }
    }

    move()
    {
        // smíðum tilvonandi staðsetningu
        let newPosY = this.y + this.velocityY;
        let newPosX = this.x + this.velocityX;

        // við viljum ekki vera of jarðbundnir
        // (annars getum við ekki gengið fram af pöllum)
        this.onGround = false;

        // kíkjum á árekstra við pallana í borðinu
        if(this.velocityY <= 0)
        {
            // engir árekstrar á uppleið
        }
        else if(!isHeroDead) // engir árekstrar ef leikmaður er dáinn
        {
            // veljum okkur reiti úr borðinu til að skoða
            let mapX  = Math.floor((newPosX+16)/LEVEL_SCALE);
            let mapY  = Math.floor((newPosY+(2*LEVEL_SCALE))/LEVEL_SCALE);
            let mapX2 = Math.floor(((newPosX-16)+(1.8*LEVEL_SCALE))/LEVEL_SCALE);

            // skrifum hjá okkur reitina til að geta birt debug box á þeim
            mapTest1X = mapX;
            mapTestY = mapY;
            mapText2X = mapX2;
            
            // athugum hvort þeir séu gegnheilir
            if(get_map_collision(mapX,mapY) ||
               get_map_collision(mapX2,mapY))
            {
                // þeir voru það þannig að við læsum staðsetningunni okkar á toppinn á viðkomandi reit
                newPosY = (Math.floor(newPosY/LEVEL_SCALE))*LEVEL_SCALE;
                // stöðvum Y hreyfingu
                this.velocityY = 0;
                // og komum okkur aftur niður á jörðina
                this.onGround = true;
            }
        }

        // staðsetning stillt að lokinni árekstraprófun
        this.x = newPosX;
        this.y = newPosY;

        // næstu 2 if skipanir snúast um að flytja okkur yfir á "hinn" endann
        // á skjánum ef við förum út fyrir jaðarinn á honum
        if(this.x > canvas.width)
        {
            this.x -= canvas.width+this.width;
        }
        if(this.x < (0-this.width))
        {
            this.x += canvas.width+this.width;
        }

        // eiga við hraða leikmanns með þyngdarafli og núningi við jörðina
        this.gravity();
        this.drag();
    }

    gravity()
    {
        // sleppum þyngdarafli ef við erum á jörðinni
        if(!this.onGround)
        {
            this.velocityY += HERO_GRAVITY;
        }
    }

    drag()
    {
        // sleppum núningi ef við erum í loftinu
        if(this.onGround)
        {
            this.velocityX *= (2/3);

            // stoppum svo alveg ef hraðinn er kominn mjög lágt
            if(Math.abs(this.velocityX) < 0.1)
            {
                this.velocityX = 0;
            }
        }
    }
}

// Bullet
// grunnklassi fyrir byssukúlur
class Bullet extends Sprite
{
    constructor(X,Y,animations)
    {
        super(animations);

        this.x = X;
        this.y = Y;
    }

    move()
    {
        this.y += this.speed;
    }
}

// HeroBullet
// byssukúlur leikmanns
class HeroBullet extends Bullet
{
    constructor(X,Y)
    {
        super(X,Y,heroBulletAnimations);

        this.speed = HERO_BULLET_SPEED;
        this.hitbox = heroBulletHitbox;
    }
}

// EnemyBullet
// byssukúlur óvinanna
class EnemyBullet extends Bullet
{
    constructor(X,Y)
    {
        super(X,Y,enemyBulletAnimations);

        this.speed = ENEMY_BULLET_SPEED;
        this.hitbox = enemyBulletHitbox;
    }
}

// Goblin
// óvinirnir sem hreyfast yfir skjáinn og skjóta niður
class Goblin extends Sprite
{
    constructor()
    {
        super(enemyAnimations)

        this.x = Math.random()*(canvas.width-this.width);
        this.y = ENEMY_Y_SPAWN;

        this.speed = ENEMY_SPEED;
        this.shootDelay = ENEMY_BULLET_DELAY;

        this.hitpoints = ENEMY_HITPOINTS;

        this.lastshotTime = 0;

        this.hitbox = enemyHitbox;

        numEnemies++;
    }

    move()
    {
        // færum okkur til
        this.x += this.speed;

        // ef við erum komnir á endan á skjánum þá snýst hraðinn við
        if (this.x+this.width >= canvas.width)
        {
            this.speed *= -1;
        }

        // sömuleiðis með hinn endan á skjánum
        if (this.x+this.width <= this.width)
        {
            this.speed *= -1;
        }
    }

    shoot()
    {
        // athugum hvort nægur tími sé liðinn til að við megum skjóta
        const currentTime = get_timestamp();
        if (document.hasFocus() && currentTime - this.lastshotTime > this.shootDelay)
        {
            enemy_bullet.push(new EnemyBullet(this.x,this.y+this.height));
            this.lastshotTime = currentTime;

            audioGoblinShoot.play();
        }
    }
}

// ExtraLife
// aukalíf sem leikmaður getur náð í
class ExtraLife extends Sprite
{
    constructor(X,Y)
    {
        super(extraLifeAnimations);
        this.x = X;
        this.y = Y;
        this.hitbox = extraLifeHitbox;
    }
}

// Hitbox
// lítill klassi sem geymir upplýsingar um ferhyrning
// notað fyrir árekstraprófanir
class Hitbox
{
    constructor(X,Y,W,H)
    {
        this.X = X;
        this.Y = Y;
        this.W = W;
        this.H = H;
    }
}

/******************************************************************************/
