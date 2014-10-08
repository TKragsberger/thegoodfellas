$(document).ready(function(){
    var validationUsername;
    var validationPassword;
    var html = "";
    connectToDB();
    masterAjax('htmlsites/topMenu.html', '#topMenu');
    masterAjax('htmlsites/leftMenu.html', '#sideMenuLeft');
    masterAjax('htmlsites/content.html', '#content');
    masterAjax('htmlsites/rightMenu.html', '#sideMenuRight');
    
    $("#sideMenuRight").on("click", "#logout", function(){
        alert("logout");
        $.ajax({
                url: 'database/logout.php',
                dataType: 'json',
                success: function(json) {
                   
                    $.each(json, function(i, item) {
                        if (typeof item == 'object') {
                            var element = item.result;
                            
                            if(!element){
                                console.log("logout fail");
                            } else {
                                html =  '<div><input id="username"  type="text" placeholder="Brugernavn"></div>'+
                                        '<div id="usernameError" class="errorText"></div>'+
                                        '<div><input id="password" type="password" placeholder="Kodeord"></div>'+
                                        '<div id="passwordError" class="errorText"></div>'+
                                        '<div style="float: left"><button id="login" class="sideMenuLink">Login</button></div>'+
                                        '<div style="text-align: right"><button id="register" class="sideMenuLink">Opret bruger</button></div>';
                                $('#loginOutTitle').html("Login");
                                $('#loginOut').html(html);
                            }
                        }
                    });


                },
                error: function(r) {
                    alert("logout failed" + r);
                    
                }
            });
    });

    $("#sideMenuRight").on("click", "#login", function(){
        $("#usernameError").html("");
        $("#passwordError").html("");
        var username = $("#username").val();
        var password = $("#password").val();
        var neverExpire = $('#neverExpire').prop('checked');
        validationUsername = validateIfEmpty(username);
        validationPassword = validateIfEmpty(password);
        if(validationPassword && validationUsername){
            $.ajax({
                type: 'POST',
                url: 'database/login.php',
                data:{
                    username: username,
                    password: password,
                    neverExpire: neverExpire
                },
                dataType: 'json',
                success: function(json) {
                   
                    $.each(json, function(i, item) {
                        if (typeof item == 'object') {
                            var element = item.result;
                            
                            if(!element){
                                $('#passwordError').html("Forkert brugernavn eller password");
                            } else {
                                html = '<div><button id="logout" class="sideMenuLink">Log ud</button></div>';
                                $('#loginOutTitle').html('Velkommen '+element);
                                $('#loginOut').html(html);
                            }
                        }
                    });


                },
                error: function(r) {
                    alert("login failed" + r);
                    
                }
            });
        }else{
            if(!validationUsername){
                $("#usernameError").html("Indtast bruger navn!");
            }
            if(!validationPassword){
                $("#passwordError").html("Indtast kodeord!");
            }
        }
    });
    
    $("#registration").on("click", "#regSubmit", function(){
        $("#regUsernameError").html("");
        $("#regPasswordError").html("");
        $("#regEmailError").html("");
        var regUsername = $("#regUsername").val();
        var regPassword = $("#regPassword").val();
        var regEmail = $("#regEmail").val();
        validationUsername = validateIfEmpty(regUsername);
        validationPassword = validateIfEmpty(regPassword);
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
                dataType: 'json',
                success: function(json) {
                    alert("you are here");
                    $.each(json, function(i, item) {
                        if (typeof item === 'object') {
                            var element = item.result;
                            if(element){
                                $('#registrationTable').html("Din bruger er blevet oprettet");
                            }
                        }
                    });
                },
                error: function(r) {
                    alert("Registration failed" + r);
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
    
    function loggedIn(username){
        html = "<div>Velkommen"+username+"</div>";
        $('#loginOut').html(html);
    }
    
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
            dataType: 'json',
           
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

