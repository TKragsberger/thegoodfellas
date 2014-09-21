$(document).ready(function(){
    masterAjax('htmlsites/topMenu.html', '#topMenu');
    masterAjax('htmlsites/leftMenu.html', '#sideMenuLeft');
    masterAjax('htmlsites/content.html', '#content');
    masterAjax('htmlsites/rightMenu.html', '#sideMenuRight');
    
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

