
let games = ['']
let recentHistory = []

// Get past Week
let DateTime = luxon.DateTime
let Info = luxon.Info
let now = DateTime.local()
var newFormat = delete DateTime.DATETIME_MED.time

let yesterday = now.minus({days:1}).toLocaleString(DateTime.newFormat)
let twoDaysAgo = now.minus({days:2}).toLocaleString(DateTime.newFormat)
let threeDaysAgo = now.minus({days:3}).toLocaleString(DateTime.newFormat)
let fourDaysAgo = now.minus({days:4}).toLocaleString(DateTime.newFormat)
let fiveDaysAgo = now.minus({days:5}).toLocaleString(DateTime.newFormat)
let sixDaysAgo = now.minus({days:6}).toLocaleString(DateTime.newFormat)
let sevenDaysAgo = now.minus({days:7}).toLocaleString(DateTime.newFormat)

let today = DateTime.now().toSeconds()
let jan = DateTime.local(2021, 1, 1).toSeconds()
let feb = DateTime.local(2021, 2, 1).toSeconds()
let mar = DateTime.local(2021, 3, 1).toSeconds()
let apr = DateTime.local(2021, 4, 1).toSeconds()
let may = DateTime.local(2021, 5, 1).toSeconds()
let jun = DateTime.local(2021, 6, 1).toSeconds()
let jul = DateTime.local(2021, 7, 1).toSeconds()
let aug = DateTime.local(2021, 8, 1).toSeconds()
let sep = DateTime.local(2021, 9, 1).toSeconds()
let oct = DateTime.local(2021, 10, 1).toSeconds()
let nov = DateTime.local(2021, 11, 1).toSeconds()
let dec = DateTime.local(2021, 12, 1).toSeconds()

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


  // Hamburger click handler 
  if(document.querySelector('.hamburger')){

  let hamburger = document.querySelector('.hamburger')
  hamburger.addEventListener('click', ()=>{
    if(screen.width<=769 ){
      hamburger.id = 'open'
      console.log('hf');
    }
    
  })

  document.addEventListener('click', (e)=>{
    if(!e.target.classList.contains('hamburger')){
      hamburger.removeAttribute('id')
    }
  })
}
  



// Welcome Page 
if(document.querySelector('.landing-ctnr')){

  // Demo Button 
    let demo = document.querySelector('.demo-btn')
    demo.addEventListener('click',()=>{
      axios({
        method: 'post',
        url:'/login',
        data: {
          username:'Demo',
          password: 'Demo'
        }
      })
      .then(()=>window.location.href = '/home')
    })

    document.querySelector('.text-ctnr').appendChild(demo)
}

// Render Dashboard 
if(document.querySelector('.recently-played-ctnr')){
  window.onload = 
  
  axios({
    method: 'post',
    url: '/user-games',
  })
  .then((response)=>{
    games = response.data.savedGames
    games.forEach(game=>{
      
      let buttonConatainer = document.createElement('div')
      let buttonBackground = document.createElement('div')
      let statusIcon = document.createElement('div')
      let removeGame = document.createElement('div')
      let gameWrapper = document.createElement('a')
      
      gameWrapper.id = game._id
      gameWrapper.classList.add('recent-game')
      gameWrapper.style.backgroundImage = `url(${game.cover})`

      buttonConatainer.classList.add('button-ctnr')
      buttonBackground.classList.add('button-background')

      statusIcon.classList.add('status-icon')

      removeGame.classList.add('remove-btn')

      // Determine completion Status
      if(game.isCompleted === true){
        statusIcon.style.backgroundImage = 'url(../img/complete.png)'
      }else{
        statusIcon.style.backgroundImage = 'url(../img/incomplete.png)'
      }

      statusIcon.addEventListener('click',(e)=>{
        axios({
          method:'post',
          url:'/update-status',
          data:{
            gameID:game._id
          }
        })
        .then(()=>window.location.reload() )
        .catch(err=>console.log(err))
      })


      removeGame.addEventListener('click',()=>{
        axios({
          method:'post',
          url:'/remove-game',
          data:{
            gameID:game._id
          }
        })
        .then(()=>document.getElementById(game._id).remove())
        .catch(err=>console.log(err))
      })
      buttonConatainer.appendChild(buttonBackground)
      buttonConatainer.appendChild(statusIcon)
      buttonConatainer.appendChild(removeGame)
      gameWrapper.appendChild(buttonConatainer)

      if(game.title != ''){
        document.querySelector('.recently-played-ctnr').appendChild(gameWrapper)
      }

     
  
     

    })
    
    return response
  })
  .then((response)=>{
  
    games.forEach((game,index)=>{
      let yesterdayTime = typeof(game.playTime.find(obj => obj.date === yesterday )) != 'undefined' ? game.playTime.find(obj => obj.date === yesterday ).time : 0
      let twoDaysTime = typeof(game.playTime.find(obj => obj.date === twoDaysAgo )) != 'undefined' ? game.playTime.find(obj => obj.date === twoDaysAgo ).time : 0
      let threeDaysTime = typeof(game.playTime.find(obj => obj.date === threeDaysAgo )) != 'undefined' ? game.playTime.find(obj => obj.date === threeDaysAgo ).time : 0
      let fourDaysTime = typeof(game.playTime.find(obj => obj.date === fourDaysAgo )) != 'undefined' ? game.playTime.find(obj => obj.date === fourDaysAgo ).time : 0
      let fiveDaysTime = typeof(game.playTime.find(obj => obj.date === fiveDaysAgo )) != 'undefined' ? game.playTime.find(obj => obj.date === fiveDaysAgo ).time : 0
      let sixDaysTime = typeof(game.playTime.find(obj => obj.date === sixDaysAgo )) != 'undefined' ? game.playTime.find(obj => obj.date === sixDaysAgo ).time : 0
      let sevenDaysTime = typeof(game.playTime.find(obj => obj.date === sevenDaysAgo )) != 'undefined' ? game.playTime.find(obj => obj.date === sevenDaysAgo ).time : 0
      
      recentHistory[index] = {
        name: game.title,
        data: [          
          yesterdayTime,
          twoDaysTime,
          threeDaysTime,
          fourDaysTime,
          fiveDaysTime,
          sixDaysTime,
          sevenDaysTime
        ]
      }
    })

    let generateGraph = () =>{

      Highcharts.chart('graph-ctnr', {
        chart: {
          type: 'bar'
        },
        title: {
          text: 'Recent History'
        },
        xAxis: {
          categories: pastWeek
        },
        yAxis: {
          min: 0,
          max:24,
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
        series:recentHistory
      });
      
    }

    generateGraph()

    // Friends  
    console.log(response.data);
    let friendsContainer = document.querySelector('.friends-played-ctnr')
    response.data.friends.forEach(friend=>{
      let friendDiv = document.createElement('div')
      let friendTextContainer = document.createElement('div')
      let friendName = document.createElement('h2')
      let recentGameTime = document.createElement('p')
      let recentGameTitle = document.createElement('p')
      let recentGameCover = document.createElement('div')


      // Find most recent game 
      let mostRecentGame = friend.savedGames.find(game=>game.playTime[0].time > 0 )
      console.log(mostRecentGame)

      friendDiv.classList.add('friend-ctnr')
      friendTextContainer.classList.add('friend-text-ctnr')
      recentGameCover.classList.add('cover')

      friendName.textContent = friend.username

      if(mostRecentGame.playTime[0].time > 1){
        recentGameTime.textContent = mostRecentGame.playTime[0].time + ' hrs'
      }else{
        recentGameTime.textContent = mostRecentGame.playTime[0].time + ' hr'
      }
      
      recentGameCover.style.backgroundImage = `url(${mostRecentGame.cover})`
      recentGameTitle.textContent = mostRecentGame.title

      friendDiv.appendChild(recentGameCover)
      friendTextContainer.appendChild(friendName)
      friendTextContainer.appendChild(recentGameTitle)
      friendTextContainer.appendChild(recentGameTime)
      friendDiv.appendChild(friendTextContainer)
      friendsContainer.appendChild(friendDiv)
    })

    
    return(yesterday, twoDaysAgo, threeDaysAgo, fourDaysAgo, fiveDaysAgo, sixDaysAgo, sevenDaysAgo, pastWeek)
  })

}

  // Discover Page 
let currentSlide = 0

let topgamesMonth = []

function kFormatter(num) {
  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}
if(document.querySelector('.slide-ctnr')){

  axios({
    method: 'post',
    url: '/discover',

  })
  .then(response=>{
    response.data.forEach((game,index)=>{
      topgamesMonth.push(game)
      let container = document.querySelector('.top-month-ctnr')
      let backgroundCover = document.createElement('div')
      let gameDiv = document.createElement('div')
      let infoBackground = document.createElement('div')
  
      let infoContainer = document.createElement('div') 
      let followsContainer = document.createElement('div') 
      let releaseContainer = document.createElement('div') 
      let ratingContainer = document.createElement('div')

      let follows = document.createElement('p')
      let release = document.createElement('p')
      let rating = document.createElement('p')

      let ratingText = document.createElement('p')
      let releaseText = document.createElement('p')
      let followsText = document.createElement('p')
      
      gameDiv.id = `game-${index}`
      gameDiv.classList.add('top-game')
      gameDiv.style.backgroundImage = `url(//images.igdb.com/igdb/image/upload/t_cover_big/${game.game.cover.image_id}.jpg)`

      infoBackground.classList.add('info-background')

      backgroundCover.classList.add('background-cover')
      backgroundCover.id = `game-${index}-background`
      backgroundCover.style.backgroundImage = `url(//images.igdb.com/igdb/image/upload/t_cover_big/${game.game.cover.image_id}.jpg)`
      
      releaseContainer.classList.add('game-info-ctnr')
      followsContainer.classList.add('game-info-ctnr')
      ratingContainer.classList.add('game-info-ctnr')
      
      release.classList.add('game-info')
      rating.classList.add('game-info')
      follows.classList.add('game-info')

      followsText.classList.add('info-text')
      ratingText.classList.add('info-text')
      releaseText.classList.add('info-text')

      release.classList.add('release')
      rating.classList.add('rating')
      follows.classList.add('follows')
      infoContainer.classList.add('info-ctnr')

      follows.textContent = `${game.game.follows}\r\n`
      rating.textContent = `${Math.floor(game.game.rating)}%\r\n`
      release.textContent = `${DateTime.fromSeconds(game.game.first_release_date).toLocaleString(DateTime.DATE_MED)}\r\n` 

      followsText.textContent = 'Follows'
      releaseText.textContent = 'Released'
      ratingText.textContent = 'Rating'

      if(index === 0) {
        gameDiv.classList.add('visible')
      }
      if(index === 0) {
        backgroundCover.classList.add('visible')
      }
      
      followsContainer.appendChild(follows)
      followsContainer.appendChild(followsText)
      releaseContainer.appendChild(release)
      releaseContainer.appendChild(releaseText)
      ratingContainer.appendChild(rating)
      ratingContainer.appendChild(ratingText)
      
      infoContainer.appendChild(followsContainer)
      infoContainer.appendChild(releaseContainer)
      infoContainer.appendChild(ratingContainer)

      container.appendChild(backgroundCover)
      gameDiv.appendChild(infoBackground)
      gameDiv.appendChild(infoContainer)
      container.appendChild(gameDiv)

      console.log(release.textContent);
  
    })
    console.log(topgamesMonth);
  })

  

  
  document.querySelector('#right-btn').addEventListener('click',()=>{
    if(currentSlide<topgamesMonth.length -1){
      let currentGame = document.querySelector(`#game-${currentSlide}`)
      let currentGameBackground = document.querySelector(`#game-${currentSlide}-background`)
  
      let nextGame = document.querySelector(`#game-${currentSlide + 1}`)
      let nextGameBackground = document.querySelector(`#game-${currentSlide + 1}-background`)
  
      currentGame.classList.remove('visible')
      currentGameBackground.classList.remove('visible')

      nextGame.classList.add('visible')
      nextGameBackground.classList.add('visible')
  
      currentSlide++
    }
  })
  document.querySelector('#left-btn').addEventListener('click',()=>{
    if(currentSlide!=0){
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
if(document.querySelector('.logout-btn')){
  document.querySelector('.logout-btn')
    .addEventListener('click',()=>{
      axios.get('/logout')
        .then(()=>window.location.href = '/')
    })

    
}


let saveGame = (game,yesterdayValue,twoDaysAgoValue,threeDaysAgoValue) =>{

  if(document.querySelector('#yesterday-input')){
    let yesterdayInput = document.querySelector('#yesterday-input')
    let twoDaysInput = document.querySelector('#two-days-input')
    let threeDaysInput = document.querySelector('#three-days-input')
  }
  axios({
    method:'post',
    url: '/save',
    data:{
      title:game.name,
      cover:`//images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`,
      url:game.url,
      category:game.genres[0].name,
      platforms: game.platforms,
      playTime: [
        { date: yesterday,
          time:yesterdayValue  ? parseInt(yesterdayValue) :0},
        { date: twoDaysAgo,
          time:twoDaysAgoValue  ? parseInt(twoDaysAgoValue) :0},
        { date: threeDaysAgo,
          time:threeDaysAgoValue  ? parseInt(threeDaysAgoValue) :0},
        {date: fourDaysAgo,
          time: 0
        },
        {date: fiveDaysAgo,
          time: 0
        },
        {date: sixDaysAgo,
          time: 0
        },
        {date: sevenDaysAgo,
          time: 0
        },
        
      ]
    }
  })
  .then(response=>{
      console.log(response.data);
  })
}

let renderTimeInput = (game)=>{

  let modalContainer = document.querySelector('.modal-ctnr')
  // Render play history form 
  let overlay = document.createElement('div')
  let formContainer = document.createElement('div')
  let yesterdayInput = document.createElement('input')
  let twoDaysInput = document.createElement('input')
  let threeDaysInput = document.createElement('input')
  let saveBtn = document.createElement('button')
  let heading = document.createElement('h5')

  saveBtn.textContent = 'Save'
  heading.textContent = 'How many hours did you play recently?'

  yesterdayInput.id = 'yesterday-input'
  twoDaysInput.id = 'two-days-input'
  threeDaysInput.id = 'three-days-input'
  saveBtn.id = 'save'

  yesterdayInput.placeholder = 'Yesterday'
  twoDaysInput.placeholder = 'Two Days Ago'
  threeDaysInput.placeholder = 'Three Days Ago'

  overlay.classList.add('overlay')
  formContainer.classList.add('form-container')
  

  saveBtn.addEventListener('click',()=>{
    saveGame(game,yesterdayInput.value,twoDaysInput.value,threeDaysInput.value)
    heading.textContent = `${game.name} was succesfully added!`
    modalContainer.style.justifyContent = 'center'
    yesterdayInput.remove()
    twoDaysInput.remove()
    threeDaysInput.remove()
    saveBtn.remove()

    setTimeout(() => {
      window.location.href = '/home'
    }, 2500);
  })

  modalContainer.textContent = ''
  modalContainer.style.flexDirection = 'column' 
  


  modalContainer.appendChild(heading)
  modalContainer.appendChild(yesterdayInput)
  modalContainer.appendChild(twoDaysInput)
  modalContainer.appendChild(threeDaysInput)
  modalContainer.appendChild(saveBtn)
}

let renderGameOverlay = (game) =>{
  let overlayBackground = document.createElement('div')
  let modalContainer = document.createElement('div')
  let textContainer = document.createElement('div')
  
  let cover = document.createElement('div')
  let title = document.createElement('h1')
  let release = document.createElement('h4')
  let genre = document.createElement('h4')
  let desc = document.createElement('p')

  let saveBtn = document.createElement('button')
  let closeBtn = document.createElement('button')


  overlayBackground.classList.add('overlay')
  overlayBackground.id = 'overlay'
  modalContainer.classList.add('modal-ctnr')
  textContainer.classList.add('modal-text-ctnr')
  cover.classList.add('cover-modal')
  genre.id = 'genre'
  saveBtn.id = 'save'
  closeBtn.id = 'close'

  cover.style.backgroundImage = `url(//images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg)`

  title.textContent = game.name
  release.textContent = `${DateTime.fromSeconds(game.first_release_date).toLocaleString(DateTime.DATE_MED)}`
  desc.textContent = game.summary
  genre.textContent = game.genres[0].name
  saveBtn.textContent = 'Save'


  // Detect click outside modal 
  document.addEventListener('click',(e)=>{
    if (e.target.id === 'overlay'){
      modalContainer.remove()
      overlayBackground.remove()
    }
  })

  saveBtn.addEventListener('click',()=>{
    renderTimeInput(game)
  })

  document.querySelector('main').appendChild(overlayBackground)
  document.querySelector('main').appendChild(modalContainer)
  modalContainer.appendChild(cover)
  modalContainer.appendChild(textContainer)
  modalContainer.appendChild(saveBtn)
  textContainer.appendChild(title)
  textContainer.appendChild(release)
  textContainer.appendChild(genre)
  textContainer.appendChild(desc)

}

let searchForGame = ()=>{
  let query = search.value
  let results;
  axios({
    method: 'post',
    url: '/search',
    data: {
      search: query,
    },
  })
  .then(response=>{
    results = response.data
    console.log(results);
  })
  .then(()=>{
    if(document.querySelector('#graph-ctnr')){
      document.querySelector('main').textContent = ''
  }else if(document.querySelector('.results-ctnr')){
    document.querySelector('.results-ctnr').remove()
  }

    let resultContainer = document.createElement('div')
    resultContainer .classList.add('results-ctnr')

    document.querySelector('main').appendChild(resultContainer)
    results.forEach((game)=>{
      let result = document.createElement('div')
      let gameTitle = document.createElement('h2')
      let button = document.createElement('button')

      result.classList.add('result')
      result.id = game.name
      if(game.cover){
        gameTitle.style.visibility = 'hidden'
        result.style.backgroundImage = `url(//images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg)`
        
      }else{
        result.style.backgroundImage = ''
      }

      button.classList.add('result-add-btn')
      button.textContent = 'Add'

      // button.addEventListener('click',()=>{
      //   renderTimeInput(game)
      // })

      result.addEventListener('click', ()=>{
        renderGameOverlay(game)
      })

      
      resultContainer.appendChild(result)
    })})}
// Search 
if(document.querySelector('.search-btn')){
let button = document.querySelector('.search-btn')
let search = document.querySelector('#search')

button.addEventListener('click',()=>{
    searchForGame()
  })
search.addEventListener('keydown',(e)=>{
    if (e.keyCode===13){
      searchForGame()
    }
  })


}


// Sign Up 
if(document.querySelector('.signup-ctnr')){

}
// Login 
if(document.querySelector('.login-ctnr')){
  

}



// Calendar Page 
let upcomingGames
let selectedMonth
if(document.querySelector('.calendar-ctnr')){
  document.querySelector('.calendar-ctnr').textContent = ''

  axios({
    method:'post',
    url:'/calendar',
  })
  .then(response=>{
    upcomingGames = response.data
    console.log(upcomingGames);
  })
  .then(()=>{
    let monthsArr = Info.months('short')
    let monthContainer = document.createElement('div')
    let monthHeaderContainer = document.createElement('div')
    

    monthHeaderContainer.classList.add('month-header-ctnr')


    // Change view to month 
    let renderMonth = (selectedMonth)=>{
      
      // clear page
      document.querySelector('.month-ctnr').textContent = ''

      let daysInMonth = DateTime.local(2021,(monthsArr.findIndex(month=>month === selectedMonth)) + 1).daysInMonth
      

      for (let i = 0; i <= daysInMonth+1; i++) {
        let dayContainer = document.createElement('div')
        let dateContainer = document.createElement('div')
        let gameContainer = document.createElement('div')
        let date = document.createElement('h6')
        let weekDay = document.createElement('h5')

        let monthIndex = monthsArr.findIndex(month=>month===selectedMonth)
  
        dayContainer.classList.add('day-ctnr')
        gameContainer.classList.add('game-ctnr')
        dateContainer.classList.add('date-ctnr')
  
        date.textContent = i
        weekDay.textContent = DateTime.local(2021,(monthIndex+1),i).weekdayShort
  
        if( i < 10){
          dayContainer.id = 'day0'+i
        }else{
          dayContainer.id = 'day'+i
        }
  
        dateContainer.appendChild(weekDay)
        dateContainer.appendChild(date)
        dayContainer.appendChild(dateContainer)
        dayContainer.appendChild(gameContainer)
        monthContainer.appendChild(dayContainer)   
      }
  
      // Filter Games for games in selected month 
      let gamesInMonth =  upcomingGames.filter(game=>game.human.includes(selectedMonth))

      if(gamesInMonth.length > 0){
        gamesInMonth.forEach(game=>{
          let gameContainer = document.createElement('a')
          let gameCover = document.createElement('div')
          let followBtn = document.createElement('button')
          let nameText = document.createElement('h4')
          let releaseText = document.createElement('p')
          let platform = document.createElement('p')
          gameContainer.id = game.game.name
          
          followBtn.textContent = 'Follow'
          nameText.textContent = game.game.name
          releaseText.textContent = game.human
  
          gameCover.classList.add('cover')
          gameCover.style.backgroundImage = `url(//images.igdb.com/igdb/image/upload/t_cover_big/${game.game.cover.image_id}.jpg)`
    
          let targetID = game.human.slice((selectedMonth.length + 1), (selectedMonth.length + 3))
  
          followBtn.addEventListener('click',(e)=>{
            // Follow Game 
            axios({
              method:'post',
              url: '/follow',
              data:{
                title:game.game.name,
                cover:`//images.igdb.com/igdb/image/upload/t_cover_big/${game.game.cover.image_id}.jpg`,
                category:game.game.genres[0].name,
                platforms: game.platforms,
                releaseDate: game.human
              }
            })
            .then(()=>{
                followBtn.textContent = 'Followed'
                e.target.style.backgroundColor = '#707070'
            })
          })
          let dayContainer = monthContainer.querySelector(`#day${targetID}`)
          
          gameContainer.appendChild(gameCover)
          gameContainer.appendChild(followBtn)
          dayContainer.querySelector('.game-ctnr').appendChild(gameContainer)
        })
  
        // Remove empty dates 
        let removeDate = (div) =>{
          if (div.childNodes.length === 0){
            div.parentNode.remove()
          }
        }
        document.querySelectorAll('.game-ctnr').forEach(container=>removeDate(container))

        
      }else{
        let messageText = document.createElement('h1')

        messageText.textContent = 'No releases have been announced yet...'

        monthContainer.textContent = ''
        monthContainer.style.display = 'flex'
        monthContainer.style.alignItems = 'center'
        monthContainer.appendChild(messageText)
      }

      
    }

    monthsArr.forEach(month=>{
      let h2 = document.createElement('h2')
      h2.id = month
      h2.textContent = month

      h2.addEventListener('click',(e)=>{
        if(!document.querySelector('.selected')){
          e.target.classList.add('selected')
          selectedMonth = e.target.id
          renderMonth(month)
        }else{
          document.querySelector('.selected').classList.remove('selected')
          e.target.classList.add('selected')
          selectedMonth = e.target.id
          renderMonth(month)
        }
      })

      monthHeaderContainer.appendChild(h2)
    })

    
    monthContainer.classList.add(`month-ctnr`)
    document.querySelector('.calendar-ctnr').appendChild(monthHeaderContainer)
    document.querySelector('.calendar-ctnr').appendChild(monthContainer)


  //  Default to current month 
    let thisMonth = DateTime.now().monthShort
    document.querySelector(`#${thisMonth}`).classList.add('selected')
    renderMonth(thisMonth)

  })
}