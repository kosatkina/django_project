console.log('hello')


const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')

const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const url = window.location.href
const alertBox = document.getElementById('alert-box')

const dropzone= document.getElementById('my-dropzone')
const addBtn = document.getElementById('add-btn')
const closeBtns = [...document.getElementsByClassName('add-modal-close')]

const getCoockie = (name) => {
    let coockieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for ( let i = 0; i < cookies.length; i++ ) {
            const cookie = cookies[i].trim();
            // Does this coockie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                coockieValue = decodeURIComponent(cookie.substring(name.length +1));
                break;
            }
        }
    }
    return coockieValue;
}
const csrftoken = getCoockie('csrftoken');

// Display notification that post has been deleted
const deleted = localStorage.getItem('title')
if (deleted) {
    handleAlerts('danger', `Deleted "${deleted}"`)
    localStorage.clear()
}

const likeUnlikePosts = () => {
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')];
    likeUnlikeForms.forEach(form=> form.addEventListener('submit', e=> {
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')
        const cleckedBtn = document.getElementById(`like-unlike-${clickedId}`)

        $.ajax({
            type: 'POST',
            url: "/like-unlike/",
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedId,
            },
            success: function(response) {
                console.log(response)
                cleckedBtn.textContent = response.liked ? `Unlike (${response.count})`: `Like (${response.count})`
            },
            error: function(error) {
                console.log(error)
            }
        })
    }))
}

let visible = 3

// Wrap ajax call in a function to be called on button click
const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/data/${visible}`,
        success: function(response) {
            console.log('success:', response)
            const data = response.data
            setTimeout(()=>{
                spinnerBox.classList.add('not-visible')
                console.log(data)
                data.forEach(el => {
                    postsBox.innerHTML += `
                        <div class="card mb-2">
                            <div class="card-body">
                                <h5 class="card-title">${el.title}</h5>
                                <p class="card-text">${el.body}</p>
                            </div>
                            <div class="card-footer">
                                <div class="row">
                                    <div class="col-2">
                                        <a href="${url}${el.id}" class="btn btn-primary">Details</a>
                                    </div>
                                    <div class="col-2">
                                        <form class="like-unlike-forms" data-form-id="${el.id}">
                                            <button href="#" class="btn btn-primary" id="like-unlike-${el.id}">${el.liked ? `Unlike (${el.count})`: `Like (${el.count})`}</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                });
                likeUnlikePosts()
            }, 100)
            console.log(response.size)
            // If there are no posts yet
            if (response.size === 0) {
                endBox.textContent = 'No posts added yet...'
            } else if (response.size <= visible) {
                loadBtn.classList.add('not-visible')
                endBox.textContent = 'No more posts to load...'
            }
        },
        error: function(error) {
            console.log('error:', error)
        }
    })
}

// Function to load 3 more posts on button click
loadBtn.addEventListener('click', ()=> {
    spinnerBox.classList.remove('not-visible')
    visible += 3
    getData()
})

// Event listener for the post form
postForm.addEventListener('submit', e => {
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': title.value,
            'body': body.value
        },
        success: function(response) {
            console.log(response)
            // Update post box when a post is added
            postsBox.insertAdjacentHTML('afterbegin', `
                    <div class="card mb-2">
                        <div class="card-body">
                            <h5 class="card-title">${response.title}</h5>
                            <p class="card-text">${response.body}</p>
                        </div>
                        <div class="card-footer">
                            <div class="row">
                                <div class="col-2">
                                    <a href="#" class="btn btn-primary">Details</a>
                                </div>
                                <div class="col-2">
                                    <form class="like-unlike-forms" data-form-id="${response.id}">
                                        <button href="#" class="btn btn-primary" id="like-unlike-${response.id}">Like (0)</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                `)
                likeUnlikePosts()
                // Hide modal authomatically and notify that new post was created
                // $('#addPostModal').modal('hide')
                handleAlerts('success', 'New post added!')
                // postForm.reset()
        },
        error: function(error) {
            console.log(error)
            handleAlerts('danger', 'Oops... something went wrong')
        }
    })
})


addBtn.addEventListener('click', () => {
    dropzone.classList.remove('not-visible')
})

closeBtns.forEach(btn => btn.addEventListener('click', () => {
    postForm.reset()
    if(!dropzone.classList.contains('not-visible')) {
        dropzone.classList.add('not-visible')
    }
}))

// Initially call function to display first 3 posts
getData()
