// Chương trình con đọc dữ liệu SQL
function fn_Table01_SQL_Show(){
    socket.emit("msg_SQL_Show", "true");
    socket.on('SQL_Show',function(data){
        fn_table_01(data);
    }); 
}

// Chương trình con hiển thị SQL ra bảng
function fn_table_01(data){
    if(data){
        $("#table_01 tbody").empty(); 
        var len = data.length;
        var txt = "<tbody>";
        if(len > 0){
            for(var i=0;i<len;i++){
                    txt += "<tr><td>"+data[i].date_time
                        +"</td><td>"+data[i].data_Temperature
                        +"</td><td>"+data[i].data_Air_Humidity
                        +"</td></tr>";
                    }
            if(txt != ""){
            txt +="</tbody>"; 
            $("#table_01").append(txt);
            }
        }
    }   
}

// Tìm kiếm SQL theo khoảng thời gian
function fn_SQL_By_Time()
{
    var val = [document.getElementById('dtpk_Search_Start').value,
               document.getElementById('dtpk_Search_End').value];
    socket.emit('msg_SQL_ByTime', val);
    socket.on('SQL_ByTime', function(data){
        fn_table_01(data); // Show sdata
    });
}