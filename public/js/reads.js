$(document).ready(() => {
  Materialize.updateTextFields();
  $('.button-collapse').sideNav();
  $('.modal').modal();

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
    console.log(url);
    console.log(root);
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

  function deleteItem(e) {
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
  $('.delete_author').click((e) => { deleteItem(e, 'authors'); });
  $('.delete_book').click((e) => { deleteItem(e, 'books'); });
});
