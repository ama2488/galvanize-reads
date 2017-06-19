$(document).ready(() => {
  const $authorCount = $('#author_count');
  const authOptions = {
    valueNames: ['authorname'],
    pagination: true,
    page: 10,
  };
  const authorList = new List('authors', authOptions);

  function displayCount(list, element) {
    element.html(`${list.length} `);
  }

  displayCount(authorList.visibleItems, $authorCount);

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

  $('.put_author').submit((e) => { putForm(e, 'authors'); });
  $('.post_author').submit((e) => { postForm(e, 'authors'); });
  $('.post_book').submit((e) => { postForm(e, 'books'); });
  $('.delete_author').click((e) => { deleteItem(e, 'authors'); });
  authorList.on('searchStart', () => { displayCount(authorList.visibleItems, $authorCount); });
  authorList.on('searchComplete', () => { displayCount(authorList.visibleItems, $authorCount); });
});
