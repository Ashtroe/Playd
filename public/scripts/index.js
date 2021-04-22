<<<<<<< HEAD:public/scripts/index.js


import { games } from './games.js'

const randomNum = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
=======
import { games, randomNum } from './games.js'
>>>>>>> 30c9072f4af6c1cc44cf5001f5038702b0cbaddc:scripts/index.js



let recentCategories = {}


// Get past Week
let DateTime = luxon.DateTime
let now = DateTime.local()
var newFormat = delete DateTime.DATETIME_MED.time

let yesterday = now.minus({days:1}).toLocaleString(DateTime.newFormat)
let twoDaysAgo = now.minus({days:2}).toLocaleString(DateTime.newFormat)
let threeDaysAgo = now.minus({days:3}).toLocaleString(DateTime.newFormat)
let fourDaysAgo = now.minus({days:4}).toLocaleString(DateTime.newFormat)
let fiveDaysAgo = now.minus({days:5}).toLocaleString(DateTime.newFormat)
let sixDaysAgo = now.minus({days:6}).toLocaleString(DateTime.newFormat)
let sevenDaysAgo = now.minus({days:7}).toLocaleString(DateTime.newFormat)

let pastWeek = 
  [
  yesterday,
  twoDaysAgo,
  threeDaysAgo,
  fourDaysAgo,
  fiveDaysAgo,
  sixDaysAgo,
  sevenDaysAgo
]








let friends = [
    {
        username: 'Friend 1',
        currentgames:[
            games[randomNum(0,5)]
        ]
      },
    {
        username: 'Friend 2',
        currentgames:[
          games[randomNum(0,5)] 
        ]
    },
    {
        username: 'Friend 3',
        currentgames:[
          games[randomNum(0,5)] 
        ]
    },
    {
        username: 'Friend 4',
        currentgames:[
          games[randomNum(0,5)]
            
        ]
    },
]

// Get Recent Categories


if(document.querySelector('.recently-played-ctnr')){
  let showPlayedgames = (game) => {
    let gameWrapper = document.createElement('a')
    gameWrapper.href = '#'

    gameWrapper.classList.add('recent-game')
    gameWrapper.style.backgroundImage = `url(${game.cover})`
    document.querySelector('.recently-played-ctnr').appendChild(gameWrapper)
}

  let populateCategories = ()=>{
    games.forEach(game=>{
      
      recentCategories[game.category] = {
                                          hoursPlayed: {
                                            [yesterday]: 0,
                                            [twoDaysAgo]: 0,
                                            [threeDaysAgo]: 0,
                                            [fourDaysAgo]: 0,
                                            [fiveDaysAgo]: 0,
                                            [sixDaysAgo]: 0,
                                            [sevenDaysAgo]: 0
                                          }
                                        }
      showPlayedgames(game)
    })
  }
  populateCategories()

  games.forEach(game=>{
    recentCategories[game.category].hoursPlayed[yesterday] = recentCategories[game.category].hoursPlayed[yesterday] + game.playTime[0] || 0
    recentCategories[game.category].hoursPlayed[twoDaysAgo] = recentCategories[game.category].hoursPlayed[twoDaysAgo] + game.playTime[1] || 0
    recentCategories[game.category].hoursPlayed[threeDaysAgo] = recentCategories[game.category].hoursPlayed[threeDaysAgo] + game.playTime[2] || 0
    recentCategories[game.category].hoursPlayed[fourDaysAgo] = recentCategories[game.category].hoursPlayed[fourDaysAgo] + game.playTime[3] || 0
    recentCategories[game.category].hoursPlayed[fiveDaysAgo] = recentCategories[game.category].hoursPlayed[fiveDaysAgo] + game.playTime[4] || 0
    recentCategories[game.category].hoursPlayed[sixDaysAgo] = recentCategories[game.category].hoursPlayed[sixDaysAgo] + game.playTime[5] || 0
    recentCategories[game.category].hoursPlayed[sevenDaysAgo] = recentCategories[game.category].hoursPlayed[sevenDaysAgo] + game.playTime[6] || 0
 })


 // Generate Graph
 Highcharts.chart('graph-ctnr', {
  chart: {
    type: 'bar'
  },
  title: {
    text: 'Recent Genres'
  },
  xAxis: {
    categories: pastWeek
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Total Hours Played'
    }
  },
  legend: {
    reversed: true
  },
  plotOptions: {
    series: {
      stacking: 'normal'
    }
  },
  series: [
    {
    name: Object.keys(recentCategories)[0],
    data: [
      recentCategories[Object.keys(recentCategories)[0]].hoursPlayed[yesterday],
      recentCategories[Object.keys(recentCategories)[0]].hoursPlayed[twoDaysAgo],
      recentCategories[Object.keys(recentCategories)[0]].hoursPlayed[threeDaysAgo],
      recentCategories[Object.keys(recentCategories)[0]].hoursPlayed[fourDaysAgo],
      recentCategories[Object.keys(recentCategories)[0]].hoursPlayed[fiveDaysAgo],
      recentCategories[Object.keys(recentCategories)[0]].hoursPlayed[sixDaysAgo],
      recentCategories[Object.keys(recentCategories)[0]].hoursPlayed[sevenDaysAgo],
    ]
    },
    {
    name: Object.keys(recentCategories)[1],
    data: [
      recentCategories[Object.keys(recentCategories)[1]].hoursPlayed[yesterday],
      recentCategories[Object.keys(recentCategories)[1]].hoursPlayed[twoDaysAgo],
      recentCategories[Object.keys(recentCategories)[1]].hoursPlayed[threeDaysAgo],
      recentCategories[Object.keys(recentCategories)[1]].hoursPlayed[fourDaysAgo],
      recentCategories[Object.keys(recentCategories)[1]].hoursPlayed[fiveDaysAgo],
      recentCategories[Object.keys(recentCategories)[1]].hoursPlayed[sixDaysAgo],
      recentCategories[Object.keys(recentCategories)[1]].hoursPlayed[sevenDaysAgo],
    ]
    },
    {
    name: Object.keys(recentCategories)[2],
    data: [
      recentCategories[Object.keys(recentCategories)[2]].hoursPlayed[yesterday],
      recentCategories[Object.keys(recentCategories)[2]].hoursPlayed[twoDaysAgo],
      recentCategories[Object.keys(recentCategories)[2]].hoursPlayed[threeDaysAgo],
      recentCategories[Object.keys(recentCategories)[2]].hoursPlayed[fourDaysAgo],
      recentCategories[Object.keys(recentCategories)[2]].hoursPlayed[fiveDaysAgo],
      recentCategories[Object.keys(recentCategories)[2]].hoursPlayed[sixDaysAgo],
      recentCategories[Object.keys(recentCategories)[2]].hoursPlayed[sevenDaysAgo],
    ]
    },
    {
    name: Object.keys(recentCategories)[3],
    data: [
      recentCategories[Object.keys(recentCategories)[3]].hoursPlayed[yesterday],
      recentCategories[Object.keys(recentCategories)[3]].hoursPlayed[twoDaysAgo],
      recentCategories[Object.keys(recentCategories)[3]].hoursPlayed[threeDaysAgo],
      recentCategories[Object.keys(recentCategories)[3]].hoursPlayed[fourDaysAgo],
      recentCategories[Object.keys(recentCategories)[3]].hoursPlayed[fiveDaysAgo],
      recentCategories[Object.keys(recentCategories)[3]].hoursPlayed[sixDaysAgo],
      recentCategories[Object.keys(recentCategories)[3]].hoursPlayed[sevenDaysAgo],
    ]
    },
    {
    name: Object.keys(recentCategories)[4],
    data: [
      recentCategories[Object.keys(recentCategories)[4]].hoursPlayed[yesterday],
      recentCategories[Object.keys(recentCategories)[4]].hoursPlayed[twoDaysAgo],
      recentCategories[Object.keys(recentCategories)[4]].hoursPlayed[threeDaysAgo],
      recentCategories[Object.keys(recentCategories)[4]].hoursPlayed[fourDaysAgo],
      recentCategories[Object.keys(recentCategories)[4]].hoursPlayed[fiveDaysAgo],
      recentCategories[Object.keys(recentCategories)[4]].hoursPlayed[sixDaysAgo],
      recentCategories[Object.keys(recentCategories)[4]].hoursPlayed[sevenDaysAgo],
    ]
    },
    {
    name: Object.keys(recentCategories)[5],
    data: [
      recentCategories[Object.keys(recentCategories)[5]].hoursPlayed[yesterday],
      recentCategories[Object.keys(recentCategories)[5]].hoursPlayed[twoDaysAgo],
      recentCategories[Object.keys(recentCategories)[5]].hoursPlayed[threeDaysAgo],
      recentCategories[Object.keys(recentCategories)[5]].hoursPlayed[fourDaysAgo],
      recentCategories[Object.keys(recentCategories)[5]].hoursPlayed[fiveDaysAgo],
      recentCategories[Object.keys(recentCategories)[5]].hoursPlayed[sixDaysAgo],
      recentCategories[Object.keys(recentCategories)[5]].hoursPlayed[sevenDaysAgo],
    ]
    },
  ]
});

  
  // Render Friends Activiy
  let showFriend = (friend) =>{
    let friendWrapper = document.createElement('div')
    let textContainer = document.createElement('div')
    let username = document.createElement('a')
    let img = document.createElement('div')
    let recentPlaytime = document.createElement('h4')
    let recentDate = document.createElement('h4')

    img.style.backgroundImage = `url(${friend.currentgames[0].cover})`
    username.textContent = friend.username
    recentDate.textContent = ` Last Active: ${pastWeek[Math.floor(Math.random() * pastWeek.length)]}`
    recentPlaytime.textContent = `Recent play time: ${randomNum(0,5)} hrs`

    friendWrapper.classList.add('friend-ctnr')
    textContainer.classList.add('friend-text-ctnr')
    username.classList.add('username')
    username.href = '#'
    img.classList.add('img')
    recentDate.classList.add('recent-date')
    recentPlaytime.classList.add('recent-time')

    friendWrapper.appendChild(img)
    textContainer.appendChild(username)
    textContainer.appendChild(recentPlaytime)
    textContainer.appendChild(recentDate)
    friendWrapper.appendChild(textContainer)
    document.querySelector('.friends-played-ctnr').appendChild(friendWrapper)
    
  }

  friends.forEach(item=>{
    showFriend(item)
  })

}












  // Discover Page 
let currentSlide = 1

let topgamesMonth = [
  games[1],
  games[2],
  games[3],
  games[4],
  
]

function kFormatter(num) {
  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}
if(document.querySelector('.slide-ctnr')){
  topgamesMonth.forEach((game,index)=>{
    let container = document.querySelector('.top-month-ctnr')
    let gameDiv = document.createElement('div')
    let backgroundCover = document.createElement('div')
    let infoBackground = document.createElement('div')

    let infoContainer = document.createElement('div') 
    let playersContainer = document.createElement('div') 
    let releaseContainer = document.createElement('div') 
    let ratingContainer = document.createElement('div') 
    let playerCount = document.createElement('p')
    let playerCountText = document.createElement('p')
    let rating = document.createElement('p')
    let ratingText = document.createElement('p')
    let releaseDate = document.createElement('p')
    let releaseDateText = document.createElement('p')

    releaseContainer.classList.add('game-info-ctnr')
    playersContainer.classList.add('game-info-ctnr')
    ratingContainer.classList.add('game-info-ctnr')
    
    releaseDate.classList.add('game-info')
    rating.classList.add('game-info')
    playerCount.classList.add('game-info')

    releaseDateText.classList.add('info-text')
    ratingText.classList.add('info-text')
    playerCountText.classList.add('info-text')

    releaseDate.classList.add('release-date')
    rating.classList.add('rating')
    playerCount.classList.add('player-count')
    infoContainer.classList.add('info-ctnr')
    gameDiv.classList.add('top-game')
    backgroundCover.classList.add('background-cover')
    infoBackground.classList.add('info-background')

    gameDiv.id = `game-${index + 1}`
    backgroundCover.id = `game-${index + 1}-background`
    
    releaseDate.textContent = ` ${game.released}\r\n`  
    releaseDateText.textContent = `released`  

    playerCount.textContent = ` ${kFormatter(game.players)}\r\n`
    playerCountText.textContent += `players`

    rating.textContent = ` ${game.rating}%\r\n`
    ratingText.textContent = ` rating`
    
    gameDiv.style.backgroundImage = `url(${game.cover})`
    backgroundCover.style.backgroundImage = `url(${game.cover})`
    
    if(gameDiv.id === 'game-1'){
      gameDiv.classList.add('visible')
      
    }
    if(backgroundCover.id === 'game-1-background'){
      backgroundCover.classList.add('visible')
      
    }

    container.appendChild(backgroundCover)
  
    playersContainer.appendChild(playerCount)
    playersContainer.appendChild(playerCountText)

    releaseContainer.appendChild(releaseDate)
    releaseContainer.appendChild(releaseDateText)

    ratingContainer.appendChild(rating)
    ratingContainer.appendChild(ratingText)

    infoContainer.appendChild(releaseContainer)
    infoContainer.appendChild(playersContainer)
    infoContainer.appendChild(ratingContainer)
    
    gameDiv.appendChild(infoBackground)
    gameDiv.appendChild(infoContainer)
    container.appendChild(gameDiv)

  })
  
  
  let toggleSlideUp = () => {
    if(currentSlide<topgamesMonth.length){
      let currentGame = document.querySelector(`#game-${currentSlide}`)
      let currentGameBackground = document.querySelector(`#game-${currentSlide}-background`)
  
      let nextGame = document.querySelector(`#game-${currentSlide + 1}`)
      let nextGameBackground = document.querySelector(`#game-${currentSlide + 1}-background`)
  
      currentGame.classList.remove('visible')
      nextGame.classList.add('visible')
      currentGameBackground.classList.remove('visible')
      nextGameBackground.classList.add('visible')
  
      currentSlide++
    }
  }
  
  let toggleSlideDown = () => {
    if(currentSlide!=1){
      let currentGame = document.querySelector(`#game-${currentSlide}`)
      let currentGameBackground = document.querySelector(`#game-${currentSlide}-background`)
  
      let nextGame = document.querySelector(`#game-${currentSlide - 1}`)
      let nextGameBackground = document.querySelector(`#game-${currentSlide - 1}-background`)
  
      currentGame.classList.remove('visible')
      nextGame.classList.add('visible')
      currentGameBackground.classList.remove('visible')
      nextGameBackground.classList.add('visible')
  
      currentSlide--
    }
  }
  
  document.querySelector('#right-btn').addEventListener('click',()=>{
    toggleSlideUp()
  })
  document.querySelector('#left-btn').addEventListener('click',()=>{
    toggleSlideDown()
  })
  
  // Hover Animation
  let containers = document.querySelectorAll('.list')
  
  for (let i = 0; i < containers.length; i++) {
    let background = containers[i].querySelector('.list-background')
  
    containers[i].addEventListener('mouseenter',()=>{
      
      background.style.backgroundSize = '180%'
    })
  
    containers[i].addEventListener('mouseleave',()=>{
      background.style.backgroundSize = '150%'
    })
    
  }
}

// Account page
if(document.querySelector('.username-ctnr')){
  let usernameContainer = document.querySelector('.username-ctnr')
  let usernameInput = document.querySelector("input[name='username']")
  let passwordInput = document.querySelector('input[name="password"')
  let bioInput = document.querySelector('input[name="bio"')
  let birthdayInput = document.querySelector('input[name="birthday"')
  let profilePic = document.createElement('img')

  profilePic.src = user.picture
  usernameInput.value = user.username

  usernameContainer.appendChild(profilePic)

  

  let changePassword = (input) =>{
    user.password = input.value
  }

  passwordInput.addEventListener('keydown',(e)=>{
    if(e.key === "Enter" || e.keyCode === 13){
      changePassword(passwordInput)
      console.log(user);
    }
  })
}


// Search 
if(document.querySelector('.search-btn')){
let button = document.querySelector('.search-btn')
let search = document.querySelector('#search')

button.addEventListener('click',()=>{
  let query = search.value
  
  axios({
    method: 'post',
    url: '/search',
    data: {
      search: query,
    },
  })
  .then(response=>{
    if(response.status === 200){
      window.location.href = '/results'
    }
  })


})}

// Results page
let results;
if(document.querySelector('.results-ctnr')){
  axios({
    method:'post',
    useCredentials: true,
    url: '/results'
  }
    )
  .then(response=>{
    results = response.data
    console.log(results);
  })
  .then(()=>{
    results.forEach((game)=>{
      let resultContainer = document.querySelector('.results-ctnr')
      let result = document.createElement('a')
      let gameTitle = document.createElement('h2')

      result.classList.add('result')
      result.id = game.name
      result.href = game.url
      if(game.cover){
        gameTitle.style.visibility = 'hidden'
        result.style.backgroundImage = `url(//images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg)`
      }else{
        result.style.backgroundImage = ''
      }

      gameTitle.textContent = game.name
      result.appendChild(gameTitle)
      resultContainer.appendChild(result)

    })

  })
}

// Login 
if(document.querySelector('.login-ctnr')){
  let username = document.querySelector('.username').value
  let password = document.querySelector('.password').value
  

  document.querySelector('.login-submit-btn').addEventListener('click',()=>{
    axios({
      method:'post',
      
      url:'/login',
      data:{
        username: username,
        password: password,
      }
    })
    .then(response=>{
      if(response.status === 200){
        window.location.href = '/'
      }
    })
  })
}