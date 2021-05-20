export const randomNum = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}





export const games = [
    {
        title: 'Dragonball: FighterZ',
        completed: false,
        players: randomNum(40000,350000),
        released:'January 26, 2018',
        playTime: 
          [
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
          ],
        category: 'Fighting',
        rating: randomNum(50,100),
        cover: '../img/Fighterz.jpg',
    },
    {
        title: 'Forza Horizon 4',
        completed: false,
        players: randomNum(40000,350000),
        released:'September 28, 2018', 
        playTime: [
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
          ],
        category: 'Racing',
        rating: randomNum(50,100),
        cover: '../img/Forza.jpg',
    },
    {
        title: 'Little Nightmares II',
        completed: false,
        players: randomNum(40000,350000),
        released: 'December 9, 2020',
        playTime: [
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
          ],
        category: 'Adventure',
        rating: randomNum(50,100),
        cover: '../img/Nightmares2.jpg',
    },
    {
        title: 'Call of Duty: Modern Warfare',
        completed: false,
        players: randomNum(40000,350000),
        released: 'September 12, 2019',
        playTime: [
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
          ],
        category: 'FPS',
        rating: randomNum(50,100),
        cover: '../img/ModernWarfare.jpg',
    },
    {
        title: 'Hitman 3',
        completed: true,
        players: randomNum(40000,350000),
        released:  'January 20, 2021',
        playTime: [
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
          ],
        category: 'Stealth',
        rating: randomNum(50,100),
        cover: '../img/Hitman.jpg',
    },
    {
        title: 'Fallout 4',
        completed: false,
        players: randomNum(40000,350000),
        released: 'November 10, 2015',
        playTime: [
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
            randomNum(0,3),
          ],
        category: 'RPG',
        rating: randomNum(50,100),
        cover: '../img/Fallout4.jpg',
    },
    {
        title: 'Wasteland 3',
        completed: true,
        players: randomNum(40000,350000),
        released: ' August 27, 2020',
        playTime: [
          randomNum(0,3),
          randomNum(0,3),
          randomNum(0,3),
          randomNum(0,3),
          randomNum(0,3),
          randomNum(0,3),
          randomNum(0,3),
        ],
        category: 'RPG',
        rating: randomNum(50,100),
        cover: '../img/Wasteland3.jpg',
    },
]

export const futureGames = [
  {
    title: 'Resident Evil: Village',
    completed: false,
    players: randomNum(40000,350000),
    released:'May 7, 2021',
    category: 'Horror',
    rating: randomNum(50,100),
    cover: '../img/RE8.jpg',
  },
  {
    title: 'Deathloop',
    completed: false,
    players: randomNum(40000,350000),
    released:'September 14, 2021',
    category: 'Horror',
    rating: randomNum(50,100),
    cover: '../img/RE8.jpg',
  },
  {
    title: 'God of War: Ragnarok',
    completed: false,
    players: randomNum(40000,350000),
    released:'TBA',
    category: 'Horror',
    rating: randomNum(50,100),
    cover: '../img/Gow.jpg',
  },
  {
    title: 'Horizon Zero Dawn: Far West',
    completed: false,
    players: randomNum(40000,350000),
    released:'TBA',
    category: 'Horror',
    rating: randomNum(50,100),
    cover: '../img/Horizon.jpg',
  },
  {
    title: 'Halo Infinite',
    completed: false,
    players: randomNum(40000,350000),
    released:'TBA',
    category: 'Horror',
    rating: randomNum(50,100),
    cover: '../img/Halo.jpg',
  },
]