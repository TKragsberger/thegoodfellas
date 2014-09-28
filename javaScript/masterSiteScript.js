$(document).ready(function(){
    connectToDB();
    masterAjax('htmlsites/topMenu.html', '#topMenu');
    masterAjax('htmlsites/leftMenu.html', '#sideMenuLeft');
    masterAjax('htmlsites/content.html', '#content');
    masterAjax('htmlsites/rightMenu.html', '#sideMenuRight');

    $("#sideMenuRight").on("click", "#login", function(){
       var username = $("#username").val();
       var password = $("#password").val();
       $.ajax({
           type: 'POST',
           url: 'database/login.php',
           data:{
                username: username,
                password: password
            },
            dataype: 'json',
            success: function(json) {
                
                $.each(json, function(i, item) {
                    if (typeof item == 'object') {
                        var element = item.result;
                        if(element){
                            alert(element);
                            $('#footer').html(element);
                        }
                    }
                });
                
                
            },
            error: function(r) {
                alert("Edit ajax failed" + r);
            }
        });
    });
    
    $("#registration").on("click", "#regSubmit", function(){
        var regUsername = $("#regUsername").val();
        var regPassword = $("#regPassword").val();
        var regEmail = $("#regEmail").val();
        var validationUsername = validateIfEmpty(regUsername);
        var validationPassword = validateIfEmpty(regPassword);
        var validationEmail = validateEmail(regEmail);
        if(validationEmail && validationPassword && validationUsername){
            $.ajax({
               type: 'POST',
               url: 'database/registration.php',
               data:{
                    username: regUsername,
                    password: regPassword,
                    email: regEmail
                },
                dataype: 'json',
                success: function(json) {
                    $.each(json, function(i, item) {
                        if (typeof item == 'object') {
                            var element = item.result;
                            if(element){
                                alert(element);
                                $('#registrationTable').html("Din bruger er blevet oprettet");
                                
                            }
                        }
                    });
                },
                error: function(r) {
                    alert("Edit ajax failed" + r);
                }
            });
        }else{
            if(!validationUsername){
                $("#regUsernameError").html("Der mangler et bruger navn!");
            }
            if(!validationPassword){
                $("#regPasswordError").html("Der mangler et kodeord!")
            }
            if(!validationEmail){
                if(!validateIfEmpty(regEmail)){
                    $("#regEmailError").html("Der mangler en Email!")
                }else{
                    $("#regEmailError").html("Der er noget galt med din Email!")
                }
            }
        }
    });
    
    $("#sideMenuRight").on("click", "#register", function() {
        $.ajax({
            url: 'htmlsites/registration.html',
            success: function(data){
                document.getElementById('registration').innerHTML = data;
            }
        });
    });
    
    $("#registration").on("click", ".closeRegistration", function() {
      document.getElementById('registration').innerHTML = '';
    });
    
    function connectToDB(){
        $.ajax({
           url: 'database/dbConnect.php',
           success: function(data){
               console.log("Der er forbindelse til databasen" + data);
           }
        });
    }
    
    function validateEmail(email){
        var firstValidation = email.indexOf("@");
        var secondValidation =email.indexOf(".");
        if(firstValidation !== -1 && secondValidation !== -1){
            return true;
        } else {
            return false;
        }
        
    }
    
    function validateIfEmpty(data){
        if(data !== ""){
            return true;
        }else{
            return false;
        }
    }
    
    function masterAjax(url, div){
        $.ajax({
            url: url,
            success: function(data){
                $(div).html(data);
            }
        });
    }
    
    $('#topMenu').on('click', 'a', function(){
        var targetContent = $(this).text();
        alert(targetContent);
        var searchQuery = ""; //<-----TODO
        var html = "<table>";
        $.ajax({
            type: 'GET',
            url: 'search.php',
            data:{
                searchQuery: searchQuery
            },
            dataype: 'json',
           
            success: function(json) {
                $.each(json, function(i, item) {
                    if (typeof item === 'object') {
                        var element = item.searchResult;
                        var columnName = item.columnNames;
                        for (var j = 0; j < columnName.length; j++) {
                            html +='<tr><td id="'+columnName[j]+'">'+columnName[j]+'</td></tr>';
                        }
                        html += '</table>';
                    }
                });
                $(div).html(html);
            },
            error: function(r) {
                html = '';
                $('#error').html('that did not work in getall '+r);
            }
        }); 
    });
});

