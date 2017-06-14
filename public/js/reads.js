$(document).ready(() => {
  Materialize.updateTextFields();
  $('.button-collapse').sideNav();
  $('.modal').modal();
  $('select').material_select();

  const bookList = new List('books', bookOptions);
  const authorList = new List('authors', authOptions);

  const bookOptions = {
    valueNames: ['booktitle', 'bookgenre'],
  };
  const authOptions = {
    valueNames: ['authorname'],
  };

  function putForm(e, route) {
    e.preventDefault();
    const formData = $(e.target).serialize();
    $.ajax({
      url: e.target.getAttribute('action'),
      type: 'PUT',
      data: formData,
      contentType: 'application/x-www-form-urlencoded',
      processData: false,
      success(result) {
        console.log(result);
        window.location.replace(`/${route}`);
      },
    });
  }

  function postForm(e, route) {
    e.preventDefault();
    const formData = $(e.target).serialize();
    const url = e.target.getAttribute('action');
    console.log(formData);
    $.ajax({
      url,
      type: 'POST',
      data: formData,
      contentType: 'application/x-www-form-urlencoded',
      processData: false,
      success(result) {
        console.log(result);
        window.location.replace(`/${route}`);
      },
    });
  }

  function deleteItem(e, route) {
    const url = e.target.getAttribute('action');
    const root = url.split('/')[1];
    e.preventDefault();
    $.ajax({
      url: e.target.getAttribute('action'),
      type: 'DELETE',
      success(result) {
        console.log(result);
        Materialize.toast('Successfully deleted!', 3000, 'rounded');
        setTimeout(window.location.replace(`/${route}`), 4000);
      },
    });
  }

  function bookSearch(e) {
    e.preventDefault();
    const url = e.target.getAttribute('action');
    const param = $(e.target).serialize().split('=');
    console.log(param);
    const urlParams = url.concat(`/${param[1]}`);
    console.log(urlParams);

    $.ajax({
      url: urlParams,
      type: 'GET',
      success(result) {
        console.log('success!');
      },
    });
  }

  $('.put_book').submit((e) => { putForm(e, 'books'); });
  $('.put_author').submit((e) => { putForm(e, 'authors'); });
  $('.post_book').submit((e) => { postForm(e, 'books'); });
  $('.post_author').submit((e) => { postForm(e, 'authors'); });
  $('.delete_author').click((e) => { deleteItem(e, 'authors'); });
  $('.delete_book').click((e) => { deleteItem(e, 'books'); });
  $('.book_search').submit((e) => { bookSearch(e); });
});
