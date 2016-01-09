$(document).ready(function () {
    $( '.nav' ).on( 'click', 'a', function(e) {
        e.preventDefault();
        goToByScroll(this.id);
    });
});

function goToByScroll(id){
    id = id.replace("link", "");
    $('html,body').animate({
        scrollTop: $("#"+id).offset().top},
        'slow');
}
