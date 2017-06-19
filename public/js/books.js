$(document).ready(() => {
  const $bookCount = $('#book_count');
  const bookOptions = {
    valueNames: ['booktitle', 'bookgenre'],
    pagination: true,
    page: 10,
  };
  const bookList = new List('books', bookOptions);

  function displayCount(list, element) {
    element.html(`${list.length} `);
  }

  displayCount(bookList.visibleItems, $bookCount);

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

  function filterBooks(e) {
    const genre = $(e.target).serialize().split('=')[1];
    if (genre !== 'unfilter') {
      const filtered = bookList.filter(item => (item.values().bookgenre.replace(/\s/g, '') === genre));
    } else {
      bookList.filter();
    }
  }

  $('.put_book').submit((e) => { putForm(e, 'books'); });
  $('.post_book').submit((e) => { postForm(e, 'books'); });
  $('.post_author').submit((e) => { postForm(e, 'books'); });
  $('.delete_book').click((e) => { deleteItem(e, 'books'); });
  $('.book_filter').on('change', (e) => { filterBooks(e); });
  bookList.on('searchStart', () => { displayCount(bookList.visibleItems, $bookCount); });
  bookList.on('searchComplete', () => { displayCount(bookList.visibleItems, $bookCount); });
  bookList.on('filterStart', () => { displayCount(bookList.visibleItems, $bookCount); });
  bookList.on('filterComplete', () => { displayCount(bookList.visibleItems, $bookCount); });
});
