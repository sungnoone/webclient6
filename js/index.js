/*
 Created by wenjen on 2014/7/4.
*/


var BOSH_HOST = "http://192.168.1.238:7070/http-bind/";
var SHORT_HOST_NAME = "of3";
var LOGON_USER = "t002";
var LOGON_PWD = "t002";

var my = {
    connection: null,
    connected:false,
    receiver:""
};

$(document).ready(function () {
    btn_connect();
});


/*==============================================*/

//Connect Server
function btn_connect(){
    var conn = new Strophe.Connection(BOSH_HOST);

    conn.connect(LOGON_USER+"@"+SHORT_HOST_NAME, LOGON_PWD, function (status) {
        if(status === Strophe.Status.CONNECTED) {
            $("#message").append("<p>Connected!!!</p>");
            my.connected = true;
        }else if(status === Strophe.Status.CONNECTING){
            $("#message").append("<p>Connecting!!!</p>");
        }else if(status === Strophe.Status.DISCONNECTED) {
            $("#message").append("<p>Disconnected!!!</p>");
            my.connected = false;
        }else if(status === Strophe.Status.DISCONNECTING) {
            $("#message").append("<p>Disconnecting!!!</p>");
        }else if(status === Strophe.Status.AUTHENTICATING){
            $("#message").append("<p>Authenticating!!!</p>");
        }else if(status === Strophe.Status.AUTHFAIL){
            $("#message").append("<p>Auth fail!!!</p>");
        }else if(status === Strophe.Status.ERROR){
            $("#message").append("<p>An error has occurred</p>");
        }else if(status === Strophe.Status.ATTACHED){
            $("#message").append("<p>The connection has been attached</p>");
        }else if(status === Strophe.Status.CONNFAIL){
            $("#message").append("<p>Connection fail!!!</p>");
        }else{
            $("#message").append("<p>Status:"+status+"</p>");
        }
    });
    my.connection = conn;
}

//取得通訊錄
function btn_get_contact(){
    $("#contact_ul").empty();
    if (my.connected === false){
        $("#message").append("<p>主機未連線...</p>");
        return false;
    }
    var iq = $iq({type:"get"}).c("query", {xmlns:"jabber:iq:roster"});//產生查詢通訊錄XMPP stanza
    my.connection.sendIQ(iq, on_roster, err_roster);

}

//通訊錄成功處理
function on_roster(iq){
    $(iq).find("item").each(function(){
        var jid = $(this).attr("jid");
        var name = $(this).attr("name");
        $("#contact_ul").append("<li><a onclick='choose_receiver(\""+jid+"\");\'>"+name+":"+jid+"</a></li>");
    });
    $("#contact_ul").listview("refresh");
}

//通訊錄失敗處理
function err_roster(e){
    //alert(e.toString());
    $("#contact_ul").append("<p>通訊錄取得失敗...</p>");
}

//選擇通訊對象
function choose_receiver(jid){
    var jid_ary = jid.split("@");
    if(jid_ary.length > 1){
        my.receiver = jid;
    }else if(jid_ary.length === 1){
        my.receiver = jid+"@"+SHORT_HOST_NAME;
    }else{
        my.receiver = LOGON_USER+"@"+SHORT_HOST_NAME;
    }

    $("#chat_title").empty();
    $("#chat_title").append("<p>目前聊天對象:"+my.receiver+"</p>");
}