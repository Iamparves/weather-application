const condition = document.getElementById('condition')
const city = document.getElementById('city')
const country = document.getElementById('country')
const mainText = document.getElementById('main')
const description = document.getElementById('description')
const temp = document.getElementById('temp')
const pressure = document.getElementById('pressure')
const humidity = document.getElementById('humidity')
const showAlert = document.getElementById('alert');

const cityInput = document.getElementById('city-input')
const historyElm = document.getElementById('history')

const API_KEY = '436db348bc80e11103f1d635103ab1ac'
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}`
const ICON_URL = 'https://openweathermap.org/img/wn/'
const DEFAULT_CITY = 'Rajshahi, BD'

window.onload = function () {
    navigator.geolocation.getCurrentPosition(s => {
        getWeatherData(null, s.coords)
        gsapAnimation()
    }, e => {
        getWeatherData(DEFAULT_CITY)
        gsapAnimation()
    })


    cityInput.addEventListener('keypress', function (e) {
        if (e.keyCode === 13) {
            if (e.target.value) {
                getWeatherData(e.target.value)
                e.target.value = ''
            } else {
                showAlertMessage('Please Enter a Valid City Name')
            }
        }
    })
}

function getWeatherData(city, coords) {
    let url = BASE_URL
    city === null ?
        url = `${url}&lat=${coords.latitude}&lon=${coords.longitude}` :
        url = `${url}&q=${city}`
    axios.get(url)
        .then(({ data }) => {
            let weather = {
                icon: data.weather[0].icon,
                name: data.name,
                country: data.sys.country,
                main: data.weather[0].main,
                description: data.weather[0].description,
                temp: Math.floor((data.main.temp - 273) * 9 / 5 + 32),
                pressure: data.main.pressure,
                humidity: data.main.humidity
            }
            setWeather(weather)
        })
        .catch(error => {
            console.log(error.message)
            showAlertMessage('City Not Found')
        })
}

function setWeather(weather) {
    condition.src = `${ICON_URL}${weather.icon}@2x.png`
    city.innerHTML = weather.name
    country.innerHTML = weather.country
    mainText.innerHTML = weather.main
    description.innerHTML = weather.description
    temp.innerHTML = weather.temp
    pressure.innerHTML = weather.pressure
    humidity.innerHTML = weather.humidity
}

function showAlertMessage(message) {
    showAlert.innerHTML = message
    showAlert.style.top = '30px'
    showAlert.style.opacity = '1'

    setTimeout(() => {
        showAlert.style.top = '0'
        showAlert.style.opacity = '0'
    }, 1500)
}

function gsapAnimation() {
    const tl = gsap.timeline()
    tl
        .to('.box', { duration: .5, height: 0, stagger: .1 })
        .to('.overlay', { duration: 0, display: 'none' })
        .from('.left img', { duration: 1.3, y: '-150%', opacity: 0, scale: .9, ease: 'bounce' })
        .from('.left h3', { duration: .8, y: '200px', opacity: 0, ease: 'bounce' })
        .from('.left p', { duration: .8, y: '200px', opacity: 0, ease: 'bounce' })
        .from('.right', { duration: 1, x: '100%', ease: 'power2.out' })
        .from('#condition', { duration: 1, y: '-100%', opacity: 0, rotate: 360, ease: 'bounce' }, '<.5')
        .from('.city', { duration: .5, x: '100px', y: '50px', opacity: 0 })
        .from('.weather-condition', { duration: .5, x: '-100px', y: '50px', opacity: 0 })
        .from('.temp', { duration: .5, x: '-100px', y: '50px', opacity: 0 })
        .from('.pressure', { duration: .5, y: '50px', opacity: 0 }, '<0')
        .from('.humidity', { duration: .5, x: '100px', y: '50px', opacity: 0 }, '<0')
        .from('#city-input', { duration: 1, scale: 0, ease: 'bounce' })
        .from('.weather .text', { duration: .5, y: '50px', opacity: 0 })
}
