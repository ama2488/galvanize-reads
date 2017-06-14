$(document).ready(() => {
  Materialize.updateTextFields();
  $('.button-collapse').sideNav();
  $('.modal').modal();
  $('select').material_select();


  const bookOptions = {
    valueNames: ['booktitle', 'bookgenre'],
  };
  const authOptions = {
    valueNames: ['authorname'],
  };
  const bookList = new List('books', bookOptions);
  const authorList = new List('authors', authOptions);

  function filterBooks(e) {
    const genre = $(e.target).serialize().split('=')[1];
    if (genre !== 'unfilter') {
      bookList.filter((item) => {
        if (item.values().bookgenre.replace(/\s/g, '') === genre) {
          return true;
        }
        return false;
      });
    } else {
      bookList.filter();
    }
  }

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

  $('.put_book').submit((e) => { putForm(e, 'books'); });
  $('.put_author').submit((e) => { putForm(e, 'authors'); });
  $('.post_book').submit((e) => { postForm(e, 'books'); });
  $('.post_author').submit((e) => { postForm(e, 'authors'); });
  $('.delete_author').click((e) => { deleteItem(e, 'authors'); });
  $('.delete_book').click((e) => { deleteItem(e, 'books'); });
  $('.book_filter').on('change', (e) => { filterBooks(e); });
});
