const getBtn = document.getElementById('get-btn')
const postBtn = document.getElementById('post-btn')


const getData = () => {
    // axios.get('https://reqres.in/api/users')
    //     .then(res => {
    //         console.log(res)
    //     })


    axios.all([
        axios.get('https://reqres.in/api/users'),
        axios.get('https://reqres.in/api/users')
    ])
        .then(axios.spread((user1, user2) => {
            console.log('user1', user1.data.data[1].email)
            console.log('user2', user2.data.data[2].email)
        }))
}

const sendData = () => {
    axios.post('https://reqres.in/api/register', {
        "email": "eve.holt@reqres.in",
        // "password": "pistol"
    }).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err, err.response)
    })
}


getBtn.addEventListener('click', () => {
    getData()
})

postBtn.addEventListener('click', () => {
    sendData()
})

$('#jquery-btn').click(function () {
    $.getJSON('https://reqres.in/api/users')
        .done(res => {
            console.log(res)
        })
        .fail(err => {
            console.log(err)
        })
})