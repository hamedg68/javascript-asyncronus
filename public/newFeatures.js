const newFeatures = 'newFeatures'
//session 6
// کلمه this در eventListener به request اشاره میکند
// request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText)
// })

//متغیر b با داشتن [] عضو اول آرایه a را برمیگرداند
const a = [4, 7, 1]
const [b] = a
console.log(newFeatures, b)

//session 7
//علامت + متغییر را به عدد تبدیل میکند
//متد toFixed تا بسته به عدد داخلش تا آن رقم اعشار را حساب میکند
const population = '12450000'
const roundedPopulation = (+population / 1000000).toFixed(1)
console.log(newFeatures, roundedPopulation)

// متد insertAdjacentHTML کد جاوااسکرپیتی به فرمت html را داخل کد html قرار میدهد
// countriesContainer.insertAdjacentHTML('beforeend', html);

//session 9
// const renderCountry = function (data,className = '') {


//اگر if برقرار بود کدهای بعد از if نیز اجرا میشود
//...
//         const [neighbour] = data.borders
//         if (!neighbour) return
//...

//session 24
//const {latitude: lat, longitude: lng} = location.coords

//session 26
//html ساخت المان
//const img = document.createElement('img')
//الحاق المان html به یک کلاس
//imgContainer.append(img)

//session 29
//IIFE function

//     (async function () {
//
//     })()


//session 30
// console.log('session30',data.map(data => data[0].capital))

//session 31
//اگر نخواستیم از resolve استفاده کنیم
//return new Promise((_, reject) => {

//دی استراکچر کردن خودم نوشتم ربطی به دوره نداره شبیه const {latitude: lat, longitude: lng} = location.coords داخل دوره
const user = {
    id: 42,
    isVerified: 'pending',
    age: 23
};

const {id, isVerified: verifyStatus} = user;

console.log(newFeatures, id);
console.log(newFeatures, verifyStatus);

const {age} = user
console.log(newFeatures, `the age is : ${age}`)

const myMethod = () => {
// function myMethod(){
    const first = 5
    let second = 8

    return {first, second}
}

const {first, second} = myMethod()

console.log(newFeatures, first)
console.log(newFeatures, second)
