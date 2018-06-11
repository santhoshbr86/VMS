/*
	Version#: 2.05
	Modified On: 2017.07.07
	v2.05 Changed IAM-HOST to secure to clear secure cookies as well in order to sign out my-scholastic.
	Version#: 2.04
	Modified On: 2017.06.06
	v2.04 prod host config added
	Version#: 2.03
	Modified On: 2017.06.05
	v2.03 Updated My Scholastic prod host
	Version#: 2.02
	Modified On: 2017.04.07
	v2.02 My Scholastic modal integration changes dev release 1
	Modified On: 2017.03.16
	v2.01 My Scholastic integration changes dev release 1.
	Modified On: 2016.10.12
	v2.00 Sign Out link reference changed to open-AM or IAM signout API.	
*/

if ( typeof envType == "undefined" ) envType = "";

setEnv(envType);
//PROD SSO
function setEnv(envType) {
	switch (envType) {
	case "local":
		MYACCOUNT_HOST = "https://localhost.scholastic.net";
		NEW_MYACCOUNT_HOST="http://localhost:8080/demo";
		MY_SCHOLASTIC_HOST="https://myaccounts-dev.scholastic.com";
	    SPS_HOST="https://localhost.scholastic.net";
        CHB_HOST="http://chbtest.scholastic.net";
        SSO_STORES_HOST="https://devwas03.scholastic.net";
        PRINTABLES_HTML_HOST="http://devweb01.scholastic.net";
        MINIBOOKS_HOST = "http://devweb01.scholastic.net";
        CONTENT_HOST="http://devweb01.scholastic.net";
        TBW_CONTENT_HOST="http://devweb01.scholastic.net";
        TCOOL_HOST="http://devaix12.scholastic.net";
        WCS_STORES_HOST="https://devwas02.scholastic.net";
        DOTCOM_HOST = "http://comdev2.scholastic.net";
        TEACHER_HOST = "http://teacherdev.scholastic.net";
        SCHWS_HOST = "http://devwas08.scholastic.net";
        TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
        TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
        TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://testopenam.scholastic.net";
        break;
	case "dev":
		MYACCOUNT_HOST = "https://myaccount2-dev1.scholastic.net";
		MY_SCHOLASTIC_HOST="https://myaccounts-dev.scholastic.com";
		SPS_HOST="https://myaccount1-dev1.scholastic.net";
		CHB_HOST="http://chbtest.scholastic.net";
		SSO_STORES_HOST="https://devwas03.scholastic.net";
		PRINTABLES_HTML_HOST="http://devweb01.scholastic.net";
		MINIBOOKS_HOST = "http://devweb01.scholastic.net";
		CONTENT_HOST="http://devweb01.scholastic.net";
		TBW_CONTENT_HOST="http://devweb01.scholastic.net";
		TCOOL_HOST="http://devaix12.scholastic.net";
		WCS_STORES_HOST="https://devwas02.scholastic.net";
		DOTCOM_HOST = "http://comdev2.scholastic.net";
		TEACHER_HOST = "http://teacherdev.scholastic.net";
		SCHWS_HOST = "http://schws.dev1.scholastic.net";
		TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://testopenam.scholastic.net";
		break;
	case "aws-dev":
		MYACCOUNT_HOST = "https://myaccount2-dev1.scholastic.net";
		MY_SCHOLASTIC_HOST="https://myaccounts-dev.scholastic.com";
		SPS_HOST="https://myaccount1-dev1.scholastic.net";
		CHB_HOST="http://chbtest.scholastic.net";
		SSO_STORES_HOST="https://devwas03.scholastic.net";
		PRINTABLES_HTML_HOST="http://devweb01.scholastic.net";
		MINIBOOKS_HOST = "http://devweb01.scholastic.net";
		CONTENT_HOST="http://devweb01.scholastic.net";
		TBW_CONTENT_HOST="http://devweb01.scholastic.net";
		TCOOL_HOST="http://devaix12.scholastic.net";
		WCS_STORES_HOST="https://devwas02.scholastic.net";
		DOTCOM_HOST = "http://comdev2.scholastic.net";
		TEACHER_HOST = "http://teacherdev.scholastic.net";
		SCHWS_HOST = "http://schws.dev1.scholastic.net";
		TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://testopenam.scholastic.net";
		break;
	case "qa":
		MYACCOUNT_HOST = "https://myaccount2-qa2.scholastic.com";
		MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
		SPS_HOST="https://myaccount1-qa1.scholastic.com";
		CHB_HOST="http://homepageqa.scholastic.com";
		SSO_STORES_HOST= "https://storesqanew.scholastic.com";
		PRINTABLES_HTML_HOST="http://printablesqa.scholastic.com";
		MINIBOOKS_HOST = "http://minibooksqa.scholastic.com";
		CONTENT_HOST="http://www.qa.scholastic.com";
		TBW_CONTENT_HOST="http://bookwizardqa.scholastic.com";
		TCOOL_HOST="http://cooltestwas.scholastic.com";
		WCS_STORES_HOST="https://storesqa561.scholastic.com";
		DOTCOM_HOST = "http://www.qa.scholastic.com";
		TEACHER_HOST = "http://teacher.qa.scholastic.com";
		SCHWS_HOST = "https://schws.qa1.scholastic.com";
		TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://login-qa1.scholastic.com";
		break;
	case "aws-qa":
		MYACCOUNT_HOST = "https://myaccount2-qa2.scholastic.com";
		MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
		SPS_HOST="https://myaccount1-qa1.scholastic.com";
		CHB_HOST="http://homepageqa.scholastic.com";
		SSO_STORES_HOST= "https://storesqanew.scholastic.com";
		PRINTABLES_HTML_HOST="http://printablesqa.scholastic.com";
		MINIBOOKS_HOST = "http://minibooksqa.scholastic.com";
		CONTENT_HOST="http://www.qa.scholastic.com";
		TBW_CONTENT_HOST="http://bookwizardqa.scholastic.com";
		TCOOL_HOST="http://cooltestwas.scholastic.com";
		WCS_STORES_HOST="https://storesqa561.scholastic.com";
		DOTCOM_HOST = "http://www.qa.scholastic.com";
		TEACHER_HOST = "http://teacher.qa.scholastic.com";
		SCHWS_HOST = "https://schws.qa1.scholastic.com";
		TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://login-qa1.scholastic.com";
		break;	
	case "aws-qa1":
		MYACCOUNT_HOST = "https://myaccount2-qa2.scholastic.com";
		MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
		SPS_HOST="https://myaccount1-qa1.scholastic.com";
		CHB_HOST="http://homepageqa.scholastic.com";
		SSO_STORES_HOST= "https://storesqanew.scholastic.com";
		PRINTABLES_HTML_HOST="http://printablesqa.scholastic.com";
		MINIBOOKS_HOST = "http://minibooksqa.scholastic.com";
		CONTENT_HOST="http://www.qa.scholastic.com";
		TBW_CONTENT_HOST="http://bookwizardqa.scholastic.com";
		TCOOL_HOST="http://cooltestwas.scholastic.com";
		WCS_STORES_HOST="https://storesqa561.scholastic.com";
		DOTCOM_HOST = "http://www.qa.scholastic.com";
		TEACHER_HOST = "http://teacher.qa.scholastic.com";
		SCHWS_HOST = "https://schws.qa1.scholastic.com";
		TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://login-qa1.scholastic.com";
		break;
	case "aws-qa2":
		MYACCOUNT_HOST = "https://myaccount2-qa2.scholastic.com";
		MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
		SPS_HOST="https://myaccount1-qa2.scholastic.com";
		CHB_HOST="http://homepageqa.scholastic.com";
		SSO_STORES_HOST= "https://storesqanew.scholastic.com";
		PRINTABLES_HTML_HOST="http://printablesqa.scholastic.com";
		MINIBOOKS_HOST = "http://minibooksqa.scholastic.com";
		CONTENT_HOST="http://www.qa.scholastic.com";
		TBW_CONTENT_HOST="http://bookwizardqa.scholastic.com";
		TCOOL_HOST="http://cooltestwas.scholastic.com";
		WCS_STORES_HOST="https://storesqa561.scholastic.com";
		DOTCOM_HOST = "http://www.qa.scholastic.com";
		TEACHER_HOST = "http://teacher.qa.scholastic.com";
		SCHWS_HOST = "https://schws.qa2.scholastic.com";
		TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://login-qa1.scholastic.com";
		break;		
	case "aws-perf":
		MYACCOUNT_HOST = "https://myaccount2-perf2.scholastic.com";
		MY_SCHOLASTIC_HOST="https://myaccounts-perf.scholastic.com";
		SPS_HOST="https://myaccount1-qa1.scholastic.com";
		CHB_HOST="http://homepageqa.scholastic.com";
		SSO_STORES_HOST= "https://storesqanew.scholastic.com";
		PRINTABLES_HTML_HOST="http://printablesqa.scholastic.com";
		MINIBOOKS_HOST = "http://minibooksqa.scholastic.com";
		CONTENT_HOST="http://www.qa.scholastic.com";
		TBW_CONTENT_HOST="http://bookwizardqa.scholastic.com";
		TCOOL_HOST="http://cooltestwas.scholastic.com";
		WCS_STORES_HOST="https://storesqa561.scholastic.com";
		DOTCOM_HOST = "http://www.qa.scholastic.com";
		TEACHER_HOST = "http://teacher.qa.scholastic.com";
		SCHWS_HOST = "https://schws.perf2-int.scholastic.com";
		TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://login-qa1.scholastic.com";
		break;
	case "stage":
		MYACCOUNT_HOST = "https://myaccount2-qa2.scholastic.com";
		MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
		SPS_HOST="https://myaccount1-qa1.scholastic.com";
		CHB_HOST="http://homepageqa.scholastic.com";
		SSO_STORES_HOST="https://stgstore.scholastic.com";
		PRINTABLES_HTML_HOST="http://stage30.scholastic.com";
		MINIBOOKS_HOST = "http://stage30.scholastic.com";
		CONTENT_HOST="http://stage30.scholastic.com";
		TBW_CONTENT_HOST="http://bookwizardstg.scholastic.com";
		TCOOL_HOST="http://cooltestwas.scholastic.com";
		WCS_STORES_HOST="https://storesqa561.scholastic.com";
		DOTCOM_HOST = "http://www.qa.scholastic.com";
		TEACHER_HOST = "http://teacher.qa.scholastic.com";
		SCHWS_HOST = "https://schws-qa2.scholastic.com";
		TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://login-qa1.scholastic.com";
		break;
	case "intprod":
		MYACCOUNT_HOST = "https://myaccount.scholastic.com";
		MY_SCHOLASTIC_HOST="https://account.scholastic.com";
		SPS_HOST="https://my.scholastic.com";
		CHB_HOST="http://homepage.scholastic.com";
		SSO_STORES_HOST="https://stgstore.scholastic.com";
		PRINTABLES_HTML_HOST="http://stage30.scholastic.com";
		MINIBOOKS_HOST = "http://stage30.scholastic.com";
		CONTENT_HOST="http://stage30.scholastic.com";
		TBW_CONTENT_HOST="http://bookwizardstg.scholastic.com";
		TCOOL_HOST="http://clubs.scholastic.com";
		WCS_STORES_HOST="https://sstaging.scholastic.com";
		DOTCOM_HOST = "http://www.scholastic.com";
		TEACHER_HOST = "http://teacher.scholastic.com";
		SCHWS_HOST = "https://esvcs.scholastic.com";
		TE_SSO="http://store.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="http://shop.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://www.scholastic.com/teachers/?myaccount=y&at=DL";
		IAM_HOST="https://signin.scholastic.com";
		break;
	case "ebooksdev":
		MYACCOUNT_HOST = "https://myaccount2-dev1.scholastic.net";
		MY_SCHOLASTIC_HOST="https://myaccounts-dev.scholastic.com";
		SPS_HOST="https://myaccount1-dev1.scholastic.net";
		CHB_HOST="http://chbtest.scholastic.net";
		SSO_STORES_HOST="https://devwas03.scholastic.net";
		PRINTABLES_HTML_HOST="http://devweb01.scholastic.net";
		MINIBOOKS_HOST = "http://devweb01.scholastic.net";
		CONTENT_HOST="http://devweb01.scholastic.net";
		TBW_CONTENT_HOST="http://devweb01.scholastic.net";
		TCOOL_HOST="http://devaix12.scholastic.net";
		WCS_STORES_HOST="https://devwas02.scholastic.net";
		DOTCOM_HOST = "http://comdev2.scholastic.net";
		TEACHER_HOST = "http://teacherdev.scholastic.net";
		SCHWS_HOST = "http://schws.dev1.scholastic.net";
		TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://testopenam.scholastic.net";
		break;
	case "ebooksqa":
		MYACCOUNT_HOST = "https://myaccount2-qa2.scholastic.com";
		SPS_HOST="https://myaccount1-qa1.scholastic.com";
		CHB_HOST="http://homepageqa.scholastic.com";
		SSO_STORES_HOST= "https://storesqanew.scholastic.com";
		PRINTABLES_HTML_HOST="http://printablesqa.scholastic.com";
		MINIBOOKS_HOST = "http://minibooksqa.scholastic.com";
		CONTENT_HOST="http://contentqa.scholastic.com";
		TBW_CONTENT_HOST="http://bookwizardqa.scholastic.com";
		TCOOL_HOST="http://cooltestwas.scholastic.com";
		WCS_STORES_HOST="https://storesqa561.scholastic.com";
		DOTCOM_HOST = "http://www.qa.scholastic.com";
		TEACHER_HOST = "http://teacherqual.scholastic.net";
		SCHWS_HOST = "https://schws.qa1.scholastic.com";
		TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://login-qa1.scholastic.com";
		MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
		break;
	case "ssodev":
        MYACCOUNT_HOST = "https://myaccount2-dev1.scholastic.net";
        SPS_HOST="https://myaccount1-dev1.scholastic.net";
        CHB_HOST="http://chbtest.scholastic.net";
        SSO_STORES_HOST="https://devwas03.scholastic.net";
        PRINTABLES_HTML_HOST="http://devweb01.scholastic.net";
        MINIBOOKS_HOST = "http://devweb01.scholastic.net";
        CONTENT_HOST="http://devweb01.scholastic.net";
        TBW_CONTENT_HOST="http://devweb01.scholastic.net";
        TCOOL_HOST="http://devaix12.scholastic.net";
        WCS_STORES_HOST="https://devwas02.scholastic.net";
        DOTCOM_HOST = "http://comdev2.scholastic.net";
        TEACHER_HOST = "http://teacherdev.scholastic.net";
        SCHWS_HOST = "http://schws.dev1.scholastic.net";
        TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
        TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
        TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://testopenam.scholastic.net";
		MY_SCHOLASTIC_HOST="https://myaccounts-dev.scholastic.com";
        break;
	case "ssoqa":
	      MYACCOUNT_HOST = "https://myaccount2-qa2.scholastic.com";
			MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
	      SPS_HOST="https://myaccount1-qa1.scholastic.com";
	      CHB_HOST="http://homepageqa.scholastic.com";
	      SSO_STORES_HOST= "https://storesqanew.scholastic.com";
	      PRINTABLES_HTML_HOST="http://printablesqa.scholastic.com";
	      MINIBOOKS_HOST = "http://minibooksqa.scholastic.com";
	      CONTENT_HOST="http://contentqa.scholastic.com";
	      TBW_CONTENT_HOST="http://bookwizardqa.scholastic.com";
	      TCOOL_HOST="http://cooltestwas.scholastic.com";
	      WCS_STORES_HOST="https://storesqa561.scholastic.com";
	      DOTCOM_HOST = "http://www.qa.scholastic.com";
	      TEACHER_HOST = "http://teacherqual.scholastic.net";
	      SCHWS_HOST = "https://schws.qa1.scholastic.com";
	      TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
	      TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
	      TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		  IAM_HOST="https://login-qa1.scholastic.com";
		  MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
	      break;
	case "cptdev":
        MYACCOUNT_HOST = "https://myaccount2-dev1.scholastic.net";
        SPS_HOST="https://myaccount1-dev1.scholastic.net";
        CHB_HOST="http://chbtest.scholastic.net";
        SSO_STORES_HOST="https://devwas03.scholastic.net";
        PRINTABLES_HTML_HOST="http://devweb01.scholastic.net";
        MINIBOOKS_HOST = "http://devweb01.scholastic.net";
        CONTENT_HOST="http://devweb01.scholastic.net";
        TBW_CONTENT_HOST="http://devweb01.scholastic.net";
        TCOOL_HOST="http://devaix12.scholastic.net";
        WCS_STORES_HOST="https://devwas02.scholastic.net";
        DOTCOM_HOST = "http://comdev2.scholastic.net";
        TEACHER_HOST = "http://teacherdev.scholastic.net";
        SCHWS_HOST = "http://schws.dev2.scholastic.net";
        TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
        TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
        TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://testopenam.scholastic.net";
		MY_SCHOLASTIC_HOST="https://myaccounts-dev.scholastic.com";
        break;	
	case "visiondev":
          MYACCOUNT_HOST = "https://myaccount2-dev2.scholastic.net";
          SPS_HOST="https://myaccount1-dev2.scholastic.net";
          CHB_HOST="http://chbtest.scholastic.net";
          SSO_STORES_HOST="https://devwas03.scholastic.net";
          PRINTABLES_HTML_HOST="http://devweb01.scholastic.net";
          MINIBOOKS_HOST = "http://devweb01.scholastic.net";
          CONTENT_HOST="http://devweb01.scholastic.net";
          TBW_CONTENT_HOST="http://devweb01.scholastic.net";
          TCOOL_HOST="http://devaix12.scholastic.net";
          WCS_STORES_HOST="https://devwas02.scholastic.net";
          DOTCOM_HOST = "http://comdev2.scholastic.net";
          TEACHER_HOST = "http://teacherdev.scholastic.net";
          SCHWS_HOST = "http://schws.dev2.scholastic.net";
          TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
          TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
          TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		  IAM_HOST="https://testopenam.scholastic.net";
		  MY_SCHOLASTIC_HOST="https://myaccounts-dev.scholastic.com";
          break;
	case "devOFE":
          MYACCOUNT_HOST = "https://myaccount2-dev2.scholastic.net";
          SPS_HOST="https://myaccount1-dev2.scholastic.net";
          CHB_HOST="http://chbtest.scholastic.net";
          SSO_STORES_HOST="https://devwas03.scholastic.net";
          PRINTABLES_HTML_HOST="http://devweb01.scholastic.net";
          MINIBOOKS_HOST = "http://devweb01.scholastic.net";
          CONTENT_HOST="http://devweb01.scholastic.net";
          TBW_CONTENT_HOST="http://devweb01.scholastic.net";
          TCOOL_HOST="http://devaix12.scholastic.net";
          WCS_STORES_HOST="https://devwas02.scholastic.net";
          DOTCOM_HOST = "http://comdev2.scholastic.net";
          TEACHER_HOST = "http://teacherdev.scholastic.net";
          SCHWS_HOST = "http://schws.dev2.scholastic.net";
		  IAM_HOST="https://testopenam.scholastic.net";
		  MY_SCHOLASTIC_HOST="https://myaccounts-dev.scholastic.com";
		  IAM_ADAPTER_HOST="https://nonprod.api.scholastic.com/devint";
		break;
	case "qaOFE":
		MYACCOUNT_HOST = "https://myaccount2-qa2.scholastic.com";
		SPS_HOST="https://myaccount1-qa1.scholastic.com";
		CHB_HOST="http://homepageqa.scholastic.com";
		SSO_STORES_HOST= "https://storesqanew.scholastic.com";
		PRINTABLES_HTML_HOST="http://printablesqa.scholastic.com";
		MINIBOOKS_HOST = "http://minibooksqa.scholastic.com";
		CONTENT_HOST="http://www.qa.scholastic.com";
		TBW_CONTENT_HOST="http://bookwizardqa.scholastic.com";
		TCOOL_HOST="http://cooltestwas.scholastic.com";
		WCS_STORES_HOST="https://storesqa561.scholastic.com";
		DOTCOM_HOST = "http://www.qa.scholastic.com";
		TEACHER_HOST = "http://teacher.qa.scholastic.com";
		SCHWS_HOST = "https://schws.qa1.scholastic.com";
		IAM_HOST="https://login-qa1.scholastic.com";
		MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
		IAM_ADAPTER_HOST="https://nonprod.api.scholastic.com/qa1";
		break;
	case "qa2OFE":
		MYACCOUNT_HOST = "https://myaccount2-qa2.scholastic.com";
		SPS_HOST="https://myaccount1-qa1.scholastic.com";
		CHB_HOST="http://homepageqa.scholastic.com";
		SSO_STORES_HOST= "https://storesqanew.scholastic.com";
		PRINTABLES_HTML_HOST="http://printablesqa.scholastic.com";
		MINIBOOKS_HOST = "http://minibooksqa.scholastic.com";
		CONTENT_HOST="http://www.qa.scholastic.com";
		TBW_CONTENT_HOST="http://bookwizardqa.scholastic.com";
		TCOOL_HOST="http://cooltestwas.scholastic.com";
		WCS_STORES_HOST="https://storesqa561.scholastic.com";
		DOTCOM_HOST = "http://www.qa.scholastic.com";
		TEACHER_HOST = "http://teacher.qa.scholastic.com";
		SCHWS_HOST = "https://schws.qa1.scholastic.com";
		IAM_HOST="https://login-qa1.scholastic.com";
		MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
		//IAM_ADAPTER_HOST="https://nonprod.api.scholastic.com/qa2";
		break;
	case "cptqa":
        MYACCOUNT_HOST="https://myaccount2-qa2.scholastic.com";
        SPS_HOST="https://myaccount1-qa1.scholastic.com";
        CHB_HOST="http://homepageqa.scholastic.com";
        SSO_STORES_HOST= "https://storesqanew.scholastic.com";
        PRINTABLES_HTML_HOST="http://printablesqa.scholastic.com";
        MINIBOOKS_HOST = "http://minibooksqa.scholastic.com";
        CONTENT_HOST="http://contentqa.scholastic.com";
        TBW_CONTENT_HOST="http://bookwizardqa.scholastic.com";
        TCOOL_HOST="http://cooltestwas.scholastic.com";
        WCS_STORES_HOST="https://storesqa561.scholastic.com";
        DOTCOM_HOST = "http://www.qa.scholastic.com";
        TEACHER_HOST = "http://teacherqual.scholastic.net";
        SCHWS_HOST = "https://schws.qa2.scholastic.com";
        TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
        TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
        TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		IAM_HOST="https://login-qa1.scholastic.com";
		MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
        break;          
	case "visionqa":
          MYACCOUNT_HOST="https://myaccount2-qa2.scholastic.com";
          SPS_HOST="https://myaccount1-qa2.scholastic.com";
          CHB_HOST="http://homepageqa.scholastic.com";
          SSO_STORES_HOST= "https://storesqanew.scholastic.com";
          PRINTABLES_HTML_HOST="http://printablesqa.scholastic.com";
          MINIBOOKS_HOST = "http://minibooksqa.scholastic.com";
          CONTENT_HOST="http://contentqa.scholastic.com";
          TBW_CONTENT_HOST="http://bookwizardqa.scholastic.com";
          TCOOL_HOST="http://cooltestwas.scholastic.com";
          WCS_STORES_HOST="https://storesqa561.scholastic.com";
          DOTCOM_HOST = "http://www.qa.scholastic.com";
          TEACHER_HOST = "http://teacherqual.scholastic.net";
          SCHWS_HOST = "https://schws.qa2.scholastic.com";
          TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
          TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
          TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		  IAM_HOST="https://login-qa1.scholastic.com";
		  MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
          break;
	case "c2cqa1":
		  MYACCOUNT_HOST = "https://myaccount2-qa2.scholastic.com";
		  SPS_HOST="https://myaccount1-qa1.scholastic.com";
		  CHB_HOST="http://homepageqa.scholastic.com";
		  SSO_STORES_HOST= "https://storesqanew.scholastic.com";
		  PRINTABLES_HTML_HOST="http://printables.qa.scholastic.com";
		  MINIBOOKS_HOST = "http://minibooks.qa.scholastic.com";
		  CONTENT_HOST="http://www.qa2.scholastic.com";
		  TBW_CONTENT_HOST="http://bookwizard.qa.scholastic.com";
		  TCOOL_HOST="http://cooltestwas.scholastic.com";
		  WCS_STORES_HOST="https://stores2qa2.scholastic.com";
		  DOTCOM_HOST = "http://www.qa2.scholastic.com";
		  TEACHER_HOST = "http://teacher.qa.scholastic.com";
		  SCHWS_HOST = "https://schws.qa1.scholastic.com";
		  TE_SSO="http://storeqa2.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		  TE_TSO="https://shopqa3.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		  TE_FLY="http://stores2qa3.scholastic.com?myaccount=y&at=DL";
		  IAM_HOST="https://login-qa1.scholastic.com";
		  MY_SCHOLASTIC_HOST="https://myaccounts-stage.scholastic.com";
		  break;
	case "prod":
		MYACCOUNT_HOST = "https://myaccount.scholastic.com";		
		SPS_HOST="https://my.scholastic.com";
		CHB_HOST="http://homepage.scholastic.com";
		SSO_STORES_HOST="https://store.scholastic.com";
		PRINTABLES_HTML_HOST="http://printables.scholastic.com";
		MINIBOOKS_HOST = "http://minibooks.scholastic.com";
		CONTENT_HOST="http://www2.scholastic.com";
		TBW_CONTENT_HOST="http://bookwizard.scholastic.com";
		TCOOL_HOST="http://clubs.scholastic.com";
		WCS_STORES_HOST="https://shop.scholastic.com";
		DOTCOM_HOST = "http://www.scholastic.com";
		TEACHER_HOST = "http://teacher.scholastic.com";
		SCHWS_HOST = "https://esvcs.scholastic.com";
		TE_SSO="http://store.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="http://shop.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://www.scholastic.com/teachers/?myaccount=y&at=DL";
		IAM_HOST="https://signin.scholastic.com";
		MY_SCHOLASTIC_HOST="https://account.scholastic.com";
		break;
	default:
		MYACCOUNT_HOST = "https://myaccount.scholastic.com";
		MY_SCHOLASTIC_HOST="https://myaccounts.scholastic.com";
		SPS_HOST="https://my.scholastic.com";
		CHB_HOST="http://homepage.scholastic.com";
		SSO_STORES_HOST="https://store.scholastic.com";
		PRINTABLES_HTML_HOST="http://printables.scholastic.com";
		MINIBOOKS_HOST = "http://minibooks.scholastic.com";
		CONTENT_HOST="http://www2.scholastic.com";
		TBW_CONTENT_HOST="http://bookwizard.scholastic.com";
		TCOOL_HOST="http://clubs.scholastic.com";
		WCS_STORES_HOST="https://shop.scholastic.com";
		DOTCOM_HOST = "http://www.scholastic.com";
		TEACHER_HOST = "http://teacher.scholastic.com";
		SCHWS_HOST = "https://esvcs.scholastic.com";
		TE_SSO="http://store.scholastic.com/shop/Teaching+Resources/4502~4518~15";
		TE_TSO="http://shop.scholastic.com/webapp/wcs/stores/servlet/teacherstore/btq/TE";
		TE_FLY="http://www.scholastic.com/teachers/?myaccount=y&at=DL";
		IAM_HOST="https://signin.scholastic.com";
		MY_SCHOLASTIC_HOST="https://account.scholastic.com";
		break;
	}
}


//ESCHOLASTIC

var schlEnv = {
	'dev' : {
		MYACCOUNT_HOST : "https://myaccount2-dev1.scholastic.net",
		SPS_HOST : "https://myaccount1-dev1.scholastic.net",
		CHB_HOST : "http://chbtest.scholastic.net",
		SSO_STORES_HOST : "https://devwas03.scholastic.net",
		PRINTABLES_HTML_HOST : "http://devweb01.scholastic.net",
		MINIBOOKS_HOST : "http://devweb01.scholastic.net",
		CONTENT_HOST : "http://content.dev.scholastic.com",
		TBW_CONTENT_HOST : "http://devweb01.scholastic.net",
		TCOOL_HOST : "http://devaix12.scholastic.net",
		WCS_STORES_HOST : "https://devwas02.scholastic.net",
		DOTCOM_HOST : "http://www.dev.scholastic.com",
		TEACHER_HOST : "http://teacher.dev.scholastic.com",
		SCHWS_HOST : "http://schws.dev1.scholastic.net",
		IAM_HOST:"https://login-qa1.scholastic.com",
		MY_SCHOLASTIC_HOST:"https://myaccounts-dev.scholastic.com"
	},
	'qa' : {
		MYACCOUNT_HOST : "https://myaccount2-qa2.scholastic.com",
		SPS_HOST : "https://myaccount1-qa1.scholastic.com",
		CHB_HOST : "http://homepageqa.scholastic.com",
		SSO_STORES_HOST : "https://storesqanew.scholastic.com",
		PRINTABLES_HTML_HOST : "http://printables.qa.scholastic.com",
		MINIBOOKS_HOST : "http://minibooks.qa.scholastic.com",
		CONTENT_HOST : "http://content.qa.scholastic.com",
		TBW_CONTENT_HOST : "http://bookwizard.qa.scholastic.com",
		TCOOL_HOST : "http://cooltestwas.scholastic.com",
		WCS_STORES_HOST : "https://storesqa561.scholastic.com",
		DOTCOM_HOST : "http://www.qa.scholastic.com",
		TEACHER_HOST : "http://teacher.qa.scholastic.com",
		SCHWS_HOST : "https://schws.qa1.scholastic.com",
		IAM_HOST:"https://login-qa1.scholastic.com",
		MY_SCHOLASTIC_HOST : "https://myaccounts-stage.scholastic.com"
	},
	'qa2' : {
		MYACCOUNT_HOST : "https://myaccount2-qa2.scholastic.com",
		SPS_HOST : "https://myaccount1-qa2.scholastic.com",
		CHB_HOST : "http://homepageqa.scholastic.com",
		SSO_STORES_HOST : "https://storesqanew.scholastic.com",
		PRINTABLES_HTML_HOST : "http://printables.qa.scholastic.com",
		MINIBOOKS_HOST : "http://minibooks.qa.scholastic.com",
		CONTENT_HOST : "http://www.qa2.scholastic.com",
		TBW_CONTENT_HOST : "http://bookwizard.qa.scholastic.com",
		TCOOL_HOST : "http://cooltestwas.scholastic.com",
		WCS_STORES_HOST : "https://scewriapq09.scholastic.net",
		DOTCOM_HOST : "http://www.qa2.scholastic.com",
		TEACHER_HOST : "http://teacher.qa.scholastic.com",
		SCHWS_HOST : "https://schws.qa2.scholastic.com",
		IAM_HOST:"https://login-qa1.scholastic.com",
		MY_SCHOLASTIC_HOST :"https://myaccounts-stage.scholastic.com"
	},
	'c2cqa1' : {
		  MYACCOUNT_HOST : "https://myaccount2-qa2.scholastic.com",
		  SPS_HOST : "https://myaccount1-qa1.scholastic.com",
		  CHB_HOST : "http://homepageqa.scholastic.com",
		  SSO_STORES_HOST : "https://storesqanew.scholastic.com",
		  PRINTABLES_HTML_HOST : "http://printables.qa.scholastic.com",
		  MINIBOOKS_HOST : "http://minibooks.qa.scholastic.com",
		  CONTENT_HOST : "http://www.qa2.scholastic.com",
		  TBW_CONTENT_HOST : "http://bookwizard.qa.scholastic.com",
		  TCOOL_HOST : "http://cooltestwas.scholastic.com",
		  WCS_STORES_HOST : "https://stores2qa2.scholastic.com",
		  DOTCOM_HOST : "http://www.qa2.scholastic.com",
		  TEACHER_HOST : "http://teacher.qa.scholastic.com",
		  SCHWS_HOST : "https://schws.qa1.scholastic.com",
		  IAM_HOST:"https://login-qa1.scholastic.com",
			MY_SCHOLASTIC_HOST :"https://myaccounts-stage.scholastic.com"
	},
	'intprod' : {
		MYACCOUNT_HOST : "https://myaccount.scholastic.com",
		SPS_HOST : "https://my.scholastic.com",
		CHB_HOST : "http://homepage.scholastic.com",
		SSO_STORES_HOST : "https://stgstore.scholastic.com",
		PRINTABLES_HTML_HOST : "http://stage30.scholastic.com",
		MINIBOOKS_HOST : "http://stage30.scholastic.com",
		CONTENT_HOST : "http://stage30.scholastic.com",
		TBW_CONTENT_HOST : "http://bookwizardstg.scholastic.com",
		TCOOL_HOST : "http://clubs.scholastic.com",
		WCS_STORES_HOST : "https://sstaging.scholastic.com",
		DOTCOM_HOST : "http://www.scholastic.com",
		TEACHER_HOST : "http://teacher.scholastic.com",
		SCHWS_HOST : "https://esvcs.scholastic.com",
		IAM_HOST:"https://signin.scholastic.com",
		MY_SCHOLASTIC_HOST :"https://account.scholastic.com"
	},
	'ebooksdev' : {
		MYACCOUNT_HOST : "https://myaccount2-dev1.scholastic.net",
		SPS_HOST : "https://myaccount1-dev1.scholastic.net",
		CHB_HOST : "http://chbtest.scholastic.net",
		SSO_STORES_HOST : "https://devwas03.scholastic.net",
		PRINTABLES_HTML_HOST : "http://devweb01.scholastic.net",
		MINIBOOKS_HOST : "http://devweb01.scholastic.net",
		CONTENT_HOST : "http://devweb01.scholastic.net",
		TBW_CONTENT_HOST : "http://devweb01.scholastic.net",
		TCOOL_HOST : "http://devaix12.scholastic.net",
		WCS_STORES_HOST : "https://devwas02.scholastic.net",
		DOTCOM_HOST  : "http://comdev2.scholastic.net",
		TEACHER_HOST : "http://teacherdev.scholastic.net",
		SCHWS_HOST : "http://schws-dev1.scholastic.net",
		IAM_HOST:"https://login-qa1.scholastic.com",
		MY_SCHOLASTIC_HOST :"https://myaccounts-dev.scholastic.com"
	},
	'ebooksqa' : {
		MYACCOUNT_HOST : "https://myaccount2-qa2.scholastic.com",
		SPS_HOST : "https://myaccount1-qa1.scholastic.com",
		CHB_HOST : "http://homepageqa.scholastic.com",
		SSO_STORES_HOST : "https://storesqanew.scholastic.com",
		PRINTABLES_HTML_HOST : "http://printablesqa.scholastic.com",
		MINIBOOKS_HOST : "http://minibooksqa.scholastic.com",
		CONTENT_HOST : "http://contentqa.scholastic.com",
		TBW_CONTENT_HOST : "http://bookwizardqa.scholastic.com",
		TCOOL_HOST : "http://cooltestwas.scholastic.com",
		WCS_STORES_HOST : "https://storesqa561.scholastic.com",
		DOTCOM_HOST : "http://www.qa.scholastic.com",
		TEACHER_HOST : "http://teacherqual.scholastic.net",
		SCHWS_HOST : "https://schws-qa1.scholastic.com",
		IAM_HOST:"https://login-qa1.scholastic.com",
		MY_SCHOLASTIC_HOST :"https://myaccounts-stage.scholastic.com"
	},
	'ssodev': {
	   MYACCOUNT_HOST : "https://myaccount2-dev1.scholastic.net",
	   SPS_HOST : "https://myaccount1-dev1.scholastic.net",
	   CHB_HOST : "http://chbtest.scholastic.net",
	   SSO_STORES_HOST : "https://devwas03.scholastic.net",
	   PRINTABLES_HTML_HOST : "http://devweb01.scholastic.net",
	   MINIBOOKS_HOST : "http://devweb01.scholastic.net",
	   CONTENT_HOST : "http://devweb01.scholastic.net",
	   TBW_CONTENT_HOST : "http://devweb01.scholastic.net",
	   TCOOL_HOST : "http://devaix12.scholastic.net",
	   WCS_STORES_HOST : "https://devwas02.scholastic.net",
	   DOTCOM_HOST : "http://comdev2.scholastic.net",
	   TEACHER_HOST : "http://teacherdev.scholastic.net",
	   SCHWS_HOST : "http://schws.dev1.scholastic.net",
   		IAM_HOST:"https://login-qa1.scholastic.com",
	   MY_SCHOLASTIC_HOST :"https://myaccounts-dev.scholastic.com"
	},
	'ssoqa': {
	  MYACCOUNT_HOST : "https://myaccount2-qa2.scholastic.com",
	  SPS_HOST : "https://myaccount1-qa1.scholastic.com",
	  CHB_HOST : "http://homepageqa.scholastic.com",
	  SSO_STORES_HOST : "https://storesqanew.scholastic.com",
	  PRINTABLES_HTML_HOST : "http://printablesqa.scholastic.com",
	  MINIBOOKS_HOST : "http://minibooksqa.scholastic.com",
	  CONTENT_HOST : "http://contentqa.scholastic.com",
	  TBW_CONTENT_HOST : "http://bookwizardqa.scholastic.com",
	  TCOOL_HOST : "http://cooltestwas.scholastic.com",
	  WCS_STORES_HOST : "https://storesqa561.scholastic.com",
	  DOTCOM_HOST : "http://www.qa.scholastic.com",
	  TEACHER_HOST : "http://teacherqual.scholastic.net",
	  SCHWS_HOST : "https://schws-qa1.scholastic.com",
		IAM_HOST:"https://login-qa1.scholastic.com",
	  MY_SCHOLASTIC_HOST :"https://myaccounts-stage.scholastic.com"
	},
	'cptdev': {
		MYACCOUNT_HOST : "https://myaccount2-dev1.scholastic.net",
		SPS_HOST : "https://myaccount1-dev1.scholastic.net",
		CHB_HOST : "http://chbtest.scholastic.net",
		SSO_STORES_HOST : "https://devwas03.scholastic.net",
		PRINTABLES_HTML_HOST : "http://devweb01.scholastic.net",
		MINIBOOKS_HOST : "http://devweb01.scholastic.net",
		CONTENT_HOST : "http://devweb01.scholastic.net",
		TBW_CONTENT_HOST : "http://devweb01.scholastic.net",
		TCOOL_HOST : "http://devaix12.scholastic.net",
		WCS_STORES_HOST : "https://devwas02.scholastic.net",
		DOTCOM_HOST : "http://www.dev.scholastic.com",
		TEACHER_HOST : "http://teacher.dev.scholastic.com",
		SCHWS_HOST : "http://schws.dev2.scholastic.net",
		IAM_HOST:"https://login-qa1.scholastic.com",
		MY_SCHOLASTIC_HOST:"https://myaccounts-dev.scholastic.com"
	},
	'visiondev': {
		MYACCOUNT_HOST : "https://myaccount2-dev2.scholastic.net",
		SPS_HOST : "https://myaccount1-dev2.scholastic.net",
		CHB_HOST : "http://chbtest.scholastic.net",
		SSO_STORES_HOST : "https://devwas03.scholastic.net",
		PRINTABLES_HTML_HOST : "http://devweb01.scholastic.net",
		MINIBOOKS_HOST : "http://devweb01.scholastic.net",
		CONTENT_HOST : "http://devweb01.scholastic.net",
		TBW_CONTENT_HOST : "http://devweb01.scholastic.net",
		TCOOL_HOST : "http://devaix12.scholastic.net",
		WCS_STORES_HOST : "https://devwas02.scholastic.net",
		DOTCOM_HOST : "http://www.dev.scholastic.com",
		TEACHER_HOST : "http://teacher.dev.scholastic.com",
		SCHWS_HOST : "http://schws.dev2.scholastic.net",
		IAM_HOST:"https://login-qa1.scholastic.com",
		MY_SCHOLASTIC_HOST:"https://myaccounts-dev.scholastic.com"
	},
	'cptqa' : {
		MYACCOUNT_HOST : "https://myaccount2-qa2.scholastic.com",
		SPS_HOST : "https://myaccount1-qa1.scholastic.com",
		CHB_HOST : "http://homepageqa.scholastic.com",
		SSO_STORES_HOST : "https://storesqanew.scholastic.com",
		PRINTABLES_HTML_HOST : "http://printables.qa.scholastic.com",
		MINIBOOKS_HOST : "http://minibooks.qa.scholastic.com",
		CONTENT_HOST : "http://www2.qa.scholastic.com",
		TBW_CONTENT_HOST : "http://bookwizard.qa.scholastic.com",
		TCOOL_HOST : "http://cooltestwas.scholastic.com",
		WCS_STORES_HOST : "https://storesqa561.scholastic.com",
		DOTCOM_HOST : "http://www.qa.scholastic.com",
		TEACHER_HOST : "http://teacher.qa.scholastic.com",
		SCHWS_HOST : "https://schws.qa2.scholastic.com",
		IAM_HOST:"https://login-qa1.scholastic.com",
		MY_SCHOLASTIC_HOST:"https://myaccounts-stage.scholastic.com"
	},
	'visionqa' : {
		MYACCOUNT_HOST : "https://myaccount2-qa2.scholastic.com",
		SPS_HOST : "https://myaccount1-qa2.scholastic.com",
		CHB_HOST : "http://homepageqa.scholastic.com",
		SSO_STORES_HOST : "https://storesqanew.scholastic.com",
		PRINTABLES_HTML_HOST : "http://printables.qa.scholastic.com",
		MINIBOOKS_HOST : "http://minibooks.qa.scholastic.com",
		CONTENT_HOST : "http://www2.qa.scholastic.com",
		TBW_CONTENT_HOST : "http://bookwizard.qa.scholastic.com",
		TCOOL_HOST : "http://cooltestwas.scholastic.com",
		WCS_STORES_HOST : "https://storesqa561.scholastic.com",
		DOTCOM_HOST : "http://www.qa.scholastic.com",
		TEACHER_HOST : "http://teacher.qa.scholastic.com",
		SCHWS_HOST : "https://schws-qa2.scholastic.com",
		IAM_HOST:"https://login-qa1.scholastic.com",
		MY_SCHOLASTIC_HOST:"https://myaccounts-stage.scholastic.com"
		
	},
	'prod' : {
		MYACCOUNT_HOST : "https://myaccount.scholastic.com",
		SPS_HOST : "https://my.scholastic.com",
		CHB_HOST : "http://homepage.scholastic.com",
		SSO_STORES_HOST : "https://store.scholastic.com",
		PRINTABLES_HTML_HOST : "http://printables.scholastic.com",
		MINIBOOKS_HOST : "http://minibooks.scholastic.com",
		CONTENT_HOST : "http://www2.scholastic.com",
		TBW_CONTENT_HOST : "http://bookwizard.scholastic.com",
		TCOOL_HOST : "http://clubs.scholastic.com",
		WCS_STORES_HOST : "https://shop.scholastic.com",
		DOTCOM_HOST : "http://www.scholastic.com",
		TEACHER_HOST : "http://teacher.scholastic.com",
		SCHWS_HOST : "https://esvcs.scholastic.com",
		IAM_HOST:"https://signin.scholastic.com",
		MY_SCHOLASTIC_HOST:"https://account.scholastic.com"
	}
};


