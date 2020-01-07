const deleteBTN = document.querySelector('.delete');

deleteBTN.addEventListener('click', (e) => {

    // getting the id here
    let id = e.target.getAttribute('data-id');

    fetch(`/articles/${id}`, {
            method: 'DELETE',
        }).then(res => {
            console.log('Deleted!');
            window.location.href = '/';
        })
        .catch(err => console.log(err));
})