define(["events","apiclient"],function(e,n){var r={Unavailable:0,ServerSelection:1,ServerSignIn:2,SignedIn:3,ConnectSignIn:4},t={Local:0,Remote:1,Manual:2},o={getServerAddress:function(e,n){switch(n){case t.Local:return e.LocalAddress;case t.Manual:return e.ManualAddress;case t.Remote:return e.RemoteAddress;default:return e.ManualAddress||e.LocalAddress||e.RemoteAddress}}},s=function(s,c,i,a,u,d,l){function f(e,n){for(var r=0,t=n.length;t>r;r++)s.addOrUpdateServer(e,n[r]);return e}function v(e){e({State:r.Unavailable,ConnectUser:J.connectUser()})}function p(e,n){e.Name=n.ServerName,e.Id=n.Id,n.LocalAddress&&(e.LocalAddress=n.LocalAddress),n.WanAddress&&(e.RemoteAddress=n.WanAddress),n.MacAddress&&(e.WakeOnLanInfos=[{MacAddress:n.MacAddress}])}function I(e,n){return e+"/emby/"+n}function h(e){var n=e.headers||{};"json"==e.dataType&&(n.accept="application/json");var r={headers:n,method:e.type},t=e.contentType;return e.data&&("string"==typeof e.data?r.body=e.data:(r.body=S(e.data),t=t||"application/x-www-form-urlencoded; charset=UTF-8")),t&&(n["Content-Type"]=t),e.timeout?g(e.url,r,e.timeout):fetch(e.url,r)}function g(e,n,r){return new Promise(function(t,o){var s=setTimeout(o,r);fetch(e,n).then(function(e){clearTimeout(s),t(e)},function(){clearTimeout(s),o()})})}function S(e){var n=[];for(var r in e){var t=e[r];null!==t&&void 0!==t&&""!==t&&n.push(encodeURIComponent(r)+"="+encodeURIComponent(t))}return n.join("&")}function T(e){if(!e)throw new Error("Request cannot be null");return e.headers=e.headers||{},h(e).then(function(n){return n.status<400?"json"==e.dataType||"application/json"==e.headers.accept?n.json():n:Promise.reject(n)},function(e){throw e})}function A(e,n){return e=I(e,"system/info/public"),T({type:"GET",url:e,dataType:"json",timeout:n||V})}function m(n){H=n,e.trigger(J,"connectusersignedin",[n])}function C(r,t){var s=J.getApiClient(r.Id);if(!s){var d=o.getServerAddress(r,t);s=new n(d,c,i,a,u,l),K.push(s),s.serverInfo(r),s.onAuthenticated=function(e,n){U(e,n,{},!0)},e.trigger(J,"apiclientcreated",[s])}return s}function U(e,n,r,o){var c=s.credentials(),i=c.Servers.filter(function(e){return e.Id==n.ServerId}),a=i.length?i[0]:e.serverInfo();r.updateDateLastAccessed!==!1&&(a.DateLastAccessed=(new Date).getTime(),a.LastConnectionMode==t.Local&&(a.DateLastLocalConnection=(new Date).getTime())),a.Id=n.ServerId,o?(a.UserId=n.User.Id,a.AccessToken=n.AccessToken):(a.UserId=null,a.AccessToken=null),s.addOrUpdateServer(c.Servers,a),w(a,n.User),s.credentials(c),L(e,r),k(n.User)}function w(e,n){var r={Id:n.Id,IsSignedInOffline:!0};s.addOrUpdateUser(e,r)}function L(e,n){n=n||{},n.reportCapabilities!==!1&&e.reportCapabilities(d),n.enableWebSocket!==!1&&!e.isWebSocketOpenOrConnecting&&e.isWebSocketSupported()&&e.openWebSocket()}function k(n){e.trigger(J,"localusersignedin",[n])}function y(e){return new Promise(function(n){H&&H.Id==e.ConnectUserId?n():e.ConnectUserId&&e.ConnectAccessToken?(H=null,E(e.ConnectUserId,e.ConnectAccessToken).then(function(e){m(e),n()},function(){n()})):n()})}function E(e,n){if(!e)throw new Error("null userId");if(!n)throw new Error("null accessToken");var r="https://connect.emby.media/service/user?id="+e;return T({type:"GET",url:r,dataType:"json",headers:{"X-Application":c+"/"+i,"X-Connect-UserToken":n}})}function M(e,n,r){if(!e.ExchangeToken)throw new Error("server.ExchangeToken cannot be null");if(!r.ConnectUserId)throw new Error("credentials.ConnectUserId cannot be null");var t=o.getServerAddress(e,n);return t=I(t,"Connect/Exchange?format=json&ConnectUserId="+r.ConnectUserId),T({type:"GET",url:t,dataType:"json",headers:{"X-MediaBrowser-Token":e.ExchangeToken}}).then(function(n){return e.UserId=n.LocalUserId,e.AccessToken=n.AccessToken,n},function(){return e.UserId=null,e.AccessToken=null,Promise.reject()})}function D(e,n){return new Promise(function(r){var t=o.getServerAddress(e,n);T({type:"GET",url:I(t,"System/Info"),dataType:"json",headers:{"X-MediaBrowser-Token":e.AccessToken}}).then(function(n){p(e,n),e.UserId&&T({type:"GET",url:I(t,"users/"+e.UserId),dataType:"json",headers:{"X-MediaBrowser-Token":e.AccessToken}}).then(function(e){k(e),r()},function(){e.UserId=null,e.AccessToken=null,r()})},function(){e.UserId=null,e.AccessToken=null,r()})})}function b(e){if(H&&H.ImageUrl)return{url:H.ImageUrl};if(e&&e.PrimaryImageTag){var n=J.getApiClient(e),r=n.getUserImageUrl(e.Id,{tag:e.PrimaryImageTag,type:"Primary"});return{url:r,supportsParams:!0}}return{url:null,supportsParams:!1}}function P(n){var r=n.serverInfo()||{},t={serverId:r.Id};return n.logout().then(function(){e.trigger(J,"localusersignedout",[t])},function(){e.trigger(J,"localusersignedout",[t])})}function O(e){return new Promise(function(n){if(!e.ConnectAccessToken||!e.ConnectUserId)return void n([]);var r="https://connect.emby.media/service/servers?userId="+e.ConnectUserId;T({type:"GET",url:r,dataType:"json",headers:{"X-Application":c+"/"+i,"X-Connect-UserToken":e.ConnectAccessToken}}).then(function(e){e=e.map(function(e){return{ExchangeToken:e.AccessKey,ConnectServerId:e.Id,Id:e.SystemId,Name:e.Name,RemoteAddress:e.Url,LocalAddress:e.LocalAddress,UserLinkType:"guest"==(e.UserType||"").toLowerCase()?"Guest":"LinkedUser"}}),n(e)},function(){n([])})})}function j(e,n){return e.filter(function(e){return e.ExchangeToken?n.filter(function(n){return e.Id==n.Id}).length>0:!0})}function R(){return new Promise(function(e){require(["serverdiscovery"],function(n){n.findServers(1e3).then(function(n){var r=n.map(function(e){var n={Id:e.Id,LocalAddress:e.Address,Name:e.Name,ManualAddress:N(e),DateLastLocalConnection:(new Date).getTime()};return n.LastConnectionMode=n.ManualAddress?t.Manual:t.Local,n});e(r)})})})}function N(e){if(e.Address&&e.EndpointAddress){var n=e.EndpointAddress.split(":")[0],r=e.Address.split(":");if(r.length>1){var t=r[r.length-1];isNaN(parseInt(t))||(n+=":"+t)}return F(n)}return null}function X(e){require(["wakeonlan"],function(n){for(var r=e.WakeOnLanInfos||[],t=0,o=r.length;o>t;t++)n.send(r[t])})}function x(e,n){return(e||"").toLowerCase()==(n||"").toLowerCase()}function G(e,n,r,s,c,i){if(n>=e.length)return void v(i);var a=e[n],u=o.getServerAddress(r,a),d=!1,l=!1,f=V;return a==t.Local?(d=!0,f=8e3):a==t.Manual&&(x(u,r.LocalAddress)||x(u,r.RemoteAddress))&&(l=!0),l||!u?void G(e,n+1,r,s,c,i):void A(u,f).then(function(e){W(r,e,a,c,i)},function(){if(d){{1e4-((new Date).getTime()-s)}G(e,n+1,r,s,c,i)}else G(e,n+1,r,s,c,i)})}function W(e,n,r,t,o){var c=s.credentials();c.ConnectAccessToken?y(c).then(function(){e.ExchangeToken?M(e,r,c).then(function(){q(e,c,n,r,!0,t,o)},function(){q(e,c,n,r,!0,t,o)}):q(e,c,n,r,!0,t,o)}):q(e,c,n,r,!0,t,o)}function q(n,o,c,i,a,u,d){if(a&&n.AccessToken)return void D(n,i).then(function(){q(n,o,c,i,!1,u,d)});p(n,c),n.LastConnectionMode=i,u.updateDateLastAccessed!==!1&&(n.DateLastAccessed=(new Date).getTime(),n.LastConnectionMode==t.Local&&(n.DateLastLocalConnection=(new Date).getTime())),s.addOrUpdateServer(o.Servers,n),s.credentials(o);var l={Servers:[]};l.ApiClient=C(n,i),l.State=n.AccessToken?r.SignedIn:r.ServerSignIn,l.Servers.push(n),l.ApiClient.updateServerInfo(n,i),l.State==r.SignedIn&&L(l.ApiClient,u),d(l),e.trigger(J,"connected",[l])}function F(e){return e=e.trim(),0!=e.toLowerCase().indexOf("http")&&(e="http://"+e),e=e.replace("Http:","http:"),e=e.replace("Https:","https:")}function z(e,n){return n=e.cleanPassword(n),CryptoJS.MD5(n).toString()}function B(e){var n=s.credentials(),r=n.Servers.filter(function(n){return n.Id==e}),t=r.length?r[0]:null;t&&(t.DateLastLocalConnection=(new Date).getTime(),s.addOrUpdateServer(n.Servers,t),s.credentials(n))}var H,J=this,K=[],V=2e4;return J.connectUser=function(){return H},J.appVersion=function(){return i},J.capabilities=function(){return d},J.deviceId=function(){return u},J.credentialProvider=function(){return s},J.connectUserId=function(){return s.credentials().ConnectUserId},J.connectToken=function(){return s.credentials().ConnectAccessToken},J.getServerInfo=function(e){var n=s.credentials().Servers;return n.filter(function(n){return n.Id==e})[0]},J.getLastUsedServer=function(){var e=s.credentials().Servers;return e.sort(function(e,n){return(n.DateLastAccessed||0)-(e.DateLastAccessed||0)}),e.length?e[0]:null},J.getLastUsedApiClient=function(){var e=s.credentials().Servers;if(e.sort(function(e,n){return(n.DateLastAccessed||0)-(e.DateLastAccessed||0)}),!e.length)return null;var n=e[0];return C(n,n.LastConnectionMode)},J.addApiClient=function(n){K.push(n);var r=s.credentials().Servers.filter(function(e){return x(e.ManualAddress,n.serverAddress())||x(e.LocalAddress,n.serverAddress())||x(e.RemoteAddress,n.serverAddress())}),o=r.length?r[0]:{};if(o.DateLastAccessed=(new Date).getTime(),o.LastConnectionMode=t.Manual,o.LastConnectionMode==t.Local&&(o.DateLastLocalConnection=(new Date).getTime()),o.ManualAddress=n.serverAddress(),n.serverInfo(o),n.onAuthenticated=function(e,n){U(e,n,{},!0)},!r.length){var c=s.credentials();c.Servers=[o],s.credentials(c)}e.trigger(J,"apiclientcreated",[n]),o.Id||n.getPublicSystemInfo().then(function(e){var r=s.credentials();o.Id=e.Id,n.serverInfo(o),r.Servers=[o],s.credentials(r)})},J.clearData=function(){H=null;var e=s.credentials();e.ConnectAccessToken=null,e.ConnectUserId=null,e.Servers=[],s.credentials(e)},J.getOrCreateApiClient=function(e){var n=s.credentials(),r=n.Servers.filter(function(n){return x(n.Id,e)});if(!r.length)throw new Error("Server not found: "+e);var t=r[0];return C(t,t.LastConnectionMode)},J.user=function(e){return new Promise(function(n){function r(){var e=b(o);n({localUser:o,name:H?H.Name:o?o.Name:null,imageUrl:e.url,supportsImageParams:e.supportsParams})}function t(){e&&e.getCurrentUserId()?e.getCurrentUser().then(function(e){o=e,r()},r):r()}var o,c=s.credentials();!c.ConnectUserId||!c.ConnectAccessToken||e&&e.getCurrentUserId()?t():y(c).then(t,t)})},J.isLoggedIntoConnect=function(){return J.connectToken()&&J.connectUserId()?!0:!1},J.logout=function(){for(var n=[],r=0,t=K.length;t>r;r++){var o=K[r];o.accessToken()&&n.push(P(o))}return Promise.all(n).then(function(){for(var n=s.credentials(),r=n.Servers.filter(function(e){return"Guest"!=e.UserLinkType}),t=0,o=r.length;o>t;t++){var c=r[t];c.UserId=null,c.AccessToken=null,c.ExchangeToken=null;for(var i=c.Users||[],a=0,u=i.length;u>a;a++)i[a].IsSignedInOffline=!1}n.Servers=r,n.ConnectAccessToken=null,n.ConnectUserId=null,s.credentials(n),H&&(H=null,e.trigger(J,"connectusersignedout"))})},J.getSavedServers=function(){var e=s.credentials(),n=e.Servers.slice(0);return n.sort(function(e,n){return(n.DateLastAccessed||0)-(e.DateLastAccessed||0)}),n},J.getAvailableServers=function(){var e=s.credentials();return Promise.all([O(e),R()]).then(function(n){var r=n[0],t=n[1],o=e.Servers.slice(0);return f(o,t),f(o,r),o=j(o,r),o.sort(function(e,n){return(n.DateLastAccessed||0)-(e.DateLastAccessed||0)}),e.Servers=o,s.credentials(e),o})},J.connect=function(){return new Promise(function(e){J.getAvailableServers().then(function(n){J.connectToServers(n).then(function(n){e(n)})})})},J.getOffineResult=function(){},J.connectToServers=function(e){return new Promise(function(n){if(1==e.length)J.connectToServer(e[0]).then(function(e){e.State==r.Unavailable&&(e.State=null==e.ConnectUser?r.ConnectSignIn:r.ServerSelection),n(e)});else{var t=e.length?e[0]:null;t?J.connectToServer(t).then(function(t){n(t.State==r.SignedIn?t:{Servers:e,State:e.length||J.connectUser()?r.ServerSelection:r.ConnectSignIn,ConnectUser:J.connectUser()})}):n({Servers:e,State:e.length||J.connectUser()?r.ServerSelection:r.ConnectSignIn,ConnectUser:J.connectUser()})}})},J.connectToServer=function(e,n){return new Promise(function(r){var o=[];null!=e.LastConnectionMode,-1==o.indexOf(t.Manual)&&o.push(t.Manual),-1==o.indexOf(t.Local)&&o.push(t.Local),-1==o.indexOf(t.Remote)&&o.push(t.Remote),X(e);var s=(new Date).getTime();n=n||{},G(o,0,e,s,n,r)})},J.connectToAddress=function(e){return new Promise(function(n,r){function o(){v(n)}return e?(e=F(e),void A(e,V).then(function(r){var s={ManualAddress:e,LastConnectionMode:t.Manual};p(s,r),J.connectToServer(s).then(n,o)},o)):void r()})},J.loginToConnect=function(e,n){return new Promise(function(r,t){return e&&n?void require(["connectservice","cryptojs-md5"],function(o){var a=z(o,n);T({type:"POST",url:"https://connect.emby.media/service/user/authenticate",data:{nameOrEmail:e,password:a},dataType:"json",contentType:"application/x-www-form-urlencoded; charset=UTF-8",headers:{"X-Application":c+"/"+i}}).then(function(e){var n=s.credentials();n.ConnectAccessToken=e.AccessToken,n.ConnectUserId=e.User.Id,s.credentials(n),m(e.User),r(e)},t)}):void t()})},J.signupForConnect=function(e,n,r,t){return new Promise(function(o,s){return e&&n&&r?t?r!=t?void s({errorCode:"passwordmatch"}):void require(["connectservice","cryptojs-md5"],function(t){var a=z(t,r);T({type:"POST",url:"https://connect.emby.media/service/register",data:{email:e,userName:n,password:a},dataType:"json",contentType:"application/x-www-form-urlencoded; charset=UTF-8",headers:{"X-Application":c+"/"+i,"X-CONNECT-TOKEN":"CONNECT-REGISTER"}}).then(o,function(e){try{return e.json()}catch(n){s()}}).then(function(e){e&&e.Status&&s({errorCode:e.Status})},s)}):void s({errorCode:"passwordmatch"}):void s({errorCode:"invalidinput"})})},J.getApiClient=function(e){return e.ServerId&&(e=e.ServerId),K.filter(function(n){var r=n.serverInfo();return!r||r.Id==e})[0]},J.getUserInvitations=function(){var e=J.connectToken();if(!e)throw new Error("null connectToken");if(!J.connectUserId())throw new Error("null connectUserId");var n="https://connect.emby.media/service/servers?userId="+J.connectUserId()+"&status=Waiting";return T({type:"GET",url:n,dataType:"json",headers:{"X-Connect-UserToken":e,"X-Application":c+"/"+i}})},J.deleteServer=function(e){if(!e)throw new Error("null serverId");var n=s.credentials().Servers.filter(function(n){return n.Id==e});return n=n.length?n[0]:null,new Promise(function(r){function t(){var n=s.credentials();n.Servers=n.Servers.filter(function(n){return n.Id!=e}),s.credentials(n),r()}if(!n.ConnectServerId)return void t();var o=J.connectToken(),a=J.connectUserId();if(!o||!a)return void t();var u="https://connect.emby.media/service/serverAuthorizations?serverId="+n.ConnectServerId+"&userId="+a;T({type:"DELETE",url:u,headers:{"X-Connect-UserToken":o,"X-Application":c+"/"+i}}).then(t,t)})},J.rejectServer=function(e){var n=J.connectToken();if(!e)throw new Error("null serverId");if(!n)throw new Error("null connectToken");if(!J.connectUserId())throw new Error("null connectUserId");var r="https://connect.emby.media/service/serverAuthorizations?serverId="+e+"&userId="+J.connectUserId();return fetch(r,{method:"DELETE",headers:{"X-Connect-UserToken":n,"X-Application":c+"/"+i}})},J.acceptServer=function(e){var n=J.connectToken();if(!e)throw new Error("null serverId");if(!n)throw new Error("null connectToken");if(!J.connectUserId())throw new Error("null connectUserId");var r="https://connect.emby.media/service/ServerAuthorizations/accept?serverId="+e+"&userId="+J.connectUserId();return T({type:"GET",url:r,headers:{"X-Connect-UserToken":n,"X-Application":c+"/"+i}})},J.getRegistrationInfo=function(e,n){return J.getAvailableServers().then(function(r){var t=r.filter(function(e){return x(e.Id,n.serverInfo().Id)});if(!t.length)return{};var o=t[0];return o.DateLastLocalConnection?n.getRegistrationInfo(e):ApiClient.getJSON(ApiClient.getUrl("System/Endpoint")).then(function(r){return r.IsInNetwork?(B(o.Id),n.getRegistrationInfo(e)):{}})})},J};return{ConnectionState:r,ConnectionMode:t,ServerInfo:o,ConnectionManager:s}});