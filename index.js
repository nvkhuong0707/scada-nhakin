// Mảng xuất dữ liệu report Excel
var SQL_Excel = [];  // Dữ liệu nhập kho

// /////////////////////////++THIẾT LẬP KẾT NỐI VỚI PLC++/////////////////////////
// KHỞI TẠO KẾT NỐI PLC
var nodes7 = require('nodes7');  
var conn_plc = new nodes7; //PLC1
// Tạo địa chỉ kết nối (slot = 2 nếu là 300/400, slot = 1 nếu là 1200/1500)
conn_plc.initiateConnection({port: 102, host: '192.168.43.224', rack: 0, slot: 1}, PLC_connected); 

// Bảng tag trong Visual studio code
var tags_list = { 
    RUN_FAN: 'Q0.0',
    RUN_LAMP: 'Q0.1',
    RUN_PUMP_1: 'Q0.2',
    RUN_PUMP_2: 'Q0.3',
    RUN_MOTOR_MIX: 'Q0.4',
    SET_TEMPERATURE_MIN: 'DB2,INT0',  
    SET_TEMPERATURE_MAX: 'DB2,INT2',  
    SET_AIR_HUMIDITY_MIN: 'DB2,INT4',  
    SET_AIR_HUMIDITY_MAX: 'DB2,INT6',  
    VALUE_TEMPERATURE: 'DB2,INT8',  
    VALUE_AIR_HUMIDITY: 'DB2,INT10',
    SET_TIME_MOTOR_MIX_web: 'DB2,DINT12',
    TIME_MOTOR_MIX_web: 'DB2,DINT16',
    SET_TIME_PUMP_1_web: 'DB2,DINT20',
    TIME_PUMP_1_web: 'DB2,DINT24',
    START_PUMP_1: 'DB4,X0.0',  
    START_PUMP_2: 'DB4,X0.1',  
    START_FAN: 'DB4,X0.2',  
    START_LAMP: 'DB4,X0.3',  
    START_MOTOR_MIX: 'DB4,X0.4',  
    START_SYSTEM: 'DB4,X0.5',  
    STOP_SYSTEM: 'DB4,X0.6',  
    RUN_SYSTEM: 'DB4,X0.7',  
    HAND_AUTO: 'DB4,X1.0',  
    SENSOR_LOW: 'DB4,X1.1'


};

// GỬI DỮ LIỆu TAG CHO PLC
function PLC_connected(err) {
    console.log("xxx0001")
    if (typeof(err) !== "undefined") {
        console.log("xxx0002")
        console.log(err); // Hiển thị lỗi nếu không kết nối đƯỢc với PLC
        console.log("xxx0003")
    }
    console.log("xxx0004")
    conn_plc.setTranslationCB(function(tag) {return tags_list[tag];});  // Đưa giá trị đọc lên từ PLC và mảng
    console.log("xxx0005")
    conn_plc.addItems([
      'RUN_FAN',
      'RUN_LAMP',
      'RUN_PUMP_1',
      'RUN_PUMP_2',
      'RUN_MOTOR_MIX', 
      'SET_TEMPERATURE_MIN',  
      'SET_TEMPERATURE_MAX',  
      'SET_AIR_HUMIDITY_MIN',  
      'SET_AIR_HUMIDITY_MAX', 
      'VALUE_TEMPERATURE', 
      'VALUE_AIR_HUMIDITY',
      'SET_TIME_MOTOR_MIX_web',
      'TIME_MOTOR_MIX_web',
      'SET_TIME_PUMP_1_web',
      'TIME_PUMP_1_web',
      'START_PUMP_1',      
      'START_PUMP_2',      
      'START_FAN',    
      'START_LAMP',       
      'START_MOTOR_MIX',  
      'START_SYSTEM',  
      'STOP_SYSTEM',  
      'RUN_SYSTEM',  
      'HAND_AUTO',  
      'SENSOR_LOW'


    ]);
}

// Đọc dữ liệu từ PLC và đưa vào array tags
var arr_tag_value = []; // Tạo một mảng lưu giá trị tag đọc về
function valuesReady(anythingBad, values) {
    if (anythingBad) { console.log("Lỗi khi đọc dữ liệu tag"); } // Cảnh báo lỗi
    var lodash = require('lodash'); // Chuyển variable sang array
    arr_tag_value = lodash.map(values, (item) => item);
    console.log(values); // Hiển thị giá trị để kiểm tra
}


// Hàm chức năng scan giá trị
function fn_read_data_scan(){
    conn_plc.readAllItems(valuesReady);
}
// Time cập nhật mỗi 1s
setInterval(
    () => fn_read_data_scan(),
    1000 // 1s = 1000ms
);



var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(3000);
// Home calling
app.get("/", function(req, res){
    res.render("home")
});
//

// ///////////LẬP BẢNG TAG ĐỂ GỬI QUA CLIENT (TRÌNH DUYỆT)///////////
function fn_tag(){

    io.sockets.emit("RUN_FAN", arr_tag_value[0]);  
    io.sockets.emit("RUN_LAMP", arr_tag_value[1]);  
    io.sockets.emit("RUN_PUMP_1", arr_tag_value[2]);  
    io.sockets.emit("RUN_PUMP_2", arr_tag_value[3]);  
    io.sockets.emit("RUN_MOTOR_MIX", arr_tag_value[4]);  
    io.sockets.emit("SET_TEMPERATURE_MIN", arr_tag_value[5]);  
    io.sockets.emit("SET_TEMPERATURE_MAX", arr_tag_value[6]);  
    io.sockets.emit("SET_AIR_HUMIDITY_MIN", arr_tag_value[7]);  
    io.sockets.emit("SET_AIR_HUMIDITY_MAX", arr_tag_value[8]);  
    io.sockets.emit("VALUE_TEMPERATURE", arr_tag_value[9]);  
    io.sockets.emit("VALUE_AIR_HUMIDITY", arr_tag_value[10]);  
    io.sockets.emit("SET_TIME_MOTOR_MIX_web", arr_tag_value[11]);  
    io.sockets.emit("TIME_MOTOR_MIX_web", arr_tag_value[12]);  
    io.sockets.emit("SET_TIME_PUMP_1_web", arr_tag_value[13]);  
    io.sockets.emit("TIME_PUMP_1_web", arr_tag_value[14]);  
    io.sockets.emit("START_PUMP_1", arr_tag_value[15]);  
    io.sockets.emit("START_PUMP_2", arr_tag_value[16]);  
    io.sockets.emit("START_FAN", arr_tag_value[17]);  
    io.sockets.emit("START_LAMP", arr_tag_value[18]);  
    io.sockets.emit("START_MOTOR_MIX", arr_tag_value[19]);  
    io.sockets.emit("START_SYSTEM", arr_tag_value[20]);  
    io.sockets.emit("STOP_SYSTEM", arr_tag_value[21]);  
    io.sockets.emit("RUN_SYSTEM", arr_tag_value[22]);  
    io.sockets.emit("HAND_AUTO", arr_tag_value[23]);  
    io.sockets.emit("SENSOR_LOW", arr_tag_value[24]); 
 
}


// /////////// GỬI DỮ LIỆU BẢNG TAG ĐẾN CLIENT (TRÌNH DUYỆT) ///////////////
io.on("connection", function(socket){
    socket.on("Client-send-data", function(data){
        fn_tag();
    });
    fn_SQLSearch(); // Hàm tìm kiếm SQL
    fn_SQLSearch_ByTime();  // Hàm tìm kiếm SQL theo thời gian
    fn_Require_ExcelExport(); // Nhận yêu cầu xuất Excel
});



// HÀM GHI DỮ LIỆU XUỐNG PLC
function valuesWritten(anythingBad) {
    if (anythingBad) { console.log("SOMETHING WENT WRONG WRITING VALUES!!!!"); }
    console.log("Done writing.");
}


// Nhận các bức điện được gửi từ trình duyệt
io.on("connection", function(socket){
    // NÚT NHẤN START_SYSTEM
        socket.on("cmd_START_SYSTEM", function(data){conn_plc.writeItems('START_SYSTEM', data, valuesWritten);});
    // NÚT NHẤN STOP_SYSTEM
        socket.on("cmd_STOP_SYSTEM", function(data){conn_plc.writeItems('STOP_SYSTEM', data, valuesWritten);});
    
    // NÚT NHẤN PUMP_1
        socket.on("cmd_PUMP_1", function(data){conn_plc.writeItems('START_PUMP_1', data, valuesWritten);});

    // NÚT NHẤN PUMP_2
        socket.on("cmd_PUMP_2", function(data){conn_plc.writeItems('START_PUMP_2', data, valuesWritten);});

    // NÚT NHẤN LAMP
        socket.on("cmd_LAMP", function(data){conn_plc.writeItems('START_LAMP', data, valuesWritten);});

    // NÚT NHẤN FAN
        socket.on("cmd_FAN", function(data){conn_plc.writeItems('START_FAN', data, valuesWritten);});

    // NÚT NHẤN MOTOR_MIX
       socket.on("cmd_MOTOR_MIX", function(data){conn_plc.writeItems('START_MOTOR_MIX', data, valuesWritten);});

    // NÚT NHẤN AUTO/hand
        socket.on("cmd_START_AUTO_HAND", function(data){conn_plc.writeItems('HAND_AUTO', data, valuesWritten);});
    

       
    
            // Ghi dữ liệu từ IO field
            socket.on("cmd_Edit_Data", function(data){
                conn_plc.writeItems([
                'SET_TEMPERATURE_MIN', 'SET_TEMPERATURE_MAX', 'SET_AIR_HUMIDITY_MAX', 'SET_AIR_HUMIDITY_MIN', 'SET_TIME_MOTOR_MIX_web','SET_TIME_PUMP_1_web'],
                                    [data[0],data[1],data[2],data[3],data[4],data[5]
                                ], valuesWritten);  
                });
       

});




/////////////////////////////////// ++++++++++++++++++++++++++ CƠ SỞ DỮ LIỆU SQL +++++++++++++++++++++++++++/////////////////////////////////
// Khởi tạo SQL
var mysql = require('mysql');
var sqlcon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "sql_plc",
  dateStrings:true // Hiển thị không có T và Z
});


//++hàm ghi dữ liệu xuống SQL++//

function fn_sql_insert(){
    var sqltable_Name = "plc_data";
    // Lấy thời gian hiện tại
	var tzoffset = (new Date()).getTimezoneOffset() * 60000; //Vùng Việt Nam (GMT7+)
	var temp_datenow = new Date();
	var timeNow = (new Date(temp_datenow - tzoffset)).toISOString().slice(0, -1).replace("T"," ");
	var timeNow_toSQL = "'" + timeNow + "',";
 
    // Dữ liệu đọc lên từ các tag
    var data_Temperature = "'" + arr_tag_value[9] + "',";
    var data_Air_Humidity = "'" + arr_tag_value[10] + "'";
    // Ghi dữ liệu vào SQL
    {
        var sql_write_str11 = "INSERT INTO " + sqltable_Name + " (date_time, data_Temperature, data_Air_Humidity) VALUES (";
        var sql_write_str12 = timeNow_toSQL 
                            + data_Temperature 
                            + data_Air_Humidity
                            ;
        var sql_write_str1 = sql_write_str11 + sql_write_str12 + ");";
        // Thực hiện ghi dữ liệu vào SQL
		sqlcon.query(sql_write_str1, function (err, result) {
            if (err) {
                console.log(err);
             } else {
                console.log("SQL - Ghi dữ liệu thành công");
              } 
			});
    }
}

// Hàm chức năng scan vào SQL
function fn_read_data_scan_sql(){
    fn_sql_insert();
}
// Time cập nhật mỗi 1s
setInterval(
    () => fn_read_data_scan_sql(),
    5000 // 1s = 1000ms
);


// Đọc dữ liệu từ SQL
function fn_SQLSearch(){
io.on("connection", function(socket){
    socket.on("msg_SQL_Show", function(data)
    {
        var sqltable_Name = "plc_data";
        var queryy1 = "SELECT * FROM " + sqltable_Name + ";" 
        sqlcon.query(queryy1, function(err, results, fields) {
            if (err) {
                console.log(err);
            } else {
                const objectifyRawPacket = row => ({...row});
                const convertedResponse = results.map(objectifyRawPacket);
                socket.emit('SQL_Show', convertedResponse);
                console.log(convertedResponse);
            } 
        });
    });
});
}


// Đọc dữ liệu SQL theo thời gian
function fn_SQLSearch_ByTime(){
    io.on("connection", function(socket){
        socket.on("msg_SQL_ByTime", function(data)
        {
            var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset time Việt Nam (GMT7+)
            // Lấy thời gian tìm kiếm từ date time piker
            var timeS = new Date(data[0]); // Thời gian bắt đầu
            var timeE = new Date(data[1]); // Thời gian kết thúc
            // Quy đổi thời gian ra định dạng cua MySQL
            var timeS1 = "'" + (new Date(timeS - tzoffset)).toISOString().slice(0, -1).replace("T"," ")	+ "'";
            var timeE1 = "'" + (new Date(timeE - tzoffset)).toISOString().slice(0, -1).replace("T"," ") + "'";
            var timeR = timeS1 + "AND" + timeE1; // Khoảng thời gian tìm kiếm (Time Range)

            var sqltable_Name = "plc_data"; // Tên bảng
            var dt_col_Name = "date_time";  // Tên cột thời gian

            var Query1 = "SELECT * FROM " + sqltable_Name + " WHERE "+ dt_col_Name + " BETWEEN ";
            var Query = Query1 + timeR + ";";
            
            sqlcon.query(Query, function(err, results, fields) {
                if (err) {
                    console.log(err);
                } else {
                    const objectifyRawPacket = row => ({...row});
                    const convertedResponse = results.map(objectifyRawPacket);
                    SQL_Excel = convertedResponse; // Xuất báo cáo Excel
                    socket.emit('SQL_ByTime', convertedResponse);
                } 
            });
        });
    });
}




// /////////////////////////////// BÁO CÁO EXCEL ///////////////////////////////
const Excel = require('exceljs');
const { CONNREFUSED } = require('dns');
function fn_excelExport(){
// =====================CÁC THUỘC TÍNH CHUNG=====================
	// Lấy ngày tháng hiện tại
	let date_ob = new Date();
	let date = ("0" + date_ob.getDate()).slice(-2);
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
	let day = date_ob.getDay();
	var dayName = '';
	if(day == 0){dayName = 'Chủ nhật,'}
	else if(day == 1){dayName = 'Thứ hai,'}
	else if(day == 2){dayName = 'Thứ ba,'}
	else if(day == 3){dayName = 'Thứ tư,'}
	else if(day == 4){dayName = 'Thứ năm,'}
	else if(day == 5){dayName = 'Thứ sáu,'}
	else if(day == 6){dayName = 'Thứ bảy,'}
	else{};
// Tạo và khai báo Excel
let workbook = new Excel.Workbook()
let worksheet =  workbook.addWorksheet('Báo cáo sản xuất', {
  pageSetup:{paperSize: 9, orientation:'landscape'},
  properties:{tabColor:{argb:'FFC0000'}},
});
// Page setup (cài đặt trang)
worksheet.properties.defaultRowHeight = 20;
worksheet.pageSetup.margins = {
  left: 0.3, right: 0.25,
  top: 0.75, bottom: 0.75,
  header: 0.3, footer: 0.3
};
// =====================THẾT KẾ HEADER=====================
// Logo công ty
const imageId1 = workbook.addImage({
	filename: 'public/images/Logo.png',
	extension: 'png',
  });
worksheet.addImage(imageId1, 'A1:A4');
// Thông tin công ty
worksheet.getCell('B1').value = 'Trường Đại Học Mỏ - Địa Chất';
worksheet.getCell('B1').style = { font:{name: 'Times New Roman', bold: true,size: 14},alignment: {horizontal:'left',vertical: 'middle'}} ;
worksheet.getCell('B2').value = 'Địa chỉ: Số 18 Phố Viên - Phường Đức Thắng - Q. Bắc Từ Liêm - Hà Nội';
worksheet.getCell('B2').style = { font:{name: 'Times New Roman',size: 11},alignment: {horizontal:'left',vertical: 'middle'}} ;
worksheet.getCell('B3').value = 'Điện thoại: (+84-24) 3838 9633';
worksheet.getCell('B3').style = { font:{name: 'Times New Roman',size: 11},alignment: {horizontal:'left',vertical: 'middle'}} ;
// Tên báo cáo
worksheet.getCell('A5').value = 'BÁO CÁO SẢN XUẤT';
worksheet.mergeCells('A5:E5');
worksheet.getCell('A5').style = { font:{name: 'Times New Roman', bold: true,size: 16},alignment: {horizontal:'center',vertical: 'middle'}} ;
// Ngày in biểu
worksheet.getCell('E7').value = "Ngày in biểu: " + dayName + date + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds;
worksheet.getCell('E7').style = { font:{name: 'Times New Roman',bold: false, italic: true},alignment: {horizontal:'right',vertical: 'bottom',wrapText: false}} ;

// Tên nhãn các cột
var rowpos = 8;
var collumName = ["STT","Thời gian", "TEMPERATURE", "AIR_HUMIDITY", "Ghi chú"]
worksheet.spliceRows(rowpos, 1, collumName);


// =====================XUẤT DỮ LIỆU EXCEL SQL=====================
// Dump all the data into Excel
var rowIndex = 0;
SQL_Excel.forEach((e, index) => {
// row 1 is the header.
rowIndex =  index + rowpos;
// worksheet1 collum
worksheet.columns = [
      {key: 'STT'},
      {key: 'date_time'},
      {key: 'data_Temperature'},
      {key: 'data_Air_Humidity'}
    ]
worksheet.addRow({
      STT: {
        formula: index + 1
      },
      ...e
    })
})
// Lấy tổng số hàng
const totalNumberOfRows = worksheet.rowCount; 
// Tính tổng
worksheet.addRow([
	'Trung bình:',
	'',
  {formula: `=AVERAGE(C${rowpos + 1}:C${totalNumberOfRows})`},
  {formula: `=AVERAGE(D${rowpos + 1}:D${totalNumberOfRows})`},

])

// Style cho hàng total (Tổng cộng)
worksheet.getCell(`A${totalNumberOfRows+1}`).style = { font:{bold: true,size: 12},alignment: {horizontal:'center',}} ;
// Tô màu cho hàng total (Tổng cộng)
const total_row = ['A','B', 'C', 'D', 'E']
total_row.forEach((v) => {
    worksheet.getCell(`${v}${totalNumberOfRows+1}`).fill = {type: 'pattern',pattern:'solid',fgColor:{ argb:'f2ff00' }}
})

// Style các cột
const HeaderStyle = ['A','B', 'C', 'D', 'E']
HeaderStyle.forEach((v) => {
    worksheet.getCell(`${v}${rowpos}`).style = { font:{name: 'Times New Roman',bold: true},alignment: {horizontal:'center',vertical: 'middle',wrapText: true}} ;
    worksheet.getCell(`${v}${rowpos}`).border = {
      top: {style:'thin'},
      left: {style:'thin'},
      bottom: {style:'thin'},
      right: {style:'thin'}
    }
})
// Cài đặt độ rộng cột
worksheet.columns.forEach((column, index) => {
    column.width = 18;
})
// Set width header
worksheet.getColumn(1).width = 13;
worksheet.getColumn(2).width = 20;
worksheet.getColumn(5).width = 30;

// ++++++++++++Style cho các hàng dữ liệu++++++++++++
worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
    var datastartrow = rowpos;
    var rowindex = rowNumber + datastartrow;
    const rowlength = datastartrow + SQL_Excel.length
    if(rowindex >= rowlength+1){rowindex = rowlength+1}
    const insideColumns = ['A','B', 'C', 'D', 'E']
  // Tạo border
    insideColumns.forEach((v) => {
        // Border
      worksheet.getCell(`${v}${rowindex}`).border = {
        top: {style: 'thin'},
        bottom: {style: 'thin'},
        left: {style: 'thin'},
        right: {style: 'thin'}
      },
      // Alignment
      worksheet.getCell(`${v}${rowindex}`).alignment = {horizontal:'center',vertical: 'middle',wrapText: true}
    })
  })

// =====================THẾT KẾ FOOTER=====================
worksheet.getCell(`E${totalNumberOfRows+3}`).value = 'Ngày …………tháng ……………năm 20………';
worksheet.getCell(`E${totalNumberOfRows+3}`).style = { font:{bold: true, italic: false},alignment: {horizontal:'right',vertical: 'middle',wrapText: false}} ;

worksheet.getCell(`E${totalNumberOfRows+4}`).value = 'Người in biểu';
worksheet.getCell(`E${totalNumberOfRows+5}`).value = '(Ký, ghi rõ họ tên)';
worksheet.getCell(`E${totalNumberOfRows+4}`).style = { font:{bold: true, italic: false},alignment: {horizontal:'center',vertical: 'bottom',wrapText: false}} ;
worksheet.getCell(`E${totalNumberOfRows+5}`).style = { font:{bold: false, italic: true},alignment: {horizontal:'center',vertical: 'top',wrapText: false}} ;









// =====================THỰC HIỆN XUẤT DỮ LIỆU EXCEL=====================
// Export Link
var currentTime = year + "_" + month + "_" + date + "_" + hours + "h" + minutes + "m" + seconds + "s";
var saveasDirect = "Report/Report_" + currentTime + ".xlsx";
SaveAslink = saveasDirect; // Send to client
var booknameLink = "public/" + saveasDirect;

var Bookname = "Report_" + currentTime + ".xlsx";
// Write book name
workbook.xlsx.writeFile(booknameLink)

// Return
return [SaveAslink, Bookname]

} // Đóng fn_excelExport





// =====================TRUYỀN NHẬN DỮ LIỆU VỚI TRÌNH DUYỆT=====================
// Hàm chức năng truyền nhận dữ liệu với trình duyệt
function fn_Require_ExcelExport(){
    io.on("connection", function(socket){
        socket.on("msg_Excel_Report", function(data)
        {
            const [SaveAslink1, Bookname] = fn_excelExport();
            var data = [SaveAslink1, Bookname];
            socket.emit('send_Excel_Report', data);
        });
    });
}