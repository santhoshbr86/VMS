//var subContext=document.domain.split(".")[0];
//IE 10 Fix
//var context=document.documentURI.split(".")[1];

var envType = "dev";

//var context=document.domain;
//var protocol=window.location.protocol;

var hostname = window.location.hostname;
//alert("hostname " + hostname);

if (hostname === "vms-qa.scholastic.com") {
		 envType = 'aws-qa2';	 	// SBC QA
} else if ( hostname === "vms-uat.scholastic.com" ) {
		 envType = 'aws-perf';	 	// SBC Dev
} else if (hostname === "vms-dev.scholastic.com" ) {
         envType = 'dev';                                                                      
} else {
		 envType = 'prod';		// SBC Prod
}

/*if (context=="dev"){
	envType = "dev";
}else if (context=="qa"){
	envType = "qa";
}else {
	envType = "prod";
}*/

//alert("context="+context);
//alert("envType="+envType);