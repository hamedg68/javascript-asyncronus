const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function (msg) {
    countriesContainer.insertAdjacentText('beforeend', msg)
    countriesContainer.style.opacity = 1
}

const renderCountry = function (data, className = '') {
    const html = `
         <article class="country ${className}">
          <img class="country__img" src="${data.flag}" alt=""/>
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
         </article>`;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
}

// const getCountry = function (country) {
//     const request = new XMLHttpRequest()
//     request.open('GET', `https://restcountries.com/v2/name/${country}`)
//     request.send()
//
//     //کد نامتقارن
//     request.addEventListener('load', function () {
//         const [data] = JSON.parse(this.responseText)
//         renderCountry(data)
//
//         const [neighbour] = data.borders
//         if (!neighbour) return
//
//         const request2 = new XMLHttpRequest()
//         request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`)
//         request2.send()
//
//         //کد نامتقارن
//         request2.addEventListener('load', function () {
//             const data = JSON.parse(this.responseText)
//             renderCountry(data,'neighbour')
//         })
//     })
// }
//
// getCountry('iran')

//session 11
//حالت اولیه
// const getCountryData = function (country) {
//     fetch(`https://restcountries.com/v2/name/${country}`)
//         .then(function (response) {
//             //خود تابع ()json یک تابع نامتقارن است و پرامیس برمیگرداند
//             return response.json()
//         })
//         .then(function (data) {
//             renderCountry(data[0])
//         })
// }
//حالت ساده تر
// const getCountryData = function (country) {
//     fetch(`https://restcountries.com/v2/name/${country}`)
//         .then((response) => {
//             return response.json()
//         })
//         .then((data) => {
//             renderCountry(data[0])
//         })
// }

//حالت خیلی ساده تر
const getCountryData = function (country) {
    fetch(`https://restcountries.com/v2/name/${country}`)
        //خود تابع ()json یک تابع نامتقارن است و پرامیس برمیگرداند
        //وقتی کد در یک خط نوشته میشود نیازی به {} نیست و حتی return
        .then(response => {
            return response.json()
        })
        // .then(response => response.json())
        .then(data => renderCountry(data[0]))
}

// getCountryData('italy')

//session 12
const getCountryData2 = function (country) {
    fetch(`https://restcountries.com/v2/name/${country}`)
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.status === 404) {
                //افزودن ارور به صورت دستی. وقتی این خط کد اجرا شود خط های بعدی دیگر اجرا نیشوند
                throw new Error(`country not found (${data.status})`)
            }
            renderCountry(data[0])
            const neighbour = data[0].borders[0]
            if (!neighbour) return
            return fetch(`https://restcountries.com/v2/alpha/${neighbour}`)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 404) {
                //افزودن ارور به صورت دستی. وقتی این خط کد اجرا شود خط های بعدی دیگر اجرا نیشوند
                throw new Error(`country not found (${data.status})`)
            }
            renderCountry(data, 'neighbour')
        })
        //تمامی اروررهای زنجیره پرامیس ها اینجا می آید. به جای اینکه در هر then بخواهیم این کار انجام دهیم بهتر است از این روش استفاده کنیم
        .catch(err => {
            console.error(`${err}`)
            renderError(`something went wrong ${err.message}. Try again!`)
        })
        //همواره اتفاق می افتد چه fullFilled چه rejected ... مثلا برای حذف loading کاربرد دارد
        .finally(() => {

        })
}

//session 13
btn.addEventListener('click', function () {
    // getCountryData2('iran')
})


//session 16

// function getJSON (url) {
// const getJSON = function (url) {
const getJSON = (url) => {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 400)
                throw new Error(`request is wrong (${data.status})`)
            if (data.status === 404)
                throw new Error(`country not found (${data.status})`)
            return data
        })
}

const getCountryData3 = function (country) {

    getJSON(`https://restcountries.com/v2/name/${country}`)
        .then(data => {
            renderCountry(data[0])
            if (!data[0].borders) throw new Error(`no neighbour found`)
            const neighbour = data[0].borders[0]
            return getJSON(`https://restcountries.com/v2/alpha/${neighbour}`)
        })
        .then(data => renderCountry(data, 'neighbour'))
        .catch(err => {
            console.error(`${err}`)
            renderError(`something went wrong ${err.message}. Try again!`)
        })
        .finally(() => {

        })
}

btn.addEventListener('click', function () {
    getCountryData3('jordan')
})


//session 18

const whereAmI = function (lat, lng) {
    fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
        .then(response => {
            if (!response.ok)
                throw new Error(`problem with geocoding ${response.status}`)
            return response.json()
        })
        .then(data => {
            console.log(data)
            console.log(`your are in ${data.city} , ${data.country}`)
            return getJSON(`https://restcountries.com/v2/name/${data.country}`)
        })
        .then(data => {
            renderCountry(data[0])
            if (!data[0].borders) throw new Error(`no neighbour found`)
            const neighbour = data[0].borders[0]
            return getJSON(`https://restcountries.com/v2/alpha/${neighbour}`)
        })
        .then(data => renderCountry(data, 'neighbour'))
        .catch(error => console.log(`${error.message}`))
}
// whereAmI(-33.933, 18.474)


//session 21
console.log('Test start') //top level code
setTimeout(() => console.log('0 sec timer'), 0) //in call back queue
Promise.resolve('resolved promise 1').then(res => console.log(res)) //in micro task queue

console.log('Test end') //top level code

//ترتبی اجرای کد
// 'Test start'
// 'Test end'
// 'resolved promise 1'
// '0 sec timer'

//باعث میشود که timeout دیرتر اجرا شود
// Promise.resolve('resolved promise 2').then(res => {
//     for (let i=0;i<10000000000;i++){}
//     console.log(res)
// }) //in micro task queue

//session 22
//ساخت یک پرامیس ساده
// new Promise(function (resolve, reject)  {
// })

//کد این جلسه نامتقارن نیست
const lotteryPromise = new Promise((resolve, reject) => {
    if (Math.random() >= 0.5) {
        resolve('you win🤑💰💵')
    } else {
        reject('you lost your money💀')
    }
})

lotteryPromise
    .then(res => console.log('lotteryPromise', res))
    .catch(err => console.error('lotteryPromise', err))

//session 23
const lotteryPromise2 = new Promise((resolve, reject) => {

    console.log('session23', 'lottery draw is happening 🌟')

    setTimeout(function () {
        if (Math.random() >= 0.5) {
            resolve('you win🤑💰💵')
        } else {
            reject(new Error('you lost your money💀'))
        }
    }, 2000)
})

lotteryPromise2
    .then(res => console.log('session23', res))
    .catch(err => console.error('session23', err))


//مفهوم promisify به این معنی است که رفتار مبتنی بر callBack نامتقارن رو تبدیل به رفتار مبتنی بر promise کنیم

//promisifing setTimeOut method
const wait = function (second) {
    return new Promise(resolve => {
        setTimeout(resolve, second * 1000)
    })
}

wait(1)
    .then(() => {
        console.log('session23', 'time passed 1 second')
        return wait(1)
    })
    .then(() => {
        console.log('session23', 'time passed 2 seconds')
        return wait(1)
    })
    .then(() => {
        console.log('session23', 'time passed 3 seconds')
        return wait(1)
    })
    .then(() => {
        console.log('session23', 'time passed 4 seconds')
        return wait(1)
    })

//////////////////////////////
Promise.resolve('resolve***').then(res => console.log('session23', res))
Promise.reject(new Error('reject***')).then(err => console.log('session23', err))

//session 24
//پرامیسیفای کردن تابع geolocation
const getMyLocation = function () {
    return new Promise(function (resolve, reject) {
        // navigator.geolocation.getCurrentPosition(position => resolve(position), err => reject(err))
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

//اینو خودم نوشتم
// getMyLocation()
//     .then(location => {
//         const {latitude: lat, longitude: lng} = location.coords
//         whereAmI(lat,lng)
//     })
// .catch(err => console.log('uuu',err))

const whereAmI2 = function () {
    getMyLocation()
        .then(location => {
            const {latitude: lat, longitude: lng} = location.coords
            return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
        })
        .then(response => {
            if (!response.ok)
                throw new Error(`problem with geocoding ${response.status}`)
            return response.json()
        })
        .then(data => {
            console.log(data)
            console.log(`your are in ${data.city} , ${data.country}`)
            return getJSON(`https://restcountries.com/v2/name/${data.country}`)
        })
        .then(data => {
            renderCountry(data[0])
            if (!data[0].borders) throw new Error(`no neighbour found`)
            const neighbour = data[0].borders[0]
            return getJSON(`https://restcountries.com/v2/alpha/${neighbour}`)
        })
        .then(data => renderCountry(data, 'neighbour'))
        .catch(error => console.error(`${error.message}`))
}

// whereAmI2()

//session 26

const imgContainer = document.querySelector('.images')

const createImage = function (imagePath) {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.src = imagePath

        img.addEventListener('load', () => {
            imgContainer.append(img)
            resolve(img)
        })

        img.addEventListener('error', function () {
            reject(new Error('image not found!!!💀💀💀'))
        })
    })
}

// let currentImage
// createImage('src/assets/images/img-1.jpg')
//     .then(img => {
//         console.log('createImage', 'image 1 is loaded👍👍👍')
//         currentImage = img
//         return wait(2)
//     })
//     .then(() => {
//         currentImage.style.display = 'none'
//         return createImage('src/assets/images/img-2.jpg')
//     })
//     .then(img => {
//         console.log('createImage', 'image 2 is loaded👍👍👍')
//         currentImage = img
//         return wait(2)
//     })
//     .then(() => {
//         currentImage.style.display = 'none'
//     })
//     .catch(error => {
//         console.error('createImage', error.message)
//     })

//session 27

const whereIsMyLocation = async function () {

    const location = await getMyLocation()
    const {latitude: lat, longitude: lng} = location.coords
    const geoData = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    const geoPlace = await geoData.json()
    //این دو خط یکی هستند
    // fetch(`https://restcountries.com/v2/name/${country}`).then(res => console.log('session27',res))
    const res = await fetch(`https://restcountries.com/v2/name/${geoPlace.country}`)
    const data = await res.json()
    console.log('session27', data)
    renderCountry(data[0])
    if (data[0].borders) {
        const neighbour = data[0].borders[0]
        const neighbourRes = await fetch(`https://restcountries.com/v2/alpha/${neighbour}`)
        const neighbourData = await neighbourRes.json()
        renderCountry(neighbourData, 'neighbour')
    }
}

//چون نامتقران است اول کونسول نمایش داده میشود
// whereIsMyLocation()
// console.log('session27', 'first message')

//session 28

console.log('session28', 'start')

const whereIsMyLocation2 = async function () {
    try {
        const location = await getMyLocation()
        const {latitude: lat, longitude: lng} = location.coords
        const geoData = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
        if (!geoData.ok)
            throw new Error(`problem with geocoding ${geoData.status}`)
        const geoPlace = await geoData.json()
        // const geoPlace = 'asdasfgr'
        //این دو خط یکی هستند
        // fetch(`https://restcountries.com/v2/name/${country}`).then(res => console.log('session27',res))
        const res = await fetch(`https://restcountries.com/v2/name/${geoPlace.country}`)
        const data = await res.json()
        if (data.status === 400)
            throw new Error(`request is wrong1 (${data.status})`)
        if (data.status === 404)
            throw new Error(`country not found1 (${data.status})`)
        console.log('session28', data)
        renderCountry(data[0])
        if (data[0].borders) {
            // const neighbour = data[0].borders[0]
            const neighbour = 'GJUasdasd'
            const neighbourRes = await fetch(`https://restcountries.com/v2/alpha/${neighbour}`)
            const neighbourData = await neighbourRes.json()
            if (neighbourData.status === 400)
                throw new Error(`request is wrong2 (${neighbourData.status})`)
            if (neighbourData.status === 404)
                throw new Error(`country not found2 (${neighbourData.status})`)
            renderCountry(neighbourData, 'neighbour')
        }
    } catch (error) {
        renderError(error.message)
    }
}
console.log('session28', 'end')
// whereIsMyLocation2()


//session 29

const whereIsMyLocation3 = async function () {
    try {
        const location = await getMyLocation()
        const {latitude: lat, longitude: lng} = location.coords
        const geoData = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
        if (!geoData.ok)
            throw new Error(`problem with geocoding ${geoData.status}`)
        const geoPlace = await geoData.json()
        //این دو خط یکی هستند
        // fetch(`https://restcountries.com/v2/name/${country}`).then(res => console.log('session29',res))
        const res = await fetch(`https://restcountries.com/v2/name/${geoPlace.country}`)
        const data = await res.json()
        if (data.status === 400)
            throw new Error(`request is wrong1 (${data.status})`)
        if (data.status === 404)
            throw new Error(`country not found1 (${data.status})`)
        renderCountry(data[0])
        if (data[0].borders) {
            const neighbour = data[0].borders[0]
            // const neighbour = 'GJU'
            const neighbourRes = await fetch(`https://restcountries.com/v2/alpha/${neighbour}`)
            const neighbourData = await neighbourRes.json()
            if (neighbourData.status === 400)
                throw new Error(`request is wrong2 (${neighbourData.status})`)
            if (neighbourData.status === 404)
                throw new Error(`country not found2 (${neighbourData.status})`)
            renderCountry(neighbourData, 'neighbour')
        }

        return `you are in ${geoPlace.city} ${geoPlace.country}`

    } catch (error) {
        renderError(error.message)

        //reject promise returned from async function
        throw error
    }
}


console.log('session29', 'start getting location');

//به صورت pending نمایش داده میشود که به درد نمیخورد
// const city = whereIsMyLocation3()
// console.log('session29',city)

//تابع async همواره یک پرامیس برمیگرداند
// whereIsMyLocation3()
//     .then(res => console.log('session29', res))
//     .catch(err => console.log('session29', '2', err.message))
//     .finally(() => console.log('session29', '2finish getting location'))

//بهتره به صورت async await استفاده کنیم
//از IIFE استفاده میکنیم

(async function () {
    try {
        const city = await whereIsMyLocation3();
        console.log('session29', `2: ${city}`);
    } catch (err) {
        console.error('session29', `2 : ${err.message}💀`);
    }
    console.log('session29', '3: Finish getting location');
})()


//session 30
//اجرای پارمیس ها به صورت موازی(در یک زمان) با Promise.all
const getThreeCountries = async function (c1, c2, c3) {

    try {
        // const [data1] = await getJSON(`https://restcountries.com/v2/name/${c1}`)
        // const [data2] = await getJSON(`https://restcountries.com/v2/name/${c2}`)
        // const [data3] = await getJSON(`https://restcountries.com/v2/name/${c3}`)
        //
        // console.log('session30', [data1.capital, data2.capital, data3.capital])


        const data = await Promise.all([
            getJSON(`https://restcountries.com/v2/name/${c1}`),
            getJSON(`https://restcountries.com/v2/name/${c2}`),
            getJSON(`https://restcountries.com/v2/name/${c3}`)
        ])

        console.log('session30', data.map(data => data[0].capital))
    } catch (error) {
        console.log(error)
    }
}
//هر وقت شرایطی بود که در یک زمان واحد چندین عملیات نامتقارن انجام بدیم و این عملیت به هم وابسته نیست باید آنها را به صورت موازی انجام بدیم
//در promise.all اگر یکی از promiseها reject شود کل همه reject میکند

getThreeCountries('canada', 'japan', 'denmark');

//session 31
//انواع دیگر promiseها

//promise.race
//در این نوع پرامیس اولین پرامیسی که settled میشود وارد خروجی میشود مهم نیست که resolve میشود یا reject

(async function () {
    const data = await Promise.race([
        getJSON(`https://restcountries.com/v2/name/italy`),
        getJSON(`https://restcountries.com/v2/name/mexico`),
        getJSON(`https://restcountries.com/v2/name/greece`)
    ])

    console.log('session31', data[0]);
})()

const timeout = function (sec) {
    return new Promise((_, reject) => {
        setTimeout(function () {
            reject(new Error('Request took too long!!!'))
        }, sec * 1000)
    })
}

Promise.race([
    getJSON(`https://restcountries.com/v2/name/france`),
    timeout(0.2)])
    .then(res => console.log('session31', res[0]))
    .catch(err => console.log('session31', err))

//promise.allSettled
//تمام نتایج رو برای تمام پرامیس ها در قالب یک آرایه برمیگرداند بدون در نظر گرفتن resolve یا reject
//شباهت به all

Promise.allSettled([
    Promise.resolve('it is done!!!'),
    Promise.reject('test error'),
    Promise.resolve('it is done2 !!!')
])
    .then(res => console.log('session31', res))

Promise.all([
    Promise.resolve('it is done!!!'),
    Promise.reject('test error'),
    Promise.resolve('it is done2 !!!')
])
    .then(res => console.log('session31', res))
    .catch(err => console.log('session31', err))


//promise.any
//اولین پرامیس fullFilled رو برمیگرداند. rejectها رو در نظر نمیگیرد(شباهت به race)
Promise.any([
    Promise.reject('test error'),
    Promise.resolve('it is done2 (any)!!!'),
    Promise.resolve('it is done (any)!!!'),
    Promise.reject('test error'),
])
    .then(res => console.log('session31', res))
    .catch(err => console.log('session31', err))

//session33
//همان کدهای جلسه ۲۶ هست ولی به صورت async await
//قسمت اول تمرین
const loadNPause = async function () {
    try {
        let img = await createImage('src/assets/images/img-1.jpg')
        console.log('createImage', 'image 1 is loaded👍👍👍')
        await wait(2)
        img.style.display = 'none'

        img = await createImage('src/assets/images/img-2.jpg')
        console.log('createImage', 'image 2 is loaded👍👍👍')
        await wait(2)
        img.style.display = 'none'
    } catch (err) {
        console.error(err)
    }
}

// loadNPause()


//قسمت دوم تمرین
const loadAll = async function (images) {
    try {
        const imgs = images.map(async img => await createImage(img))
        console.log('session33', imgs)

        const imgesEl = await Promise.all(imgs)
        console.log('session33', imgesEl)
        imgesEl.forEach(img => img.classList.add('parallel'))
    } catch (err) {
        console.error(err)
    }
}

loadAll(['src/assets/images/img-1.jpg', 'src/assets/images/img-2.jpg', 'src/assets/images/img-3.jpg'])


//تجربه خودم
//اگر در then اولی return نباشد then دومی هم همزمان با اولی اجرا میشود
const afterTwoSeconds = function () {
    return new Promise(function (resolve) {
        setTimeout(() => {
            resolve()
        }, 2000)
    })
}

const afterThreeSeconds = function () {
    return new Promise(function (resolve) {
        setTimeout(() => {
            resolve()
        }, 3000)
    })
}

const confirm = false

afterTwoSeconds()
    .then(() => {
        console.log('Htest', 'first then')
        if (confirm) {
            return afterThreeSeconds()
        }
    })
    .then(() => {
        console.log('Htest', 'second then')
    })

