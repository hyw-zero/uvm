var Tables =new Array();
var ref_row='';
var defaultValues;
var pcbutton=new Array();
var col_visible_always=0;
var more_width_cols=new Array();
function setFilter(id){
	var input = document.getElementById(id); var index;
	var farray={};
 	var ob ={};
	if(input!=null && input.nodeName.toLowerCase()=="table"){
		ref_row=arguments[1];
		var tobj=arguments[2];
		input.num_cols=getNumCols(input,ref_row);
		input.table_obj=tobj;
		index=tobj["row_index"];
		if(typeof tobj["col_visible_always"]!="undefined")
			col_visible_always=tobj["col_visible_always"];
		if(typeof tobj["more_width_cols"]!="undefined")
			more_width_cols=tobj["more_width_cols"];
		PopulateOptions(input,farray);
		getDefaultFilterValues();
		Tables.push(id);
		ob.clicked=0;
		ob.selected_checkclass="";
		ob.group="";
		pcbutton[id]=ob;
		var gridrow=input.insertRow(0);
		gridrow.className="gridrow";
		for(var i=0;i<input.num_cols;i++){
			var gridcell=gridrow.insertCell(i);
		        gridcell.setAttribute("style","width:auto");
 			if(tobj["col_"+i]=="hidden_col" || tobj["col_"+i]=="hidden_fltr")
 				gridcell.setAttribute("style","display: none");
			if(tobj["col_"+i]=="active_fltr" || tobj["col_"+i]=="hidden_fltr"){
				var sel_ele=document.createElement("select");
				sel_ele.setAttribute("id","flt"+i+"_"+id);
				sel_ele.setAttribute("class","flt");
				sel_ele.setAttribute("style","width:100%");
				sel_ele.className="flt";
				gridcell.appendChild(sel_ele);
				var currOpt =new Option("SELECT ALL","",false,false);
				sel_ele.options[0]=currOpt;
				var OptArray=farray["col_"+i].slice();
				OptArray.sort();
					for(var k=0;k<farray["col_"+i].length;k++){
						var currOpt =new Option(OptArray[k],OptArray[k],false,false);
						sel_ele.options[k+1]=currOpt;
						if(defaultValues["col_"+i]){
							var def_col_no=i;
							var def_col_value= defaultValues["col_"+i].replace(/^[ ]+|[ ]+$/g,'');
							if( def_col_value ==  OptArray[k])
								sel_ele.selectedIndex=k+1;
						}
					}
				sel_ele.onchange = function() { Filter(input,this.id);}
			}
		}
	}
	if(defaultValues["col_"+def_col_no]){
		Filter(input);
	}
}
function getChildElem(obj){
	if(obj.nodeType == 1){
		for (var i=0; i<obj.childNodes.length; i++){
			var child=obj.childNodes[i];
			if(child.nodeType == 3) obj.removeChild(child);
		}
		return obj;
	}
}
function getNumCols(input,row){
	var tr;
	if(row==undefined) tr= input.getElementsByTagName("tr")[0];
	else tr= input.getElementsByTagName("tr")[row];
	return getChildElem(tr).childNodes.length;
}
function getCellText(cell){
	var cell_data="";
 if(cell){
	        var childs=cell.childNodes;
	        for(var i=0;i<childs.length;i++){
		        if(childs[i].nodeType ==3) cell_data+=childs[i].data;
		        else cell_data+=getCellText(childs[i]);
	        }
	}return cell_data;
}
function PopulateOptions(input,farray){
	var row=input.getElementsByTagName("tr");
	var tobj=input.table_obj;
	for (var k=ref_row;k<row.length;k++){
	if(row[k].style.display!="none"){
		var cell=getChildElem(row[k]).childNodes;
		if (input.num_cols == cell.length){
			updateFilterArrays(farray,tobj,cell);
		}
	}
	}
}
function updateFilterArrays(farray,tobj,cell){
	var index=tobj["row_index"];
	var w,i,isMatched;
	for(i=0;i<cell.length;i++){
		if(tobj["col_"+i]=="active_fltr"||tobj["col_"+i]=="hidden_fltr"){
			isMatched=false;
			var cell_data=getCellText(cell[index+i]).replace(/^[ ]+|[ ]+$/g,'');
			if(typeof farray["col_"+i]=="undefined"){
				farray["col_"+i]=[];
				if(cell_data != "")
					farray["col_"+i].push(cell_data);
				else
					farray["col_"+i].push("Unspecified");
			}
			else{
				for(w=0;w<farray["col_"+i].length;w++){
					if (cell_data==farray["col_"+i][w]){isMatched=true; break;}
				}
				if(!isMatched){
					if(cell_data != ""){
						farray["col_"+i].push(cell_data);
					}
					else{
						if(farray["col_"+i].indexOf("Unspecified")==-1)
							farray["col_"+i].push("Unspecified");
					}
				}
			}
		}
	}
}
function clearFilters(input,id){
    pcbutton[input.id].clicked=0;
    pcbutton[input.id].selected_checkclass="";
    pcbutton[input.id].group="";
	var tr= input.getElementsByTagName("tr")[0];
	for(var i=0;i<tr.childNodes.length;i++){
    	if(defaultValues["col_"+i]){
			window.location=window.location.href.split("?")[0];
   			break;
   		}
   		if(input.table_obj["col_"+i]=="active_fltr"||input.table_obj["col_"+i]=="hidden_fltr")
		        tr.childNodes[i].firstChild.value="";
   }
	        document.getElementById("results"+input.id).style.display="none";
	        Filter(input);
}
function getDefaultFilterValues(){
	(window.onpopstate = function () {
		var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);
            defaultValues = {};
            while (match = search.exec(query))
                    defaultValues[decode(match[1])] = decode(match[2]);
	})();
}
function Filter(input,sid){
	var id = input.id;
	var searchOpt=new Array();
	var farray={};
	var noFilterSelected=true;
	var tr=input.getElementsByTagName("tr");
	var tobj= input.table_obj;
	var child=tr[0].childNodes;
	for(var i=0; i<child.length;i++){
		if(tobj["col_"+i]=="active_fltr"||tobj["col_"+i]=="hidden_fltr")
			searchOpt.push(child[i].firstChild.value);
		else
			searchOpt.push("");
	}
	for(var i=ref_row+1;i<tr.length;i++){
		if(tr[i].style.display=="none") tr[i].style.display="";
		var row=getChildElem(tr[i]).childNodes;
		var row_length=row.length;
		var occurence =new Array();
		var isRowValid=true;
		if(input.num_cols == row_length){
			for (var j=0;j<row_length;j++){
				if(searchOpt[j]!=""){
					if(noFilterSelected)
						noFilterSelected=false;
					var cell_data=getCellText(row[j]).replace(/^[ ]+|[ ]+$/g,'');
					if(input.table_obj["col_"+j]=="active_fltr" || input.table_obj["col_"+j]=="hidden_fltr" ) {if(cell_data == searchOpt[j]) occurence[j]=true;else if(cell_data=="" && searchOpt[j]=="Unspecified") occurence[j]=true;}
					if(!occurence[j]) isRowValid=false;
				}
			}
			if(pcbutton[id].clicked==1){
				if(noFilterSelected)
					noFilterSelected=false;
				if(getCellText(row[row_length-1])!=pcbutton[id].selected_checkclass || getCellText(row[0])!=pcbutton[id].group){
					isRowValid=false;
				}
			}
			if(isRowValid){
				tr[i].style.display="";
				updateFilterArrays(farray,tobj,row);
			}
			else tr[i].style.display="none";
		}
	}
	if(noFilterSelected)
		document.getElementById("reset"+id).disabled="disabled";
	else
		document.getElementById("reset"+id).disabled="";
	update_dropdown(farray,id,tobj,input.num_cols,sid,searchOpt);
}
function update_dropdown(farray,id,tobj,col_count,sid,searchOpt){
	for(var i=0;i<col_count;i++){
		if(tobj["col_"+i]=="active_fltr"||tobj["col_"+i]=="hidden_fltr"){
			var current_fltr_id="flt"+i+"_"+id;
			if(current_fltr_id!=sid ||!searchOpt[i]){
				var sel_ele=document.getElementById(current_fltr_id);
				var length = sel_ele.options.length;
				for (var j = length; j >=1; j--) {
					sel_ele.remove(j);
				}
				var OptArray=farray["col_"+i].slice();
				OptArray.sort();
				for(var k=0;k<OptArray.length;k++){
					var currOpt =new Option(OptArray[k],OptArray[k],false,false);
					sel_ele.options[k+1]=currOpt;
					if(sel_ele.options[k+1].value==searchOpt[i]){sel_ele.options[k+1].selected=true;}
				}
			}
		}
	}
}
function checkClassSpecific(checkClass,groupName){
	var farray={};
	var id=document.getElementById(checkClass).value;
	var input=document.getElementById(id);
	pcbutton[id].clicked=1;
	pcbutton[id].selected_checkclass=checkClass;
	pcbutton[id].group=groupName;
    document.getElementById("reset"+id).disabled="";
	var tr=document.getElementById(id).getElementsByTagName("tr");
	var headers=getChildElem(tr[1]).childNodes;
	var index=input.table_obj["row_index"];
	for(var i=0;i<headers.length;i++){
		var header_data=getCellText(headers[i]).replace(/^[ ]+|[ ]+$/g,'');
		if(header_data=="Group") {index=i;break;}
	}
	for(var i=ref_row+1;i<tr.length;i++){
		if(tr[i].style.display=="none") tr[i].style.display="";
		var row=getChildElem(tr[i]).childNodes;
		var isRowValid=true;
		var cell_data=getCellText(row[index]);
		if(cell_data == groupName) isRowValid=true;
		else isRowValid=false;
		var row_length=row.length-1;
		cell_data=getCellText(row[row_length]);
		if(isRowValid && cell_data == checkClass){ 
			tr[i].style.display="";
			updateFilterArrays(farray,input.table_obj,row);
		}
		else tr[i].style.display="none";
	}
    document.getElementById("results"+id).innerHTML="Protocol Checks belonging to "+checkClass+" - Group "+groupName;
    document.getElementById("results"+id).style.display="";
	var searchOpt=new Array();
	update_dropdown(farray,id,input.table_obj,input.num_cols,"",searchOpt);
}
function showCheckboxes(flag,product_name) {
	var checkboxes = document.getElementById('checkboxes_'+product_name);
	if (flag==1) {
		if (checkboxes.style.display!="block") {
			checkboxes.style.display = "block";
		}
		else {
			checkboxes.style.display = "none";
		}
	}
	else if (flag==-1) {
		if (checkboxes.style.display!="none") {
			checkboxes.style.display = "none";
		}
	}
}
function show_hide_autohide(event,product_name){
	var popElement = document.getElementsByClassName("multiselect");
	var isClickInside=false;
	if(popElement.length!=0){
		for(var j=0;j<popElement.length;j++)
			if(popElement[j].contains(event.target)){isClickInside=true;break;}
		if(!isClickInside){
			showCheckboxes(-1,product_name);
		}
	}
}
function show_hide_refresh(event,product_name) {
	var historyTraversal=event.persisted||(typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
	var flag=navigator.userAgent.search("Firefox");
	if ( !historyTraversal ||( historyTraversal && flag==-1)) {
		var c = document.getElementById('checkboxes_'+product_name);
		if(c!=null){
			var x=c.innerHTML;
			c.innerHTML = x;
		}
	}
}
function show_hide(col_name,product_name) {
	var stl,dis,check,col_no,header_data;
	var checkboxes = document.getElementById('checkboxes_'+product_name);
	var c=checkboxes.getElementsByTagName("input");
	var cl=checkboxes.getElementsByTagName("label");
	var tbl  = document.getElementById('table_'+product_name);
	var rows = tbl.getElementsByTagName("tr");
	var fltr= rows[0].getElementsByTagName("td");
	var row_headers = rows[1].getElementsByTagName("th");
	if(col_name=="All")
		col_no=-1;
	else{
		var headers=getChildElem(rows[1]).childNodes;
		for(var i=0;i<headers.length;i++){
			header_data=getCellText(headers[i]).replace(/^[ ]+|[ ]+$/g,'');
			if(col_name==header_data){
				col_no=i;
				break;
			}
		}
	}	if(col_no>-2){
		if(c[col_no+1].checked){
			stl = "table-cell";
			dis="disabled";
			check=true;
		}
		else{
			stl = "none";
			dis="";
			check=false;
		}
	}
	if(col_no==-1){
		for(var col_index=1;col_index<c.length;col_index++){
			c[col_index].disabled=dis;
			c[col_index].checked=check;;
		}
	}
	for (var row_index=2; row_index<rows.length;row_index++) {
		var cels = rows[row_index].getElementsByTagName("td");
		if(col_no==-1){
			for(var col_index=0;col_index<cels.length;col_index++){
				if(typeof cl[col_index+1]!="undefined" && cl[col_index+1].style.display!="none"){
					if(col_index==col_visible_always){
						c[col_visible_always+1].checked=true;
						row_headers[col_index].style.display="table-cell";
						cels[col_index].style.display="table-cell";
					}
					else{
						row_headers[col_index].style.display=stl;
						cels[col_index].style.display=stl;
						fltr[col_index].style.display=stl;
					}
				}
			}
		}
		else{
			fltr[col_no].style.display=stl;
			row_headers[col_no].style.display=stl;
			cels[col_no].style.display=stl;
		}
	}
}
