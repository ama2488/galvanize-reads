$(document).ready(() => {
  Materialize.updateTextFields();
  $('.button-collapse').sideNav();
  $('.modal').modal();
  $('select').material_select();
  $('.parallax').parallax();

// function authorizedAccess () {
//   if(user is authorized){
//       $('.authorized').toggle();
//     };
// }

  $('.authorizedAdd').toggle();
  $('.authorized').toggle();
});
