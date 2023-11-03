function RunOnElementLoad(element,type,name) {
 var myhref = location.hash;
 var splitR1;
 var splitR2;
 var modName;
 if( myhref != '' ) {
   splitR1 = myhref.split(type);
   splitR2 = splitR1[0].split("item_");
   if(typeof splitR2[1] =='undefined') {
     splitR2 = splitR2[0].split(element);
    }
   modName = "divid_" + splitR2[1] + type;
   showModule("name", modName);
   location.href=myhref;
 }
}

function getElementsByClass(searchClass) {
 var classElements = new Array();
 node = document;
 tag = '*';
 var els = node.getElementsByTagName(tag);
 var elsLen = els.length;
 var pattern = new RegExp("(^|\s)"+searchClass+"(\s|$)");
  for (i = 0, j = 0; i < elsLen; i++) {
    if ( pattern.test(els[i].className) ) {
       classElements[j] = els[i];
       j++;
    }
  }
  return classElements;
}

function showModule(classname, idname) {
 var moduleAttrDoc=idname + "_AttrDoc";
 hideAllClassNames(classname);
 document.getElementById(idname).style.display='block';
 document.getElementById(moduleAttrDoc).style.display='block';
}

function loadtbpage(testbenchname) {
  if(window['sessionStorage'] !== null && typeof window.sessionStorage != 'undefined') {
    sessionStorage.tbname = testbenchname;
    if (sessionStorage.getItem(sessionStorage.tbname) && document.getElementById(sessionStorage.getItem(sessionStorage.tbname))) {
      showDiv(sessionStorage.getItem(sessionStorage.tbname));
      return;
    }
  }
    var element;
    element = document.getElementById('topology');
    if(element) {
     showDiv('topology');
     return;
    }

    element = document.getElementById('testcases');
    if(element) {
     showDiv('testcases');
     return;
    }

    element = document.getElementById('env');
    if(element) {
     showDiv('env');
     return;
    }

    element = document.getElementById('hdl');
    if(element) {
     showDiv('hdl');
     return;
    }

    element = document.getElementById('readme');
    if(element) {
     showDiv('readme');
     return;
    }
}

function loadFilesPage() {
  var id;
  var element;
  for(i=0; i<sessionStorage.length; i++) {
    id = sessionStorage.key(i);
    element = document.getElementById(id);
    if(element) {
      if (element.className == "folder") {
          element.style.display = sessionStorage.getItem(id);
      }
      else {
          element.value = sessionStorage.getItem(id);
      }
    }
  }
}

function setTsModule(module_name) {
 window.location.href='modules.html#' + module_name;
 sessionStorage.itemname = module_name;
 showTsModule("mod")
}

function showTsModule(classname) {
 var moduleAttrDoc= sessionStorage.itemname + "_AttrDoc";
 hideAllClassNames(classname);
 document.getElementById(sessionStorage.itemname).style.display='block';
 document.getElementById(moduleAttrDoc).style.display='block';
}

function showDiv(idname) {
 hideAllDivs();
 var element;
 element = document.getElementById(idname);
 if(element) {
  element.style.display = 'block';
  if(window['sessionStorage'] !== null && typeof window.sessionStorage != 'undefined') {
    sessionStorage.setItem( sessionStorage.tbname, idname );
    }

 }

}

function hideAllClassNames(classname) {
 var tabs = getElementsByClass(classname);
 for(i=0; i<tabs.length; i++) {
  tabs[i].style.display = 'none';
 }
}

function hideAllDivs() {
 var element;
 element = document.getElementById('topology');
 if(element) {
  element.style.display = 'none';
 }

 element = document.getElementById('testcases');
 if(element) {
  element.style.display = 'none';
 }

 element = document.getElementById('env');
 if(element) {
  element.style.display = 'none';
 }

 element = document.getElementById('hdl');
 if(element) {
  element.style.display = 'none';
 }

 element = document.getElementById('readme');
 if(element) {
  element.style.display = 'none';
 }

}

function showAllClassNames(classname) {
 var tabs = getElementsByClass(classname);
 for(i=0; i<tabs.length; i++) {
  tabs[i].style.display = 'block';
 }
}

function toggleDiv(arg1,arg2) {
 if (document.getElementById(arg1).style.display == "block") {
   document.getElementById(arg1).style.display = "none";
   document.getElementById(arg2).value = "+";
   sessionStorage.setItem(arg1, "none");
   sessionStorage.setItem(arg2, "+");
 }
 else {
   document.getElementById(arg1).style.display = "block";
   document.getElementById(arg2).value = "-";
   sessionStorage.setItem(arg1, "block");
   sessionStorage.setItem(arg2, "-");
 }
}
function toggleExpandAll(classname, buttonname) {
  if(document.getElementById(buttonname).value == "Expand All") {
    showAllClassNames(classname);
    document.getElementById(buttonname).value="Collapse All";
    var tabs = getElementsByClass('cgp_buttons');
    for(i=0; i<tabs.length; i++) {
      tabs[i].value = '-';
    }
  }
  else {
    hideAllClassNames(classname);
    document.getElementById(buttonname).value="Expand All";
    var tabs = getElementsByClass('cgp_buttons');
    for(i=0; i<tabs.length; i++) {
      tabs[i].value = '+';
    }
  }
}

function showClass(classname, id) {
  var tabs;
  if( document.getElementById(id).value == "-" ) {
    tabs = getElementsByClass(classname);
    for(i=0; i<tabs.length; i++) { 
      tabs[i].style.display = 'none';
    }
    document.getElementById(id).value = "+";
  }
  else {
    tabs = getElementsByClass(classname);
    for(i=0; i<tabs.length; i++) {
     tabs[i].style.display = 'block';
    }
    document.getElementById(id).value = "-";
  }
}
