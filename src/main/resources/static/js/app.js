var headers = new Headers();
headers.append('Content-Type', 'application/json; charset=utf-8');

var get_user = function(id) {
    return fetch('/api/user/' + id, {method: 'GET'});
}

var clean_froms = function(o) {
    $('input[name^="d_"],input[name^="e_"],input[name^="n_"]').each(function(){
        $(this).val("");
    })
    $('select[name^="d_"],select[name^="e_"],select[name^="n_"]').find('option').each(function() {
        $(this).prop('selected', false);
    })
}

var get_form_data = function(prefix) {
    var data = {};
    data.roles = [];
    $('[name^="' + prefix + '"]').each(function(){
        var n = $(this).prop('name').split('_');
        if(n[1] != 'roles') {
            data[n[1]] = $(this).val();
        } else {
            $(this).find('option:selected').each(function () {
                data.roles.push(parseInt($(this).attr('value')));
            })
        }
    })

    return data;
}


var dd = {};
var initial_table = function() {
    clean_froms();
    $.ajax({
        url: 'api/user/all',
        dataType: 'json',
        success: function(resp){
            dd = resp;


            var html = '';
            $.each(resp, function(k,user){
                html += '<tr>';
                    html += '<td>' + user.id + '</td>';
                    html += '<td>' + user.firstName + '</td>';
                    html += '<td>' + user.lastName + '</td>';
                    html += '<td>' + user.age + '</td>';
                    html += '<td>' + user.email + '</td>';
                    html += '<td>' + user.roles.map(v=>v.name).join(', ') + '</td>';
                    html += '<td>';
                        html += '<button data-id="' + user.id + '" class="btn btn-info modal-edit">Edit</button>';
                    html += '</td>';
                    html += '<td>';
                        html += '<button data-id="' + user.id + '" class="btn btn-danger modal-delete">Delete</button>';
                    html += '</td>';
                html += '</tr>';
            })

            $('#users-body-result').html(html);


        }
    })
}


var obj_id = 0;
$(document).on('click', 'button.modal-delete', function(){
    obj_id = $(this).attr('data-id');

    get_user(obj_id)
        .then(function (response) {
            response.json().then(function(user) {
                console.log(user);
                $('[name="d_firstName"]').val(user.firstName);
                $('[name="d_lastName"]').val(user.lastName);
                $('[name="d_email"]').val(user.email);
                $('[name="d_age"]').val(user.age);

                $.each(user.roles, function(k,v){
                    $('[name="d_roles"]').find('option[value="'+v.id+'"]').prop('selected', 'selected');
                })

                $('#modal-delete').modal('show');
            })
        })
})

var edit_obj_id = 0;

$(document).on('click', 'button.modal-edit', function(){
    edit_obj_id = $(this).attr('data-id');

    get_user(edit_obj_id)
        .then(function (response) {
            response.json().then(function(user) {
                console.log(user);
                $('[name="e_firstName"]').val(user.firstName);
                $('[name="e_lastName"]').val(user.lastName);
                $('[name="e_email"]').val(user.email);
                $('[name="e_age"]').val(user.age);
                //$('[name="e_password"]').val(user.password);

                $.each(user.roles, function(k,v){
                    $('[name="e_roles"]').find('option[value="'+v.id+'"]').prop('selected', 'selected');
                })

                $('#modal-edit').modal('show');
            })
        })
})
$(document).on('click', 'button.delete-user', function(){
    $('.modal').modal('hide');
    fetch('/api/user/' + obj_id, {method: 'DELETE'})
        .then(function(response){
            console.log(response.json());
            initial_table();
        })
    obj_id = 0;

    return false;
})

$(document).on('click', 'button.edit-user', function(){
    var data = get_form_data("e_");

    var request = new Request('/api/user/' + edit_obj_id, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
    });

    fetch(request).then(function (response) {
        initial_table();
    });

    edit_obj_id = 0;
    $('.modal').modal('hide');
    return false;
})

$(document).on('click', 'button.new-user', function(){
    $('button[data-target="#users"]').tab('show');
    var data = get_form_data("n_");

    var request = new Request('/api/user/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    });

    fetch(request).then(function (response) {
        console.log(response);
        console.log(response.json());
        initial_table();
    });

    initial_table();
    return false;
})

$(function(){
    initial_table();
})