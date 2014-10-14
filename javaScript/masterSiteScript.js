$(document).ready(function(){
    var validationUsername;
    var validationPassword;
    var html = "";
    connectToDB();
    checkLogin();
    masterAjax('htmlsites/topMenu.html', '#topMenu');
    masterAjax('htmlsites/leftMenu.html', '#sideMenuLeft');
    masterAjax('htmlsites/content.html', '#content');
    masterAjax('htmlsites/rightMenu.html', '#sideMenuRight');
    $('.carousel').carousel();
    getRank();
    
    $("#sideMenuRight").on("click", "#logout", function(){
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
                            logoutHtml();
                        }
                    }
                });
            },
            error: function(r) {
                console.log("logout failed" + r);
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
                                loginHtml(username);
                            }
                        }
                    });
                },
                error: function(r) {
                    console.log("login failed" + r);
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
                    console.log("Registration failed" + r);
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
    
    function loginHtml(user){
        html = '<div><button id="logout" class="sideMenuLink">Log ud</button></div>';
        $('#loginOutTitle').html('Velkommen '+user);
        $('#loginOut').html(html);
    }
    
    function logoutHtml(){
        html =  '<div><input id="username" class="inputLogin" type="text" placeholder="Brugernavn"></div>'+
                '<div id="usernameError" class="errorText"></div>'+
                '<div><input id="password" class="inputLogin" type="password" placeholder="Kodeord"></div>'+
                '<div id="passwordError" class="errorText"></div>'+
                '<div><input id="neverExpire" type="checkbox" name="remeberMe" value="Husk login">Husk login</div>'+
                '<div style="float: left"><button id="login" class="sideMenuLink">Login</button></div>'+
                '<div style="text-align: right"><button id="register" class="sideMenuLink">Opret bruger</button></div>';
            $('#loginOutTitle').html("Login");
            $('#loginOut').html(html);
    }
    
    function checkLogin(){
        $.ajax({
            url: 'database/checkLogin.php',
            dataType: 'json',
            success: function(json){
               $.each(json, function(i, item) {
                    if (typeof item === 'object') {
                        var element = item.result;
                        var username = item.username;
                        if(element){
                            console.log("Der var Cookies fra tidligere session " + element);
                            loginHtml(username);
                        }else{
                            console.log("Der var ikke Cookies fra tidligere session " + element);
                        }
                    }
                });
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
    
    function getRank(){
        
        $.ajax({
            url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2Fwww.wowprogress.com%2Fguild%2Feu%2Fravencrest%2FThe%2BGoodfellas%2Frating.tier16_25%2Fjson_rank'&diagnostics=true",
            dataType: 'xml',
            success: function(xml) {
                var data = $(xml).find('p').text();
                var worldRankStart = data.indexOf("world_rank")+12;
                var worldRankEnd = data.indexOf("area")-2;
                var realmRankStart = data.indexOf("realm_rank")+12; 
                var realmRankEnd = data.indexOf("}");
                var worldRank = data.substring(worldRankStart, worldRankEnd);
                var realmRank = data.substring(realmRankStart, realmRankEnd);
                    if(!realmRankStart < 0 && worldRankStart < 0){
                        $('#progress').html("Error");
                    } else {
                        html = '<div><a href="http://www.wowprogress.com/pve/eu/ravencrest" class="sideMenuLink">';
                        html += "Realm Rank: "+ realmRank +"</a></div><br>";
                        html += '<div><a href="http://www.wowprogress.com/pve/eu/ravencrest" class="sideMenuLink">World Rank: '+ worldRank +'</a></div>';
                        $('#progress').html(html);
                    }
                },
                error: function(r) {
                    alert("get rank fail");
                }
        });
    }
});

