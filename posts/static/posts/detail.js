const postBox = document.getElementById('post-box')
const alertBox = document.getElementById('alert-box')
const backBtn = document.getElementById('back-btn')
const updateBtn = document.getElementById('update-btn')
const deleteBtn = document.getElementById('delete-btn')

const url = window.location.href + "data/"
const updateUrl = window.location.href + "update/"
const deleteUrl = window.location.href + "delete/"

const updateForm = document.getElementById('update-form')
const deleteForm = document.getElementById('delete-form')

const spinnerBox = document.getElementById('spinner-box')

const titleInput = document.getElementById('id_title')
const bodyInput = document.getElementById('id_body')

const csrf = document.getElementsByName('csrfmiddlewaretoken')

// backBtn.addEventListener('click', () => {
//     history.back()
// })

$.ajax({
    type: 'GET',
    url: url,
    success: function(response) {
        console.log(response)

        const data = response.data
        if (data.logged_in !== data.author) {
            console.log('different')
        } else {
            console.log('the same')
            updateBtn.classList.remove('not-visible')
            deleteBtn.classList.remove('not-visible')
        }

        // Add elements for the post data
        const titleEl = document.createElement('h3')
        titleEl.setAttribute('class', 'mt-3')
        titleEl.setAttribute('id', 'title')

        const bodyEl = document.createElement('p')
        bodyEl.setAttribute('class', 'mt-1')
        bodyEl.setAttribute('id', 'body')

        // Restoring post data
        titleEl.textContent = data.title
        bodyEl.textContent = data.body

        postBox.appendChild(titleEl)
        postBox.appendChild(bodyEl)

        // Display author
        const authorEl = document.createElement('p')
        authorEl.setAttribute('class', 'mt-3')
        authorEl.textContent = `Author: ${data.author}`
        postBox.appendChild(authorEl)

        // Display who liked the post
        const likesEl = document.createElement('p')
        likesEl.setAttribute('class', 'text-muted')

        const likes = data.liked_by
        const totalLikes = likes.length
        if(totalLikes === 0) {
            likesEl.textContent = 'No likes yet'
        } else if(totalLikes === 1) {
            likesEl.textContent = `Liked by: ${likes[0]}`
        } else if(totalLikes === 2) {
            likesEl.textContent = `Liked by: ${likes[0]} and ${likes[1]}`
        } else {
            likesEl.textContent = `Liked by: ${likes[0]}, ${likes[1]} and ${totalLikes - 2} others`
        }
        postBox.appendChild(likesEl)

        // Put post data in the update modal
        titleInput.value = data.title
        bodyInput.value = data.body

        spinnerBox.classList.add('not-visible')
    },
    error: function(error) {
        console.log(error)
    }
})

// event listener on update form
updateForm.addEventListener('submit', e => {
    e.preventDefault()

    const title = document.getElementById('title')
    const body = document.getElementById('body')

    $.ajax({
        type: 'POST',
        url: updateUrl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title': titleInput.value,
            'body': bodyInput.value,
        },
        success: function(response) {
            console.log(response)
            handleAlerts('success', 'Post has been updated')
            title.textContent = response.title
            body.textContent = response.body
        },
        error: function(error) {
            console.log(error)
        }
    })
})

// event listener on delete form
deleteForm.addEventListener('submit', e => {
    e.preventDefault()

    const title = document.getElementById('title')
    const body = document.getElementById('body')

    $.ajax({
        type: 'POST',
        url: deleteUrl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
        },
        success: function(response) {
            window.location.href = window.location.origin
            localStorage.setItem('title', titleInput.value)
        },
        error: function(error) {
            console.log(error)
        }
    })
})
