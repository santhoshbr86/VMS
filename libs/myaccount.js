/*
 *
   Version#: 3.14
	Modified On:2017.07.28
	v3.14 My-Scholastic new registration URL updates.
  Version#: 3.13
	Modified On:2017.07.14
	v3.13 OFE My-Scholastic registration url changes revert to support red modal until OFE set new var.
 Version#: 3.12
	Modified On:2017.07.10
	v3.12 OFE My-Scholastic registration url changes.
 Version#: 3.11
	Modified On:2017.07.07
	v3.11 CPT My-Scholastic post registration refresh fix.
  Version#: 3.10
	Modified On:2017.07.06
	v3.10 CPT My-Scholastic new forgot passowrd URL launching.
  Version#: 3.09
	Modified On:2017.06.30
	v3.09 CPT My-Scholastic registration launching changes from MA_show.
  Version#: 3.08
	Modified On:2017.06.30
	v3.08 CPT My-Scholastic registration URL added.
  Version#: 3.07
	Modified On:2017.06.29
	v3.07 My-Scholastic session validation and profile forward fix.
  Version#: 3.06
	Modified On:2017.06.27
	v3.06 Log Error details on My-Scholastic session validation.
   Version#: 3.05
	Modified On:2017.06.20
	v3.05 My-Scholastic session validation.
  Version#: 3.04
	Modified On:2017.06.13
	v3.04 Removed close button for myaccount.
  Version#: 3.03
	Modified On:2017.06.12
	v3.03 suppressing myaccount launching.
 Version#: 3.02
	Modified On:2017.06.05
	v3.02 Corrected typo in setRedirectToMyScholastic.
 Version#: 3.01
	Modified On:2017.05.26
	v3.01 Updated to My-Scholastic latest URLs from my-accounts to my-scholastic.
	Version#: 3.00
	Modified On:2017.05.26
	v3.00 QA Cut over to My-Scholastic from MyAccount.
	Version#: 2.04
	Modified On:2017.04.11
	v2.04 Updated to Myscholastic as modal included other file into universal js.
	Modified On:2017.04.07
	v2.03 Updated to Myscholastic as modal.
	Modified On: 2017.03.21
	v2.02 My Scholastic integration changes dev release 1.	
	Modified On: 2016.05.16
	v1.2 Sing out CORS fix added.
	v1.2 Forgot password direct modal launch added for DP.
	v1.3 Removed myaccount1 GenericSignin page references.
	v1.4 Sign Out link reference changed to open-AM or IAM signout API.
	Modified On: 2016.11.16
	v2.01 imgRoot changed to env specific from prod MA2.	
*/

var SPSConfig = function() {};
jQuery.extend(SPSConfig.prototype, {
init: function() {
	this.wrapperTop= "45px;";
},setWrapperTop: function(padding) {
	this.wrapperTop= padding+";";
},getWrapperTop: function() {
	return this.wrapperTop;
}
});
var spsConfig = new SPSConfig();spsConfig.init();



var DataSPS = function() {};
jQuery.extend(DataSPS.prototype, {
init: function() {
	this.myData = {};
	this.myData["-"] = ":)";
	
},addData: function(newKey,newValue) {
	this.myData[newKey] = newValue;
},getData: function(iKey) {
	if (iKey==undefined){
		return this.myData;
	}
	return this.myData[iKey];
}
});
var vData = new DataSPS();vData.init();


var ModalSPS = function() {};
jQuery.extend(ModalSPS.prototype, {   
init: function(spsId,successUrl,failureUrl,keyIndex,nonce,expirationTime,clientId,signature) {
	this.si = spsId;
	this.su = successUrl;
	this.fu =failureUrl;
	this.ki = keyIndex;
	this.n = nonce;
	this.et = expirationTime;
	this.ci = clientId;
	this.s = signature;	
	
	vModal.setSuccessURL(vModal.su);
	vModal.setFailureURL(vModal.fu);
	vModal.setSuccessCloseHook(vModal.defaultSuccessHook);	
	vModal.setFailureCloseHook(vModal.defaultFailureHook);	
},data: function(data) {
	this.d = data;
},setSuccessURL: function(url) {
	this.successURL = url;
},getSuccessURL: function() {
	return this.successURL;	
},setFailureURL: function(url) {
	this.failureURL = url;
},getFailureURL: function() {
	return this.failureURL;
},setSuccessCloseHook: function(hook) { 
	this.successCloseHook = hook;
},getSuccessCloseHook: function() { 
	return this.successCloseHook(); 	  
},setFailureCloseHook: function(hook) {
	this.failureCloseHook = hook;
},getFailureCloseHook: function() {
	return this.failureCloseHook(); 
},defaultSuccessHook: function(){
	location.href=this.getSuccessURL();
},defaultFailureHook: function(){
	location.href=this.getFailureURL();	
}
});
var vModal = new ModalSPS();

var imgRoot="https://myaccount.scholastic.com/content/universal/images/";
//var imgRoot=MYACCOUNT_HOST+'/content/universal/images/';

var GB_DONE = false, GB_HEIGHT = 707, GB_WIDTH = 400, GB_TOP = 132;
var maActiveTab, maDefaultStore, oc = (typeof oc != 'undefined') ? encodeURIComponent(oc) : '';
var rpType = (typeof srt != 'undefined') ? srt : '';
var sur = "";
var redirectFn = "";
var maNewActiveTab = "";
var appName = "";
var ibtsp = "";
var cac = "";
var sourceId = "";
var useRegistrationType = "";
var destpopup = "n";
var rpView = "";
var noGWT = "true";
var sul = "";
var sUCN = "";
var doMobile = "";
var preRegToken = "";
var iFrameSize=300;
var internalSize=100;
var existentTEUser="";
var isRedirectToMyScholastic = true; // To switch between myaccount and myscholastic
var isLaunchMyScholasticSignInAsModal = true;
var isLaunchMyScholasticRegAsModal = true;//To switch myscholastic modal or full page.
var isMyScholasticSessionActive = false;

function setMyScholasticLaunchAsModal(isModal) {
	if( isModal) {
		isLaunchMyScholasticSignInAsModal = true;
		isLaunchMyScholasticRegAsModal = true;
	} else {
		isLaunchMyScholasticSignInAsModal = false;
		isLaunchMyScholasticRegAsModal = false;
	}
}
function setMyScholasticLaunchOnlyRegAsModal(isModal) {
	if( isModal) {
		isLaunchMyScholasticRegAsModal = true;
	} else {
		isLaunchMyScholasticRegAsModal = false;
	}
}
function setMyScholasticLaunchOnlySignInAsModal(isModal) {
	if( isModal) {
		isLaunchMyScholasticSignInAsModal = true;
	} else {
		isLaunchMyScholasticSignInAsModal = false;
	}
}

function seRedirectToMyScholastic(isForwardToMyScholastic) {
	setRedirectToMyScholastic(isForwardToMyScholastic);
}
function setRedirectToMyScholastic(isForwardToMyScholastic) {
	//alert('Temporarily disabling MyAccount launching: isRedirectToMyScholastic:'+isRedirectToMyScholastic);

	if( isForwardToMyScholastic) {
		isRedirectToMyScholastic = true;
	} else {
		isRedirectToMyScholastic = false;
	}
}


function GB_show(url, height, width) {   
  var position = getPageSize();
  GB_HEIGHT = height || 400;
  GB_WIDTH = width || 400;
  if((!jQuery('#GB_overlay').length>0) || (!jQuery('#ma_wrapper').length>0)) {
	jQuery('#GB_overlay').remove();
	jQuery('#ma_wrapper').remove();
    jQuery(document.body).append("<div id='GB_overlay'></div><div id='ma_wrapper'></div>");
    GB_DONE = true;
  }
  hideSelectBoxes();
  maOverlay();
  jQuery("#GB_overlay").show();
  jQuery("#GB_frame").remove();
  if (isMobile2()){
	  jQuery("#ma_wrapper").append("<iframe id='GB_frame' name='GB_frame' frameborder='0' scrolling='yes' allowtransparency='true' width='660px;' height='10000px;' src='"+url+"'></iframe>"); 
  }else{
	  jQuery("#ma_wrapper").append("<iframe id='GB_frame' name='GB_frame' frameborder='0' scrolling='no' allowtransparency='true' width='1041px;' height='709' src='"+url+"'></iframe>");  
  }  
  GB_position();   
  jQuery("#ma_wrapper").show();
}

function GB_show2(url, height, width) {   
	var position = getPageSize();
  
  GB_HEIGHT = height || 400;
  GB_WIDTH = width || 400;
  if((!jQuery('#GB_overlay').length>0) || (!jQuery('#ma_wrapper').length>0)) {
	jQuery('#GB_overlay').remove();
	jQuery('#ma_wrapper').remove();

	if (isMobile2()){
		jQuery(document.body).prepend("<div id='GB_pagetop'></div>");
		jQuery(document.body).append("<div id='GB_overlay' style='height: 10000px;'></div><div id='ma_wrapper' style='width: "+position[0]+"px; height: 10000px;  left: 0px; top: 0px;'></div><a href='#' id='scrolltop_link' style='position:fixed; bottom:0px; right:0px; background:#666; z-index:1000003; font-size:36px; box-sizing: border-box; text-align:center; -webkit-border-top-left-radius: 10px; -webkit-border-top-right-radius: 10px; -moz-border-radius-topleft: 10px; -moz-border-radius-topright: 10px; border-top-left-radius: 10px; border-top-right-radius: 10px; color:#fff; text-decoration:none; font-family:Arial, sans-serif; padding:16px; display:none;'>&#9650;<br>TOP</a>");
	}else{	
	    jQuery(document.body).append("<div id='GB_overlay' style='height: 756px;'></div><div id='ma_wrapper' style='width: 1024px; height: 614px; left: 50%; margin-left: -512px;  top: "+spsConfig.getWrapperTop()+"'></div>");
	}
    GB_DONE = true;
  }
  hideSelectBoxes();
  maOverlay();
  jQuery("#GB_overlay").show();
  jQuery("#GB_frame").remove();
  if (isMobile2()){
      var wrapper = "<iframe id='GB_frame' name='GB_frame' frameborder='0' scrolling='yes' allowtransparency='true' width='"+position[0]+"px;' height='10000px;' src='"+url+"'></iframe>";
	  jQuery("#ma_wrapper").append(wrapper); 
  } else if(isRedirectToMyScholastic){
	  //jQuery("#ma_wrapper").append("<iframe id='GB_frame' name='GB_frame' frameborder='0' scrolling='no' allowtransparency='true' width='1024' height='709' src='"+url+"'></iframe>");  
  	  jQuery("#ma_wrapper").append("<body><div id='frameHolder'><div><img src='/universal/images/mysch-close.gif' alt='Close' height='25' width='65' style='width:21px;height:21px;position:absolute;top:0;right:0;' onclick='return myScholasticOnLoginClose();'/></div>");
		jQuery("#ma_wrapper").append("<iframe id='GB_frame' name='GB_frame' frameborder='0' scrolling='yes' allowtransparency='true' width='1024' height='709' src='"+url+"'></iframe>"); 
	  jQuery("#ma_wrapper").append("</div></body>");
  } else {
	  jQuery("#ma_wrapper").append("<iframe id='GB_frame' name='GB_frame' frameborder='0' scrolling='no' allowtransparency='true' width='1024' height='709' src='"+url+"'></iframe>");  
  } 
  jQuery("#ma_wrapper").show();
}

function GB_show3(url, height, width) {   
	var position = getPageSize();
  
  GB_HEIGHT = height || 400;
  GB_WIDTH = width || 400;
  if((!jQuery('#GB_overlay').length>0) || (!jQuery('#ma_wrapper').length>0)) {
	jQuery('#GB_overlay').remove();
	jQuery('#ma_wrapper').remove();

	if (isMobile2()){
		jQuery(document.body).prepend("<div id='GB_pagetop'></div>");
		jQuery(document.body).append("<div id='GB_overlay' style='height: 11000px;'></div><div id='ma_wrapper' style='width: "+position[0]+"px; height: 11000px;  left: 0px; top: 0px;'></div><a href='#' id='scrolltop_link' style='position:fixed; bottom:0px; right:0px; background:#666; z-index:1000003; font-size:36px; box-sizing: border-box; text-align:center; -webkit-border-top-left-radius: 10px; -webkit-border-top-right-radius: 10px; -moz-border-radius-topleft: 10px; -moz-border-radius-topright: 10px; border-top-left-radius: 10px; border-top-right-radius: 10px; color:#fff; text-decoration:none; font-family:Arial, sans-serif; padding:16px; display:none;'>&#9650;<br>TOP</a>");
	}else{	
	    jQuery(document.body).append("<div id='GB_overlay' style='height: 800px;'></div><div id='ma_wrapper' style='width: 1224px; height: 614px; left: 50%; margin-left: -512px;  top: "+spsConfig.getWrapperTop()+"'></div>");
	}
    GB_DONE = true;
  }
  hideSelectBoxes();
  maOverlay();
  jQuery("#GB_overlay").show();
  jQuery("#GB_frame").remove();
  if (isMobile2()){
      var wrapper = "<iframe id='GB_frame' name='GB_frame' frameborder='0' scrolling='yes' allowtransparency='true' width='"+position[0]+"px;' height='10000px;' src='"+url+"'></iframe>";
	  jQuery("#ma_wrapper").append(wrapper); 
  }else{
	  jQuery("#ma_wrapper").append("<iframe id='GB_frame' name='GB_frame' frameborder='0' scrolling='no' allowtransparency='true' width='1224' height='750' src='"+url+"'></iframe>");  
  }
  jQuery("#ma_wrapper").show();
}



function getSuccessRegistration() {
	return sur;
}
function resetSuccessRegistration() {
	sur = "";

}
function setSuccessRegistration() {
	sur = "sur";
}

function showMyProfileTab(){
	GB_hide("4");
	disableDestPopUp();
	MA_show();
}

function MA_show2() {
	
	if (appName=="ofe"){
		 doMobile="true";
	}
	if (isRedirectToMyScholastic) {
		//CPT is using MA_show() for registration UI launch, so lets redirect to RP_Show() for CPT registration.
		if (rpType=="lobf" || rpType=="dlobf"){
		//|| rpType=="loofe"){
				return RP_show2();
		} else {
			return launchMyScholastic();
		}
	}

	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
    }
	var url = MYACCOUNT_HOST + '/myaccount/MyAccount.htm';
	if (typeof maDefaultStore != "undefined") {
		url += maDefaultStore;
	}
	if (typeof rpView != "") {
		if (url.indexOf('?') != -1) { url += '&amp;v=' + rpView; }
		else { url += '?v=' + rpView; }		
		vData.addData("v",rpView);
	}	
	if (typeof rpType != "") {
		if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
		else { url += '?t=' + rpType; }	
		vData.addData("t",rpType);
	}
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }	
		vData.addData("oc",oc);
	}

	if (typeof sur != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sur=' + sur; }
		else { url += '?sur=' + sur; }
		vData.addData("sur",sur);
	}
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
		vData.addData("appName",appName);
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }
		vData.addData("sUCN",sUCN);
	}
	
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }		
		vData.addData("preRegToken",preRegToken);
	}
	
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }	
		vData.addData("doMobile",doMobile);
	}

	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '?ibtsp=' + ibtsp; }
		vData.addData("ibtsp",ibtsp);
	}
	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
		vData.addData("sourceId",sourceId);
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
		vData.addData("destpopup",destpopup);
	}
	
	if (typeof maNewActiveTab != "") {
		if (url.indexOf('?') != -1) { url += '&amp;at=' + maNewActiveTab; }
		else { url += '?at=' + maNewActiveTab; }		
		vData.addData("at",maNewActiveTab);
	}
	

	if (typeof existentTEUser != "") {
		if (url.indexOf('?') != -1) { url += '&amp;existentTEUser=' + existentTEUser; }
		else { url += '?existentTEUser=' + existentTEUser; }	
		vData.addData("existentTEUser",existentTEUser);
	}
	
	var type="w";
	if (isMobile2()){
		type="m";
	}
	//
	if (url.indexOf('?') != -1) { url += '&amp;size=' + type; }
	else { url += '?size=' + type; }		
	vData.addData("size",type);
	
	
	if (typeof maActiveTab != "undefined") {
		url +=  maActiveTab;
	}
	GB_show2(url,614,1024);		
	
	scrollOrigin();
	return false;	
}


function RP_show2() {

	
	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}

	if (isRedirectToMyScholastic) {
		//return showRegistrationPage();
		return launchMyScholasticRegistration();
	}
	
	var socialmedia="";
	
	var destiny="Default";
	vData.addData("rpType",rpType);
	if (rpType=="f"){
		 destiny="Face";
	}else if (rpType=="pr" || rpType=="lopr"){
		 destiny="Parent";
	}else if (rpType=="er" || rpType=="loer"){
		 destiny="Educator";
	}else if (rpType=="cpt"){
		 destiny="CPT";
	}else if (rpType=="ww"){
		 destiny="WW";		 
	}else if (rpType=="srss"){
		 destiny="srss";		 
	}else if (rpType=="sm"){
		 destiny="SocialMedia";	 
		 socialmedia = "";
	}else if (rpType=="ofe" || rpType=="loefe"){
		 doMobile="true";
		 destiny="OFE";
	}else if (rpType=="te" || rpType=="lote"){
		 destiny="te";		
	} else {
		destiny="Default";
	}
	
	var url =  MYACCOUNT_HOST + '/registration/'+destiny+'.htm?t=' + rpType + '&amp;oc=' + oc;		
	
	url = (typeof sur != 'undefined' && sur != '') ? url+ '&amp;sur=' + sur:url;
	vData.addData("sur",sur);
	url = (typeof appName != 'undefined' && appName != '') ?(url+'&amp;appName='+appName):url;
	vData.addData("appName",appName);
	url = (typeof sUCN != 'undefined' && sUCN != '') ?(url+'&amp;sUCN='+sUCN):url;
	vData.addData("sUCN",sUCN);
	url = (typeof preRegToken != 'undefined' && preRegToken != '') ?(url+'&amp;preRegToken='+preRegToken):url;
	vData.addData("preRegToken",preRegToken);
	url = (typeof doMobile != 'undefined' && doMobile != '') ?(url+'&amp;doMobile='+doMobile):url;
	vData.addData("doMobile",doMobile);
	url = (typeof ibtsp != 'undefined' && ibtsp != '') ?(url+'&amp;ibtsp='+ibtsp):url;
	vData.addData("ibtsp",ibtsp);
	url = (typeof sourceId != 'undefined' && sourceId != '') ?(url+'&amp;sourceId='+sourceId):url;
	vData.addData("sourceId",sourceId);
	url = (typeof cac != 'undefined' && cac != '') ? url+ '&amp;cac=' + cac:url;
	vData.addData("cac",cac);
	
	var size="w";
	if (isMobile2()){
		size="m";
	}

	url = (typeof cac != 'undefined' && size != '') ? url+ '&amp;size=' + size:url;
	vData.addData("size",size);
	
	
	url = url + socialmedia;//only for local DO NOT MOVE PROD
	GB_show2(url,614,1024);	
	scrollOrigin();
	return false;	
}


function MA_show() {
	
	if (noGWT=="true") {
		return MA_show2();
	}

	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
    }
	var url = MYACCOUNT_HOST + '/com.scholastic.myaccount.MyAccount/MyAccount.html';
	if (typeof maDefaultStore != "undefined") {
		url += maDefaultStore;
	}
	if (typeof rpView != "") {
		if (url.indexOf('?') != -1) { url += '&amp;v=' + rpView; }
		else { url += '?v=' + rpView; }		
	}	
	if (typeof rpType != "") {
		if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
		else { url += '?t=' + rpType; }		
	}
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }		
	}

	if (typeof sur != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sur=' + sur; }
		else { url += '?sur=' + sur; }		
	}
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }		
	}
	
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }		
	}
	
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }		
	}	

	
	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '?ibtsp=' + ibtsp; }		
	}
	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
	}
	
	if (typeof maNewActiveTab != "") {
		if (url.indexOf('?') != -1) { url += '&amp;at=' + maNewActiveTab; }
		else { url += '?at=' + maNewActiveTab; }		
	}
	if (typeof sul != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sul=' + sul; }
		else { url += '?sul=' + sul; }		
	}
	if (typeof maActiveTab != "undefined") {
		url +=  maActiveTab;
	}
	
	GB_show(url,614,1024);		

	return false;	
}



	
//To get parameter value from URL.	
function getURLParam(name)
    {
         var url = window.location.href;
         var query_string = url.split("?");
         var params = query_string[1].split("&");
         var i = 0;
          while (i < params.length) {
            // compare param name against arg passed in
            var param_item = params[i].split("=");
            if (param_item[0] == name) {
                // if they match, return the value
                return param_item[1];
            }
            i++;
        }
        return "";
    }
	

// To get hostname, example  https://my.scholastic.com

function extractDomain() {
    var domain;
    var url = window.location.href;
    
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
        port = url.split(':')[0];
        return port + "://" + domain;
       
    }
    else {
        domain = url.split('/')[0];
        return domain;
    }
    
}

function MA_showLoginForSSO() {
	if (isRedirectToMyScholastic) {	
		return launchMyScholastic();
	}
	//return MA_showScholasticPage();
	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}

	if (noGWT=="true") {
		return  MA_showLoginForSSO2();
	}
	var url = MYACCOUNT_HOST + '/com.scholastic.myaccount.MyAccount/MyAccount.html?sul=losso';
	
	if (typeof rpType != "") {
		if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
		else { url += '?t=' + rpType; }		
	}
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }		
	}
	if (typeof sur != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sur=' + sur; }
		else { url += '?sur=' + sur; }		
	}
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }		
	}
	
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }		
	}
	
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }		
	}	
	
	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '?ibtsp=' + ibtsp; }		
	}
	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
	}
	GB_show2(url,614,1024);	
	return false;	
}

function MA_showLoginForSSO2() {

	if (isRedirectToMyScholastic) {	
		return launchMyScholastic();
	}
	//return MA_showScholasticLoginPage();
	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}
	var url = MYACCOUNT_HOST + '/myaccount/MyAccount.htm?sul=losso';
	
	if (typeof rpType != "") {
		if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
		else { url += '?t=' + rpType; }		
	}
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }		
	}
	if (typeof sur != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sur=' + sur; }
		else { url += '?sur=' + sur; }		
	}
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }
	}
	
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }
	}
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }		
	}	
	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '?ibtsp=' + ibtsp; }		
	}
	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
	}
	GB_show2(url,614,1024);	
	return false;	
}

function MA_showLoginForSSON() {
	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}

	if (noGWT=="true") {
		return  MA_showLoginForSSON2();
	}
	var url = MYACCOUNT_HOST + '/com.scholastic.myaccount.MyAccount/MyAccount.html';
	
	if (typeof rpType != "") {
		if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
		else { url += '?t=' + rpType; }		
	}
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }		
	}
	if (typeof sur != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sur=' + sur; }
		else { url += '?sur=' + sur; }		
	}
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }		
	}
	
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }		
	}
	
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }		
	}	
	
	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '?ibtsp=' + ibtsp; }		
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
	}
	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
	}

	GB_show2(url,614,1024);	
	return false;	
}

function MA_showLoginForSSON2() {

	if (isRedirectToMyScholastic) {	
		return launchMyScholastic();
	}
	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}
	var url = MYACCOUNT_HOST + '/myaccount/MyAccount.htm';
	
	if (typeof rpType != "") {
		if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
		else { url += '?t=' + rpType; }		
	}
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }		
	}
	if (typeof sur != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sur=' + sur; }
		else { url += '?sur=' + sur; }		
	}
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }
	}	
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }
	}
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }		
	}	

	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '?ibtsp=' + ibtsp; }		
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
	}
	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
	}

	GB_show2(url,614,1024);	
	return false;	
}

function MA_showLoginGen() {
	if (isRedirectToMyScholastic) {	
		return launchMyScholastic();
	}
	//return MA_showScholasticPage();
	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}

	if (noGWT=="true") {
		return  MA_showLoginGen2();
	}
	var url = MYACCOUNT_HOST + '/com.scholastic.myaccount.MyAccount/MyAccount.html';
	
	if (typeof rpType != "") {
		if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
		else { url += '?t=' + rpType; }		
	}
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }		
	}
	if (typeof sur != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sur=' + sur; }
		else { url += '?sur=' + sur; }		
	}
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }		
	}
	
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }		
	}
	
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }		
	}	
	
	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '?ibtsp=' + ibtsp; }		
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
	}
	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
	}
	GB_show2(url,614,1024);	
	return false;	
}

function MA_showLoginGen2() {

	if (isRedirectToMyScholastic) {	
		return launchMyScholastic();
	}

	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}
	var url = MYACCOUNT_HOST + '/myaccount/MyAccount.htm';
	
	if (typeof rpType != "") {
		if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
		else { url += '?t=' + rpType; }		
	}
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }		
	}
	if (typeof sur != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sur=' + sur; }
		else { url += '?sur=' + sur; }		
	}
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }
	}
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }
	}
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }		
	}
	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '?ibtsp=' + ibtsp; }		
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
	}
	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
	}
	GB_show2(url,614,1024);	
	return false;	
}


function MA_useRegistrationType() {
	useRegistrationType = "true";
}

function MA_showLogin() {

	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}
	if (isRedirectToMyScholastic) {
		//return MA_showScholasticLoginPage();
		return launchMyScholastic();
	}	
	if (noGWT=="true") {
		return  MA_showLogin2();
	}	
	var url = MYACCOUNT_HOST + '/com.scholastic.myaccount.MyAccount/MyAccount.html';
	
	if (typeof useRegistrationType != "") {
		if(useRegistrationType == "true") {
			if (typeof rpType != "") {
				if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
				else { url += '?t=' + rpType; }		
			}
		} else {
			url += '?t=lo';
		}
	} else {
		url += '?t=lo';
	}
	
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }		
	}
	
	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '&ibtsp=' + ibtsp; }		
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
	}	
	
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }		
	}
	
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }		
	}	
	
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }		
	}	
	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
	}
	
	GB_show2(url,614,1024);	
	return false;	
}
function MA_showScholasticLoginPage() {
	
	if (isRedirectToMyScholastic) {		
		return launchMyScholastic();
	}
	if (appName=="ofe"){
		 doMobile="true";
	}
	if (document.domain.indexOf("scholastic") != -1) {
  		document.domain = "scholastic." + document.domain.split(".").pop();
   }

	//var url = NEW_MYACCOUNT_HOST + '/content_myaccount/transition/';
	var url = MY_SCHOLASTIC_HOST+'/my-accounts/';
	if (rpType=="fp"){
		url += 'ForgotPassword.html';
	}else if (rpView=="home"){
		url += 'Home.html';
	}else{
	  url += 'sign-in.html';
	}
	if (typeof maDefaultStore != "undefined") {
		url += maDefaultStore;
	}
	if (typeof rpView != "") {
		if (url.indexOf('?') != -1) { url += '&amp;v=' + rpView; }
		else { url += '?v=' + rpView; }		
		vData.addData("v",rpView);
	}	
	if (typeof rpType != "") {
		if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
		else { url += '?t=' + rpType; }	
		vData.addData("t",rpType);
	}
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }	
		vData.addData("oc",oc);
	}

	if (typeof sur != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sur=' + sur; }
		else { url += '?sur=' + sur; }
		vData.addData("sur",sur);
	}
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
		vData.addData("appName",appName);
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }
		vData.addData("sUCN",sUCN);
	}
	
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }		
		vData.addData("preRegToken",preRegToken);
	}
	
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }	
		vData.addData("doMobile",doMobile);
	}

	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '?ibtsp=' + ibtsp; }
		vData.addData("ibtsp",ibtsp);
	}
	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
		vData.addData("sourceId",sourceId);
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
		vData.addData("destpopup",destpopup);
	}
	
	if (typeof maNewActiveTab != "") {
		if (url.indexOf('?') != -1) { url += '&amp;at=' + maNewActiveTab; }
		else { url += '?at=' + maNewActiveTab; }		
		vData.addData("at",maNewActiveTab);
	}
	

	if (typeof existentTEUser != "") {
		if (url.indexOf('?') != -1) { url += '&amp;existentTEUser=' + existentTEUser; }
		else { url += '?existentTEUser=' + existentTEUser; }	
		vData.addData("existentTEUser",existentTEUser);
	}
	
	var type="w";
	if (isMobile2()){
		type="m";
	}
	//
	if (url.indexOf('?') != -1) { url += '&amp;size=' + type; }
	else { url += '?size=' + type; }		
	vData.addData("size",type);
	
	
	if (typeof maActiveTab != "undefined") {
		url +=  maActiveTab;
	}
   showScholasticPage(url);
	return false;	
}
function showScholasticPage(url){
	//debugger;
	var win = window.open(url, '_blank');
	  win.focus();
}

function MA_showLogin2() {

	if (isRedirectToMyScholastic) {	
		return launchMyScholastic();
	}
	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}
	
	var url = MYACCOUNT_HOST + '/myaccount/MyAccount.htm';
	
	if (typeof useRegistrationType != "") {
		if(useRegistrationType == "true") {
			if (typeof rpType != "") {
				if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
				else { url += '?t=' + rpType; }		
			}
		} else {
			url += '?t=lo';
		}
	} else {
		url += '?t=lo';
	}
	
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }		
	}
	
	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '&ibtsp=' + ibtsp; }		
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
	}	
	
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }
	}
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }
	}
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }		
	}	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
	}
	
	GB_show2(url,614,1024);	
	return false;	
}


function RP_show() {

	if (isRedirectToMyScholastic) {
		//return showRegistrationPage();
		return launchMyScholasticRegistration();
	}
	if (noGWT=="true") {
		return  RP_show2();
	}
	

	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}
	var url = (typeof rpType != 'undefined' && rpType != '') ? '/com.scholastic.registration.Registration/Registration.html?t=' + rpType + '&amp;oc=' + oc : '/com.scholastic.registration.Registration/Registration.html?oc=' + oc;		
	
	url = (typeof sur != 'undefined' && sur != '') ? url+ '&amp;sur=' + sur:url;
	url = (typeof appName != 'undefined' && appName != '') ?(url+'&amp;appName='+appName):url;
	url = (typeof sUCN != 'undefined' && sUCN != '') ?(url+'&amp;sUCN='+sUCN):url;
	url = (typeof preRegToken != 'undefined' && preRegToken != '') ?(url+'&amp;preRegToken='+preRegToken):url;
	url = (typeof doMobile != 'undefined' && doMobile != '') ?(url+'&amp;doMobile='+doMobile):url;
	url = (typeof ibtsp != 'undefined' && ibtsp != '') ?(url+'&amp;ibtsp='+ibtsp):url;
	url = (typeof sourceId != 'undefined' && sourceId != '') ?(url+'&amp;sourceId='+sourceId):url;
	url = (typeof cac != 'undefined' && cac != '') ? url+ '&amp;cac=' + cac:url;
	
	var uri = MYACCOUNT_HOST + url;
	GB_show2(uri,614,1024);	
	return false;	
}
 function showRegistrationPage(){

	 if (isRedirectToMyScholastic) {
		//return showRegistrationPage();
		return launchMyScholasticRegistration();
	}
	 if (document.domain.indexOf("scholastic") != -1) {
	   		document.domain = "scholastic." + document.domain.split(".").pop();
		}
		
		var socialmedia="";
		
		//var registrationPage="/register/educator-registration/role-select.html";
		var registrationPage = "";
		vData.addData("rpType",rpType);
		if (rpType=="f"){
			 registrationPage="Face";
		}else if (rpType=="pr" || rpType=="lopr"){
			 //registrationPage="Parent";
			registrationPage="/my-accounts/register/parent-registration/step3.html";
		}else if (rpType=="er" || rpType=="loer"){
			//registrationPage="Educator";
			registrationPage="/my-accounts/register/educator-registration/role-select.html";
		}else if (rpType=="cpt"){
			 registrationPage="CPT";
		}else if (rpType=="ww"){
			 registrationPage="WW";		 
		}else if (rpType=="srss"){
			 registrationPage="srss";		 
		}else if (rpType=="sm"){
			 registrationPage="SocialMedia";	 
			 socialmedia = "";
		}else if (rpType=="ofe" || rpType=="loefe"){
			 doMobile="true";
			 registrationPage="OFE";
		}else if (rpType=="te" || rpType=="lote"){
			 registrationPage="te";		
		} else {
			registrationPage="/my-accounts/register/educator-registration/role-select.html";
			//registrationPage="/my-accounts/register/educator-registration/tell-us.html";
		}
		//var url = NEW_MYACCOUNT_HOST + '/content_myaccount/transition/'+registrationPage+'.html?t=' + rpType + '&amp;oc=' + oc;	
		var url = MY_SCHOLASTIC_HOST+registrationPage+'?t=' + rpType + '&amp;oc=' + oc;
		//https://myaccounts-stage.scholastic.com/my-accounts/register/educator-registration/role-select.html
		 showScholasticPage(url);
 }

function MA_school() {

	setViewType("a");
	setActiveTab("AD");
	MA_show();
	
}



function setActiveTab(tabName) { 
	maActiveTab = "#" + tabName;
	maNewActiveTab = tabName; 
}

function setDefaultStore(storeID) { maDefaultStore = "?" + storeID; }
function setRegistrationType(type) {
	rpType = type; /* possible types are: c - clubs, ts - teacher store, lo - login only */
}
function setViewType(view) {
	rpView = view; /* possible types are: a - Face Ma2*/
}
function setSul(_type) {
	sul = _type; /* possible types are: a - Face Ma2*/
}
function setParentAppName(name) {
	appName = name; /* possible names are: cool - clubs*/
}
function setSchoolsUCN(sucn) {
	sUCN = sucn; 
}

function setPreRegToken(_preRegToken) {
	preRegToken = _preRegToken; 
}

function setMobile(_doMobile) {
	doMobile = _doMobile; 
}
function hideIBTSPPopUp() {
	ibtsp = 'y'; 
}
function showIBTSPPopUp() {
	ibtsp = 'n'; 
}
function setForgotPasswordView(type) {
	rpType = type; /* value should be:fp */
}


function setExistentTEUser(_existentTEUser) {
	existentTEUser = _existentTEUser; 
}

function setParentSourceId(inSourceId) {
	sourceId = inSourceId; /* possible names are: cool - clubs*/
}
function setCac(teacherCac) {
	cac = teacherCac;
}

var myAccoutCloseHook, onSignOutHook, onSuccessRegistration, onGenericSuccessRegistrationHook,onGenericSuccessLoginHook, shopForEbooksHook, shopForGradeEBooksHook, aboutUsHook, viewEBookDetailsHook,downloadeReaderHook,pciSuccessHook=null,pciFailureHook=null;
function setMyAccountCloseHook(hook){ myAccoutCloseHook = hook; }
function setOnSignOutHook(hook){ onSignOutHook = hook; }
function setOnSuccessRegistration(hook){ onSuccessRegistration = hook; }
function setOnGenericSuccessRegistrationHook(hook){ onGenericSuccessRegistrationHook = hook; }
function setOnGenericSuccessLoginHook(hook){ onGenericSuccessLoginHook = hook; }
function setShopForEBooksHook(hook){ shopForEbooksHook = hook; }
function setShopForGradeEBooksHook(hook){ shopForGradeEBooksHook = hook; }
function setAboutUsHook(hook){ aboutUsHook = hook; }
function setViewEBookDetailsHook(hook){ viewEBookDetailsHook = hook; }
function setDownloadeReaderHook(hook){ downloadeReaderHook = hook; }
function getDownloadeReaderHook(){ return downloadeReaderHook; }
function getPCISuccessHook(){ return pciSuccessHook; }
function getPCIFailureHook(){ return pciFailureHook; }
function setPCISuccessHook(hook){ pciSuccessHook=hook; }
function setPCIFailureHook(hook){ pciFailureHook=hook; }





function GB_hide(param) {

jQuery("#ma_wrapper,#GB_overlay").hide();
showSelectBoxes();
jQuery("#GB_frame").remove();
if (typeof nodisplay == "undefined") { chkLS(); }
if(eval(param) == "1") {
	if (myAccoutCloseHook != null) {
		setCloseHook(myAccoutCloseHook);
		setCompleteHook(myAccoutCloseHook);
	}
	SPS_MyAccount.invokeAddChildModel("COOL","");
}else if(eval(param) == "2") {

	if (myAccoutCloseHook != null) {
		setCloseHook(myAccoutCloseHook);
	}
	if (myAccoutCloseHook != null) {
		setCompleteHook(myAccoutCloseHook);
	}
	SPS_MyAccount.invokeBTSRedirect(appName,"");
}
else {

	if (myAccoutCloseHook != null) { myAccoutCloseHook(); }
}
}


function enableDestPopUp(){
var allowedDomain = false;

if ( location.hostname == 'www.scholastic.com' ) {
var path = location.pathname;
if ( path.indexOf('/home') == 0 || path.indexOf('/teachers') == 0 || path.indexOf('/parents') == 0 ) {
allowedDomain = true;
}
}
else if ( location.hostname == 'teacher.scholastic.com' ) {
allowedDomain = true;
}

if ( allowedDomain ) {
	setDestPopUpValue('y');
}
    
}


function disableDestPopUp(){
	setDestPopUpValue('n');
}

function getDestVar(){
	return destpopup;
}

function isDestEnabled(){
	return (('y'==destpopup)||(destpopup==''|| typeof destpopup=='undefined'));
}

function setDestPopUpValue(val){
	destpopup = val;
}

function setSSORegistrationComplete() {
	if(sur != '') {
		setRedirectFunction();
	}
}

function getRedirectFunction() {
	return redirectFn;
}
function setRedirectFunction() {
	redirectFn = "sso";
}

function resetRedirectFunction() {
	redirectFn = "";
}

function PostRegRedirect(param) {

jQuery("#ma_wrapper,#GB_overlay").hide();
showSelectBoxes();
jQuery("#GB_frame").remove();

	if(eval(param) == "1") {
		if (onSuccessRegistration != null) {
			setCloseHook(onSuccessRegistration);
			setCompleteHook(onSuccessRegistration);
		}
		SPS_MyAccount.invokeAddChildModel("COOL","");
	}else if(eval(param) == "2") {

		if (onSuccessRegistration != null) {
			setCloseHook(onSuccessRegistration);
			setCompleteHook(onSuccessRegistration);
		}
			//SPS_MyAccount.invokeBTSRedirect(appName,"");
	}else {
		if (onSuccessRegistration != null) {
			onSuccessRegistration(); 
		}
		if(onGenericSuccessRegistrationHook != null){
			onGenericSuccessRegistrationHook();
		}
	}
}



function GenericPostLoginRedirect(param) {
	  jQuery("#ma_wrapper,#GB_overlay").hide();
	  showSelectBoxes();
	  jQuery("#GB_frame").remove();

	  if(eval(param) == "1") {
			if (onGenericSuccessLoginHook != null) {
				setCloseHook(onGenericSuccessLoginHook);
				setCompleteHook(onGenericSuccessLoginHook);
			}
			SPS_MyAccount.invokeAddChildModel("COOL","");
		}else if(eval(param) == "2") {

			if (onGenericSuccessLoginHook != null) {
				setCloseHook(onGenericSuccessLoginHook);
				setCompleteHook(onGenericSuccessLoginHook);
			}
			SPS_MyAccount.invokeBTSRedirect(appName,"");
		}else {
	    if (onGenericSuccessLoginHook != null) { 
		  onGenericSuccessLoginHook(); 
	   }
	   }
}
	
function GenericPostRegRedirect() {
	  jQuery("#ma_wrapper,#GB_overlay").hide();
	  showSelectBoxes();
	  jQuery("#GB_frame").remove();
	  if (onGenericSuccessRegistrationHook!= null) { 
		  onGenericSuccessRegistrationHook(); 
	  }
	}

function RP_hide() { GenericPostRegRedirect(); }

function maOverlay() {  
  var arrayPageSize = getPageSize();
  var arrayPageScroll = getPageScroll();
  var h = arrayPageSize[1] + arrayPageScroll[1];
  if (h < (GB_HEIGHT + GB_TOP)) { h = GB_HEIGHT + GB_TOP + 10; }
  
  
  if (isMobile2()==false){
	jQuery("#GB_overlay").css({height: h + 'px'});
  }
  
}

function GB_position() {
  var de = document.documentElement;
  var w = self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
  jQuery("#ma_wrapper").css({width:GB_WIDTH+"px",height:GB_HEIGHT+"px",
    left: "22px",top: GB_TOP + "px"}); 
}

function getPageScroll(){

	var yScroll;

	if (self.pageYOffset) {
		yScroll = self.pageYOffset;
	} else if (document.documentElement && document.documentElement.scrollTop){	 // Explorer 6 Strict
		yScroll = document.documentElement.scrollTop;
	} else if (document.body) {// all other Explorers
		yScroll = document.body.scrollTop;
	}

	var arrayPageScroll = new Array('',yScroll) 
	return arrayPageScroll;
}



function showSelectBoxes(){
	var selects = document.getElementsByTagName("select");
	for (i = 0; i != selects.length; i++) { selects[i].style.visibility = "visible"; }
}

function hideSelectBoxes(){
	var selects = document.getElementsByTagName("select");
	for (i = 0; i != selects.length; i++) { selects[i].style.visibility = "hidden"; }
}

function displayPersonal() {
	personalText = "<strong>";
	if ( personal ) {
		var temp = unescape(personal).split('|');

		personalText += (temp[2].substring(0,15));
	}
	else personalText += "";
	personalText += "</strong>";
	document.getElementById("unPersonalized").innerHTML = personalText;
}
function updatePersonal(which) {
	personalText = "<strong>";
	if (which == 'lo')
	{
		personalText += "";
	}
	else {
		if ( readCookie('SPS_UD') != null && readCookie('SPS_UD') != "" ) {
			var temp = unescape(readCookie('SPS_UD')).split('|');
			var temp2 = temp[2];
			if (temp2.length <= 15) personalText += temp2;
			else personalText += temp[2].substring(0,15);
		}
		else personalText += "";
	}
	personalText += "</strong>";
	document.getElementById("unPersonalized").innerHTML = personalText;
}
function displaySignInOut() {
	if ( location.href.indexOf('/sps_my_account/accmgmt/GenericSignin.jsp') != -1 ) {
		return '<span id="sio"><a href="javascript:void(0);" onclick="return MA_showLogin();" id="uniNavSIO"><div>Sign in</div></a></span>';

	}
	else {
		if ( personal != null && personal != "" ) {
			return '<span id="sio"><a href="javascript:void(0);" onclick="maLogOut();return false;" id="uniNavSIO"><div>Sign Out</div></a></span>';
		}
		else {
			if ( (typeof schlKids == "undefined") || !schlKids ){
				//signinURL = SPS_HOST + '/sps_my_account/accmgmt/GenericSignin.jsp?finalSuccessURL=' + location.href;
				return '<span id="sio"><a href="javascript:void(0);" onclick="return MA_showLogin();" id="uniNavSIO"><div>Sign In</div></a></span>';
			} else {
				signinURL = DOTCOM_HOST + "/kidslogin";
				return '<span id="sio"><a href="' + signinURL + '" onclick="return MA_showLogin();" id="uniNavSIO"><div>Sign In</div></a></span>';
			}
		}
	}
}
function createCookie(name,value,days)
{
	if (days)
	{
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name + "="+value+expires+"; domain=scholastic." + document.domain.split(".").pop() + "; path=/";
}
function saveCookie(name, value) {
	var date = new Date();
	date.setTime(date.getTime() + (365*100*24*60*60*1000)); //setting persistance cookie for 100 years
	var expires = "; expires="+date.toGMTString();
	document.cookie = name + "="+value+expires+"; domain=scholastic." + document.domain.split(".").pop() + "; path=/";
}
function readCookie(name)
{

	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++)
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function eraseCookie(name) { createCookie(name,"",-1); }
function deleteCookie(name) { saveCookie(name,"",-1); }
function kookie(name,value,days){
if (days)
	{
		var date = new Date();
		date.setTime(date.getTime() + (365*100*24*60*60*1000)); //setting persistance cookie for 100 years
		var expires = "; expires="+date.toGMTString();
	}
else var expires = "";
document.cookie = name + "="+value+expires+"; domain=scholastic." + document.domain.split(".").pop() + "; path=/";
}
function removeHttpOnlyCookies(){
    jQuery.ajax(
		{
			//url:SPS_HOST+"/sps_my_account/accmgmt/deleteSpsHttpOnlyCookies.jsp",
			url:IAM_HOST+"/iam-signin/logout.jsp",
			jsonp: "callback",
    		dataType: "jsonp",    		
			success: function(result){
				 kookie("SPS_SESSION_SECURE",'',-1);
				 kookie("SPS_TSP_SECURE",'',-1);				
		}});
}

function maLogOut(){
	kookies = ['SPS_TSP','SPS_SESSION','SPS_UD','lithiumSSO:scholastic','prefCTR:scholastic','PR_SUB','SPS_BUS','XUS_EI',"SPS_SESSION_SECURE","SPS_TSP_SECURE"];
	for (var i = 0; i < kookies.length; i++) { kookie(kookies[i],'',-1); }
	if ( document.getElementById('sio') ) {
		document.getElementById("sio").innerHTML = '<a href="javascript:void(0);"  onclick="return MA_showLogin();" id="uniNavSIO"><div>Sign in</div></a>';
		updatePersonal('lo');
	}
	removeHttpOnlyCookies();
	if (onSignOutHook != null) { onSignOutHook(); }
}
function chkLS() {
	if ( document.getElementById('sio') ) {
		if ( location.href.indexOf('/sps_my_account/accmgmt/GenericSignin.jsp') != -1 ) {
			document.getElementById("sio").innerHTML = '<a href="javascript:void(0);" onclick="return MA_showLogin();" id="uniNavSIO"><div>Sign In</div></a>';

		}
		else {
			if ( readCookie('SPS_UD') != null && readCookie('SPS_UD') != "" ) {
				document.getElementById("sio").innerHTML = '<a href="javascript:void(0);" onclick="maLogOut();return false;" id="uniNavSIO"><div>Sign Out</div></a>';
			}
			else {
				if ( (typeof schlKids == "undefined") || !schlKids ) {
					//signinURL = SPS_HOST + '/sps_my_account/accmgmt/GenericSignin.jsp?finalSuccessURL=' + location.href;
					document.getElementById("sio").innerHTML = '<a href="javascript:void(0);" onclick="return MA_showLogin();" id="uniNavSIO"><div>Sign in</div></a>';
				}else {
					signinURL = DOTCOM_HOST + "/kidslogin";
					document.getElementById("sio").innerHTML = '<a href="' + signinURL + '" onclick="return MA_showLogin();" id="uniNavSIO"><div>Sign in</div></a>';
				}
			}
			
		}
		updatePersonal();
	}
}

function shopForEBooks1(){

                if (shopForEbooksHook != null) { 
                                shopForEbooksHook(); 
                } else {
                                window.location = SCHWS_HOST + "/SchWS/link2COOL.jsp";
                }
}
function shopForEBooks(){
	if (shopForEbooksHook != null) { 
		shopForEbooksHook(); 
	} else {
	        window.location = SCHWS_HOST + "/SchWS/link2COOL.jsp";		
	}
}

function shopForGradeEBooks(grade){
	
	if (shopForGradeEBooksHook != null) { 
		shopForGradeEBooksHook(grade); 
	} else {
	        window.location = SCHWS_HOST + "/SchWS/link2COOL.jsp";		
	}	
}

function AboutUs(){

	if (aboutUsHook != null) { 
		aboutUsHook(); 
	} else {
	        window.location = SCHWS_HOST + "/SchWS/link2COOL.jsp";		
	}	
}
function viewEBookDetails(isbn){

	if (viewEBookDetailsHook != null) { 
		viewEBookDetailsHook(isbn); 
	} else {
	        window.location = SCHWS_HOST + "/SchWS/link2COOL.jsp";		
	}	
}

function downloadeReader(agent){

	if (downloadeReaderHook != null) { 
		downloadeReaderHook(agent); 
	} else {
	        window.location = SCHWS_HOST + "/SchWS/link2COOL.jsp";		
	}	
}

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable) return pair[1];
	}
}

var ua = navigator.userAgent.toLowerCase();
var isMobile = /ipad/i.test(ua) || /iphone/i.test(ua) || /ipod/i.test(ua)||/silk/i.test(ua)||/android/i.test(ua);
      if (isMobile2("true")){
		document.writeln('<style>#GB_overlay { background-image: url(' + imgRoot + 'overlay.png);position: absolute;margin: auto;top: 0;left: 0;z-index:  1000002;width:  100%;height: 100%;} * html #GB_overlay {background-color: #000;background-color: transparent;background-image: url(' + imgRoot + 'blank.gif);filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + imgRoot + 'overlay.png", sizingMethod="scale");} ');
		document.writeln("#ma_wrapper {top: 0px;left: 0px;position: absolute;overflow: auto;z-index:  1000003; -webkit-overflow-scrolling: touch; overflow-y: scroll; } ");
		document.writeln('#readingManagerFrame {overflow:auto}</style>');
	}else{
		document.writeln('<style>#GB_overlay { background-image: url(' + imgRoot + 'overlay.png);position: absolute;margin: auto;top: 0;left: 0;z-index:  1000002;width:  100%;height: 100%;} * html #GB_overlay {background-color: #000;background-color: transparent;background-image: url(' + imgRoot + 'blank.gif);filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + imgRoot + 'overlay.png", sizingMethod="scale");} ');
		document.writeln('#ma_wrapper {top: 10px;left: 0px;position: absolute;overflow: hidden;z-index:  1000003;width: 1044px;height: 614px;} #GB_frame {border: 0;margin: 0;overflow: hidden;width: 1046px;height: 614px;}</style>');
	}



function invokePasswordReset(appType,token){
	var afterHook = function (){
		location.href = parent.SPS_MyAccount.parameter;
	};
	setCloseHook(afterHook);
	var onComplete = function(){
		location.href = parent.SPS_MyAccount.parameter;
	};
	setCompleteHook(onComplete);
	SPS_MyAccount.allowMobile=true;
	SPS_MyAccount.invokePasswordResetModel(appType,token);
}

function invokePasswordResetPCI(appType,token){
	var onComplete = function(){
		location.href = parent.SPS_MyAccount.parameter;
	};
	
	vModal.init("","","","","","","","",token);
	vModal.setSuccessCloseHook(onComplete);
	vModal.setFailureCloseHook(onComplete);
	PWD_show();
	
}


function invokeSRSS(token){
	var afterHook = function (){
	
	};
	setCloseHook(afterHook);
	var onComplete = function(){

	};
	setCompleteHook(onComplete);
	SPS_MyAccount.invokeSRSSModel(token);
}

var RegistrationModalController =
{
	PARENT_TYPE: 'pr',
	EDUCATOR_TYPE: 'er',
	QUERY_PARAM: 'regtype',
	show: function()
	{
		var regType = this.getRegistrationType();
		if (document.domain.indexOf("scholastic") != -1) {
			document.domain = "scholastic." + document.domain.split(".").pop();
		}		
		resetSuccessRegistration();
        setRegistrationType(regType);
        RP_show();
        window.scrollTo(0, 0);
	},
	getRegistrationType: function()
	{
		var regType = "";
		if(getQueryVariable(this.QUERY_PARAM) == this.PARENT_TYPE)
		{
			regType = this.PARENT_TYPE;
		}
		else if(getQueryVariable(this.QUERY_PARAM) == this.EDUCATOR_TYPE)
		{
			regType = this.EDUCATOR_TYPE;
		}
		return regType;
	}
};




jQuery(function(){
	if (getQueryVariable("spsmodal")=='pwdreset') {
		if (document.domain.indexOf("scholastic") != -1) {
			document.domain = "scholastic." + document.domain.split(".").pop();
		}
		invokePasswordReset('pr', getQueryVariable('token'));
	}
	else if (getQueryVariable("spsmodal")=='pwdreset2') {
		if (document.domain.indexOf("scholastic") != -1) {
			document.domain = "scholastic." + document.domain.split(".").pop();
		}

		var successURL=  getQueryVariable('successURL');
		vModal.init(getQueryVariable('spsId'),getQueryVariable('successURL'),getQueryVariable('failureURL'),getQueryVariable('keyIndex'),getQueryVariable('nonce'),getQueryVariable('expirationTime'),getQueryVariable('clientId'),getQueryVariable('signature'));
		vModal.data(getQueryVariable('data'));
		vModal.setSuccessURL(successURL);
		vModal.setFailureURL(successURL);
		vModal.setSuccessCloseHook(vModal.defaultSuccessHook);
		vModal.setFailureCloseHook(vModal.defaultFailureHook);
		
		
		
		PWD_show();
	}
    else if (getQueryVariable("registration")=='y') {
		RegistrationModalController.show();
	}
	 else if(getQueryVariable("myaccount")=="y" ){
			 if ( location.hash == '#atdone' ) return;
	
			if(document.domain.indexOf("scholastic")!=-1){
				document.domain="scholastic."+document.domain.split(".").pop();
			}
			if( getQueryVariable("at") != ""){
				setActiveTab(getQueryVariable("at"));
			}
			
			location.hash='#atdone';
			MA_show2();
	 }
	 else if(getQueryVariable("teregistration")=="y" ){
		 teregistration();		
 }
	 else if (getQueryVariable("spsmodal")=='srss') {
			if (document.domain.indexOf("scholastic") != -1) {
				document.domain = "scholastic." + document.domain.split(".").pop();
			}
			rpType="srss";
			preRegToken=getQueryVariable('preRegToken');
			RP_show2();
		}
	else if(getQueryVariable("t")=="fp" ){
			
			if(document.domain.indexOf("scholastic")!=-1){
				document.domain="scholastic."+document.domain.split(".").pop();
			}			
			setForgotPasswordView("fp");
			MA_show2();
	 }
			  
});



var myLocalFunctionMAClose = function(){
	alert("myLocalFunctionMAClose in myaccount.ss");
			//location.href="http://store.scholastic.com/shop/Teaching+Resources/4502~4518~15";
			
	};

function teregistration(){
	 if ( location.hash == '#atdone' ) return;

		if(document.domain.indexOf("scholastic")!=-1){
			document.domain="scholastic."+document.domain.split(".").pop();
		}
		if( getQueryVariable("type") != ""){
			rpType=getQueryVariable("type");
		}
		preRegToken=getQueryVariable('preRegToken');
		location.hash='#atdone';
		if(rpType == 'te'){
			RP_show2();
		}
		else if (rpType == 'teexist')
		{
			MA_show2();
		}
};

jQuery.fn.isMobile = function (fnc) {
	try {
		if(/Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo|plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(navigator.userAgent)) {
	     return true;
	    };
	    return false;
	 } catch(e){ console.log("Error in isMobile"); return false; }
};
function isMobile2(force) {
	
	if (doMobile!="true" && force!="true"){
		return false;
	}

	try {
	     if(/iPad/i.test(navigator.userAgent)) {
	    	 return false;
	    }else {
	    }
	 } catch(e){ }
	var position=getPageSize();
	if (position[2]>660){
		return false;
	}else{
		return true;
	}
	


	  
	 
};

/*    JANRAIN CHANGES   */


function silentClose() {
       jQuery("#ma_wrapper,#GB_overlay").hide();
       showSelectBoxes();
       jQuery("#GB_frame").remove();
}

function MA_SocialMedia(socialMediaURLParams) {

       if (document.domain.indexOf("scholastic") != -1) {
              document.domain = "scholastic." + document.domain.split(".").pop();
    }
       var url = MYACCOUNT_HOST + socialMediaURLParams;
       GB_position(); 
       GB_show2(encodeURI(url),614,1024);       

       return false; 
}




function MA_ShowPostSocialLogin() {      
	if (onSuccessRegistration != null) {
		onSuccessRegistration();
	}
}

/*   ENDS JANRAIN CHANGES   */

function MA_showLoginOFE() {
	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}
	if (noGWT=="true") {
		return  MA_showLogin2();
	}	
	var url = MYACCOUNT_HOST + '/com.scholastic.myaccount.MyAccount/MyAccount.html';
	
	if (typeof useRegistrationType != "") {
		if(useRegistrationType == "true") {
			if (typeof rpType != "") {
				if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
				else { url += '?t=' + rpType; }		
			}
		} else {
			url += '?t=lo';
		}
	} else {
		url += '?t=lo';
	}
	
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }		
	}
	
	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '&ibtsp=' + ibtsp; }		
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
	}	
	
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
	}
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }		
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }
	}
	
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }
	}	
	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
	}
	
	GB_show(url,614,1024);	
	return false;	
}


function MA_showLogin2OFE() {
	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}
	
	var url = MYACCOUNT_HOST + '/myaccount/MyAccount.htm';
	
	if (typeof useRegistrationType != "") {
		if(useRegistrationType == "true") {
			if (typeof rpType != "") {
				if (url.indexOf('?') != -1) { url += '&amp;t=' + rpType; }
				else { url += '?t=' + rpType; }		
			}
		} else {
			url += '?t=ofe';
		}
	} else {
		url += '?t=ofe';
	}
	
	if (typeof oc != "") {
		if (url.indexOf('?') != -1) { url += '&amp;oc=' + oc; }
		else { url += '?oc=' + oc; }		
	}
	
	if (typeof ibtsp != "") {
		if (url.indexOf('?') != -1) { url += '&amp;ibtsp=' + ibtsp; }
		else { url += '&ibtsp=' + ibtsp; }		
	}
	
	if(typeof destpopup != ""){
		if (url.indexOf('?') != -1) { url += '&amp;destpopup=' + destpopup; }
		else { url += '?destpopup=' + destpopup; }		
	}	
	
	if (typeof appName != "") {
		if (url.indexOf('?') != -1) { url += '&amp;appName=' + appName; }
		else { url += '?appName=' + appName; }		
	}
	if (typeof doMobile != "") {
		if (url.indexOf('?') != -1) { url += '&amp;doMobile=' + doMobile; }
		else { url += '?doMobile=' + doMobile; }		
	}
	if (typeof sUCN != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sUCN=' + sUCN; }
		else { url += '?sUCN=' + sUCN; }
	}	
	if (typeof preRegToken != "") {
		if (url.indexOf('?') != -1) { url += '&amp;preRegToken=' + preRegToken; }
		else { url += '?preRegToken=' + preRegToken; }
	}
	
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { url += '&amp;sourceId=' + sourceId; }
		else { url += '?sourceId=' + sourceId; }		
	}
	
	GB_show2(url,614,1024);	
	return false;	
};


function ebooksShow(url, height, width) {   
	  GB_HEIGHT = height || 400;
	  GB_WIDTH = width || 400;
	  if((!jQuery('#ma_wrapper1').length>0)) {
		jQuery('#ma_wrapper1').remove();
	    jQuery(document.body).append("<div id='ma_wrapper1' style='width: 100%; height: 100%; position: fixed; display:none; '></div>");
	    GB_DONE = true;
	  }
	  hideSelectBoxes();
	  maOverlay();
	  jQuery("#GB_frame1").remove();
	  jQuery("#ma_wrapper1").append("<iframe id='GB_frame1' name='GB_frame1' frameborder='0' scrolling='no' allowtransparency='true' width='100%' height='100%' src='"+url+"'></iframe>");  
	  GB_position();   
	  jQuery("#ma_wrapper1").show();
	}

function getPageSize(){
	var pageHeight, pageWidth, xScroll, yScroll;
	var  bodyOffsetHeight= 0;
	var bodyScrollHeight=0;
	var bodyOffsetWidth=0;
	var bodyOffsetHeight=0;
	if (document.body){
		bodyOffsetHeight = document.body.offsetHeight;
		bodyScrollHeight = document.body.scrollHeight;
		bodyOffsetWidth = document.body.offsetWidth;
		bodyOffsetHeight = document.body.offsetHeight;
	
	}
	if (window.innerHeight && window.scrollMaxY) {	
		xScroll = document.body.scrollWidth;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if ( bodyScrollHeight> bodyOffsetHeight ){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = bodyOffsetWidth;
		yScroll = bodyOffsetHeight;
	}
	
	
	
	var windowWidth, windowHeight;
	if (self.innerHeight) {	// all except Explorer
		windowWidth = self.innerWidth;
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}	
	
	if(yScroll < windowHeight){ pageHeight = windowHeight; }
	else { pageHeight = yScroll; }

	if(xScroll < windowWidth){ pageWidth = windowWidth; }
	else { pageWidth = xScroll; }
	
	var height = jQuery(this).height(),
    w  = jQuery(this).width();

	window.devicePixelRatio = window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI;
	
	var r = w / window.devicePixelRatio;

	var arrayPageSize = new Array(pageWidth,pageHeight,r,windowHeight);
	return arrayPageSize;
}


function topIframe(){
	jQuery('html, body').animate({scrollTop: (jQuery('#GB_pagetop').offset().top)},500);
}




function sso(param){
	if (param ==undefined ){
		param ="";
	}
	window.location = TE_SSO+"?dpopup="+param; 
	GB_hide("");
}

function tso(param){
	if (param ==undefined ){
		param ="";
	}
	window.location =  TE_TSO+"?dpopup="+param ;
	GB_hide("");
}


function fly(){
		window.location = TE_FLY;
		GB_hide("");
}


function mydownloadEmpty(redirectTo){
	window.location = redirectTo;
	GB_hide("");
}

function launchMyScholasticPassowrdReset() {

	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}
	
	
	var url =  MY_SCHOLASTIC_HOST+'/my-accounts/sign-in/reset-password.html?';
	
	url = (typeof sur != 'undefined' && sur != '') ? url+ '&amp;sur=' + sur:url;
	url = (typeof appName != 'undefined' && appName != '') ?(url+'&appName='+appName):url;
	url = (typeof sUCN != 'undefined' && sUCN != '') ?(url+'&amp;sUCN='+sUCN):url;
	url = (typeof preRegToken != 'undefined' && preRegToken != '') ?(url+'&amp;preRegToken='+preRegToken):url;
	url = (typeof doMobile != 'undefined' && doMobile != '') ?(url+'&amp;doMobile='+doMobile):url;
	url = (typeof ibtsp != 'undefined' && ibtsp != '') ?(url+'&ibtsp='+ibtsp):url;
	url = (typeof sourceId != 'undefined' && sourceId != '') ?(url+'&amp;sourceId='+sourceId):url;
	url = (typeof cac != 'undefined' && cac != '') ? url+ '&amp;cac=' + cac:url;
	
	if (rpType=="ofe" && location.protocol=="http:"){
		url=url.replace("https:","http:");		
	}
	var size="w";
	url = (typeof cac != 'undefined' && size != '') ? url+ '&size=' + size:url;
	
	GB_showP(url,614,1024);	
//	scrollOrigin();
	return false;	
}


function PWD_show() {

	if (isRedirectToMyScholastic) {
		//return MA_showScholasticLoginPage();
		return launchMyScholasticPassowrdReset();
	}

	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}
	
	
	
	var url =  MYACCOUNT_HOST + '/myaccount/'+"PwdReset.htm?";		
	
	url = (typeof sur != 'undefined' && sur != '') ? url+ '&amp;sur=' + sur:url;
	url = (typeof appName != 'undefined' && appName != '') ?(url+'&appName='+appName):url;
	url = (typeof sUCN != 'undefined' && sUCN != '') ?(url+'&amp;sUCN='+sUCN):url;
	url = (typeof preRegToken != 'undefined' && preRegToken != '') ?(url+'&amp;preRegToken='+preRegToken):url;
	url = (typeof doMobile != 'undefined' && doMobile != '') ?(url+'&amp;doMobile='+doMobile):url;
	url = (typeof ibtsp != 'undefined' && ibtsp != '') ?(url+'&ibtsp='+ibtsp):url;
	url = (typeof sourceId != 'undefined' && sourceId != '') ?(url+'&amp;sourceId='+sourceId):url;
	url = (typeof cac != 'undefined' && cac != '') ? url+ '&amp;cac=' + cac:url;
	
	if (rpType=="ofe" && location.protocol=="http:"){
		url=url.replace("https:","http:");
		
	}
	

	var size="w";
	

	url = (typeof cac != 'undefined' && size != '') ? url+ '&size=' + size:url;

	
	
	GB_showP(url,614,1024);	
//	scrollOrigin();
	return false;	
}


function GB_showP(url, height, width) {   
	var position = getPageSize();
  
  GB_HEIGHT = height || 400;
  GB_WIDTH = width || 400;
  if((!jQuery('#GB_overlay').length>0) || (!jQuery('#ma_wrapper').length>0)) {
	jQuery('#GB_overlay').remove();
	jQuery('#ma_wrapper').remove();
      

	if (isMobile2()){
		jQuery(document.body).prepend("<div id='GB_pagetop'></div>");
		jQuery(document.body).append("<div id='GB_overlay' style='height: 10000px;'></div><div id='ma_wrapper' style='width: "+position[0]+"px; height: 10000px;  left: 0px; top: 0px;'></div><a href='#' id='scrolltop_link' style='position:fixed; bottom:0px; right:0px; background:#666; z-index:1000003; font-size:36px; box-sizing: border-box; text-align:center; -webkit-border-top-left-radius: 10px; -webkit-border-top-right-radius: 10px; -moz-border-radius-topleft: 10px; -moz-border-radius-topright: 10px; border-top-left-radius: 10px; border-top-right-radius: 10px; color:#fff; text-decoration:none; font-family:Arial, sans-serif; padding:16px; display:none;'>&#9650;<br>TOP</a>");
	
		
	}else{	
	    jQuery(document.body).append("<div id='GB_overlay' style='height: 756px;'></div><div id='ma_wrapper' style='width: 1024px; height: 614px; left: 50%; margin-left: -512px;  top: 45px;'></div>");
	}
    GB_DONE = true;
  }
  hideSelectBoxes();
  maOverlay();
  jQuery("#GB_overlay").show();
  jQuery("#GB_frame").remove();
  if(isLaunchMyScholasticSignInAsModal && isRedirectToMyScholastic) {
	   //jQuery("#ma_wrapper").append("<body><div id='frameHolder'><div><img src='images/mysch-close.gif' alt='Close' height='25' width='65' class='my-scholastic-close-btn' onclick='return myScholasticOnLoginClose();'/></div>");
		//jQuery("#ma_wrapper").append("<iframe id='GB_frame' name='GB_frame' frameborder='0' scrolling='yes' allowtransparency='true' width='1024' height='709' src='"+url+"'></iframe>"); 
	  //jQuery("#ma_wrapper").append("</div></body>");
	  jQuery("#ma_wrapper").append("<iframe id='GB_frame' name='GB_frame' frameborder='0' scrolling='no' allowtransparency='true' width='1024' height='709' src='"+url+"'></iframe>"); 
	  jQuery("#ma_wrapper").show();
  } else {
	   jQuery("#ma_wrapper").append("<iframe id='GB_frame' name='GB_frame' frameborder='0' scrolling='no' allowtransparency='true' width='1024' height='709'></iframe>"); 
	  jQuery("#ma_wrapper").show();
	  var form=jQuery("<form style='display:none;'>").attr({
	    method: "post",
	    action: url,
	    target: "GB_frame"
	});
	form.append(jQuery("<input/>").attr({name:"si",value:vModal.si}));
	form.append(jQuery("<input/>").attr({name:"su",value:vModal.su}));
	form.append(jQuery("<input/>").attr({name:"fu",value:vModal.fu}));
	form.append(jQuery("<input/>").attr({name:"ki",value:vModal.ki}));
	form.append(jQuery("<input/>").attr({name:"n",value:vModal.n}));
	form.append(jQuery("<input/>").attr({name:"et",value:vModal.et}));
	form.append(jQuery("<input/>").attr({name:"ci",value:vModal.ci}));
	form.append(jQuery("<input/>").attr({name:"s",value:vModal.s}));
	
	if (vModal.d){
		form.append(jQuery("<input/>").attr({name:"d",value:vModal.d}));	
	} 
	
	jQuery("body").append(form);
	form.submit();
}
  
}


function scrollOrigin() {
    window.scrollTo(0, 0);
}


function launchMyScholastic() {	
	
	if (appName=="ofe"){
		 doMobile="true";
	}	

	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
    }
	var url = MY_SCHOLASTIC_HOST + '/my-scholastic/';

	//checkMyScholasticUserSession();
	if (rpType=="fp" || rpView=="fp"){
		if(appName == "CPT") {
			url += 'register/book-fair-user/forgot-password.html';			
		} else {
			url += 'sign-in/forgot-password.html';
		}
	} else if (rpType=="fe" || rpView == "fe" ){
		url += 'sign-in/forgot-email.html';
	} else if (rpView=="FaceAddOrg" || rpType=="FaceAddOrg"){
		url += 'register/partner/add-organization.html?appUserType=30';
	} else if (rpView=="WWAddOrg" || rpType=="WWAddOrg"){
		url += 'register/partner/add-organization.html?appUserType=31';
	} else {
		checkMyScholasticUserSessionAndLaunch(url);	
		return;
	}
	
	if(isLaunchMyScholasticSignInAsModal){
		GB_show2(url,700,1024);	//614x1024. Lauch it as a modal.
		scrollOrigin();
	} else {
		showScholasticPage(url);
	}
	
	return false;	
}


function launchMyScholasticRegistration() {

	if (document.domain.indexOf("scholastic") != -1) {
   		document.domain = "scholastic." + document.domain.split(".").pop();
	}
	
	var socialmedia="";
	var url =  MY_SCHOLASTIC_HOST + '/my-scholastic/register/';
	
	//var destiny="educator-registration/role-select";
	vData.addData("rpType",rpType);

	if (rpType=="parentReg" || rpType=="pr" || rpType=="lopr"){
		 url += "basic-information.html";//"Parent registration";
	}else if (rpType=="eduReg" || rpType=="er" || rpType=="loer"){
		 url += "basic-information.html";//"Educator Registration";
	}else if (rpType=="adminReg"){
		 url += "basic-information.html";//"Administrator Registration";
	}else if (rpType=="faceNonEduReg" || rpType=="f"){
		 url += "partner.html?appUserType=30&persona=noneducator";
	}else if (rpType=="faceEduReg"){
		 url += "partner.html?appUserType=30&persona=educator"; 
	}else if (rpType=="wwNonEduReg" || rpType=="f"){
		 url += "partner.html?appUserType=31&persona=noneducator";
	}else if (rpType=="wwEduReg"){
		 url += "partner.html?appUserType=31&persona=educator"; 
	}else if (rpType=="lobf" || rpType=="dlobf"){
		 url += "book-fair-user/book-fair-registration.html";
	}else if (rpType=="loofe"){
		 url += "book-fair-user/book-fair-registration.html?sUCN="+sUCN;
	}else { //Default Reg page.
		url += "basic-information.html";
	}
	//append source id
	if (typeof sourceId != "") {
		if (url.indexOf('?') != -1) { 
			url += '&amp;sourceId=' + sourceId;
		}else {
			url += '?sourceId=' + sourceId;
		}
	}
	
	var size="w";
	if (isMobile2()){
		size="m";
	}
	vData.addData("size",size);

	if(isLaunchMyScholasticRegAsModal){	
		GB_show2(url,700,1024);	//614x1024
		scrollOrigin();
	} else {
		showScholasticPage(url);
	}
	return false;	
}

function my_close() {

	 //prompt('are you sure to close this window?');
	 if(onGenericSuccessRegistrationHook != null) {
		return onGenericSuccessRegistrationHook();
	 } else if( myAccoutCloseHook != null) {
		return myAccoutCloseHook();
	 } else if( onGenericSuccessRegistrationHook != null) {
		 return onGenericSuccessRegistrationHook();
	 } else if(onSignOutHook != null){
		 return onSignOutHook();
	 }else if (onSuccessRegistration != null) {
			setCloseHook(onSuccessRegistration);
			setCompleteHook(onSuccessRegistration);	
	 } else {
		 //Just hide it.
		GB_hide();
	 }
}

function myScholasticOnLoginSuccess() {
	return hideMyScholastic();
}
function myScholasticOnLoginCancel() {
	return hideMyScholastic();
}
function myScholasticOnLoginClose() {
	return hideMyScholastic();
}
function myScholasticOnRegistrationSuccess() {
	return hideMyScholastic();
}
function myScholasticOnRegistrationCancel() {
	return hideMyScholastic();
}
function myScholasticOnRegistrationClose() {
	return hideMyScholastic();
}
function myScholasticOnPasswordResetSuccess(){
	return hideMyScholastic();
}
function myScholasticOnPasswordResetCancel() {
	return hideMyScholastic();
}
function myScholasticOnPasswordResetClose() {
	return hideMyScholastic();
}
function myScholasticOnLogoutSuccess() {
	return hideMyScholastic();
}
function hideMyScholastic() {	
	 
	 try{
	   if(varRegistration.redFn == null || varRegistration.redFn == '') {
		   my_close();
			 //parent.parent.resetRedirectFunction();
			 //parent.parent.GB_hide();
	   }else{
			 parent.parent.resetRedirectFunction();
			 parent.parent.setRegistrationType("");
			 parent.parent.PostRegRedirect();
	   }     
	 }catch(e){
		 parent.parent.resetRedirectFunction();
		 parent.parent.setRegistrationType("");
		 parent.parent.PostRegRedirect();
	 }
}


function launchMyScholasticPostSignInCheck(url) {

	if(isLaunchMyScholasticSignInAsModal){
		if(isMyScholasticSessionActive){
			showScholasticPage(url);
		} else {
			GB_show2(url,700,1024);	//614x1024. Lauch it as a modal.
			scrollOrigin();
		}
	} else {
		showScholasticPage(url);
	}
	return false;
}

function checkMyScholasticUserSessionAndLaunch(url){
	try{
		jQuery.ajax({				
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			url:MY_SCHOLASTIC_HOST+"/bin/myaccounts/ext/validateSession?jsonp=GetSessionJSON",
			dataType: 'jsonp',
			jsonpCallback: 'GetSessionJSON',				
			//async: false,
			timeout: 1000,
	        error: function(){
				isMyScholasticSessionActive=false;
				 url += 'sign-in.html';
				launchMyScholasticPostSignInCheck(url);
		        return;
			},
			success: function(result){
				isMyScholasticSessionActive = result.isSessionValid;
				if(isMyScholasticSessionActive){
					url += 'profile/my-profile.html';
				} else {
					 url += 'sign-in.html';
				}
				launchMyScholasticPostSignInCheck(url);				
		}});
	}catch(e){
		console.error("Error in checking myscholastic user session.");
		isMyScholasticSessionActive=false;
		 url += 'sign-in.html';
		launchMyScholasticPostSignInCheck(url);
		return; 
	}
}
