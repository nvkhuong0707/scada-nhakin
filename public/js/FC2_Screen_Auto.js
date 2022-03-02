///// CHƯƠNG TRÌNH CON NÚT NHẤN SỬA //////
// Tạo 1 tag tạm báo đang sửa dữ liệu
var Auto_Screen_data_edditting = false;
function fn_Main_EditBtt(){
    // Cho hiển thị nút nhấn lưu
    fn_DataEdit('btt_ScreenAuto_Save','btt_ScreenAuto_Edit');
    // Cho tag báo đang sửa dữ liệu lên giá trị true
    Auto_Screen_data_edditting = true; 
    // Kích hoạt chức năng sửa của các IO Field
    document.getElementById("SET_MIN_TEMPERATURE").disabled = false; 
    document.getElementById("SET_MAX_TEMPERATURE").disabled = false; 
    document.getElementById("SET_MAX_AIR_HUMIDITY").disabled = false; 
    document.getElementById("SET_MIN_AIR_HUMIDITY").disabled = false; 
    document.getElementById("SET_TIME_MOTOR_MIX").disabled = false; 
    document.getElementById("SET_TIME_PUMP_1").disabled = false; 

}
///// CHƯƠNG TRÌNH CON NÚT NHẤN LƯU //////
function fn_Main_SaveBtt(){
// Cho hiển thị nút nhấn sửa
fn_DataEdit('btt_ScreenAuto_Edit','btt_ScreenAuto_Save');
    // Cho tag đang sửa dữ liệu về 0
    Auto_Screen_data_edditting = false; 
                        // Gửi dữ liệu cần sửa xuống PLC
    var data_edit_array = [document.getElementById('SET_MIN_TEMPERATURE').value,
                            document.getElementById('SET_MAX_TEMPERATURE').value,
                            document.getElementById('SET_MAX_AIR_HUMIDITY').value,
                            document.getElementById('SET_MIN_AIR_HUMIDITY').value,
                            document.getElementById('SET_TIME_MOTOR_MIX').value,
                            document.getElementById('SET_TIME_PUMP_1').value];

    socket.emit('cmd_Edit_Data', data_edit_array);
    alert('Dữ liệu đã được lưu!');
    // Vô hiệu hoá chức năng sửa của các IO Field
    document.getElementById("SET_MIN_TEMPERATURE").disabled = true;    
    document.getElementById("SET_MAX_TEMPERATURE").disabled = true;    
    document.getElementById("SET_MAX_AIR_HUMIDITY").disabled = true; 
    document.getElementById("SET_MIN_AIR_HUMIDITY").disabled = true;   
    document.getElementById("SET_TIME_MOTOR_MIX").disabled = true;  
    document.getElementById("SET_TIME_PUMP_1").disabled = true;  



// Chương trình con đọc dữ liệu lên IO Field
function fn_ScreenAuto_IOField_IO(tag, IOField, tofix)
{
    socket.on(tag, function(data){
        if (tofix == 0 & Auto_Screen_data_edditting != true)
        {
            document.getElementById(IOField).value = data;
        }
        else if(Auto_Screen_data_edditting != true)
        {
            document.getElementById(IOField).value = data.toFixed(tofix);
        }
    });
}
}