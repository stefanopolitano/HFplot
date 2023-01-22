
// function submitform(fid)
// {
//     document.getElementById(fid).submit();
// }

// function submitForm(id) {
//     var http = new XMLHttpRequest();
//     http.open("POST", "index.html", true);
//     http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//     var params = document.getElementById(id).name + "=" + document.getElementById(id).value
//     http.send(params);
//     http.onload = function() {
//         alert(http.responseText);
//     }
// }

// $("form").on("submit", function (e) {
//     e.preventDefault(); });


function submitForm() {
    // $("select").on('change', function () {
    //     var thisForm = $(this).closest('form');
    //     $.get($(thisForm).attr('action'), $(thisForm).serialize());
    // });
    // $("form").on("submit", function (e) {
    // e.preventDefault();
    // var form = $(this);
    // var url = form.attr('action');

    $('#fsetup').submit(function(){

        //some code here

        return false;
    });

    
    // $.ajax({
    //     type: "POST",
    //     url: $(theForm).attr('action'),
    //     data: $(theForm).serialize(), // serializes the form's elements.
    //     success: function(data)
    //     {
    //         alert(data); // show response from the php script.
    //     }
    // });
    // })
}
