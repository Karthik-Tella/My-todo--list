var removeSVG = '<svg style="position: absolute; width: 0; height: 0; overflow: hidden" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><symbol id="icon-bin" viewBox="0 0 32 32"><title>bin</title><path d="M4 10v20c0 1.1 0.9 2 2 2h18c1.1 0 2-0.9 2-2v-20h-22zM10 28h-2v-14h2v14zM14 28h-2v-14h2v14zM18 28h-2v-14h2v14zM22 28h-2v-14h2v14z"></path><path d="M26.5 4h-6.5v-2.5c0-0.825-0.675-1.5-1.5-1.5h-7c-0.825 0-1.5 0.675-1.5 1.5v2.5h-6.5c-0.825 0-1.5 0.675-1.5 1.5v2.5h26v-2.5c0-0.825-0.675-1.5-1.5-1.5zM18 4h-6v-1.975h6v1.975z"></path></symbol></defs></svg><svg class="icon icon-bin"><use xlink:href="#icon-bin"></use></svg>'
var completeSVG = '<svg style="position: absolute; width: 0; height: 0; overflow: hidden" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><symbol id="icon-checkmark2" viewBox="0 0 32 32"><title>checkmark2</title><path d="M12.42 28.678l-12.433-12.238 6.168-6.071 6.265 6.167 13.426-13.214 6.168 6.071-19.594 19.285zM3.372 16.441l9.048 8.905 16.208-15.953-2.782-2.739-13.426 13.214-6.265-6.167-2.782 2.739z"></path></symbol></defs></svg><svg class="icon icon-checkmark2"><use xlink:href="#icon-checkmark2"></use></svg>'

var data = localStorage.getItem('todolist')? JSON.parse(localStorage.getItem('todolist')):{
	todo: [],
	completed: [],
	deleted: [],
	date: [],
	time: [],
};
renderList();


Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) ;
}

Date.prototype.timeNow = function () {
	var hours = this.getHours();
	var mins = this.getMinutes();
	var converted = hours > 12 ? (hours%10)-2: hours;
	var counter = hours>12? 1:0; 
     return (converted +":" + mins +' '+ (counter == 1 ? "PM":"AM"));
}

function dataUpdate(){
	localStorage.setItem('todolist', JSON.stringify(data));
}

function renderList(){
	if(!data.todo.length && !data.completed.length && !data.deleted.length){
		return;
	}

	for(var i= 0; i < data.todo.length; i++){
		var value = data.todo[i];
		addItemTodo(value);
	}
	
	for(var j = 0; j< data.completed.length;j++){
		var value = data.completed[j];
		addItemTodo(value,true);
	}

	for(var k = 0; k < data.deleted.length;k++){
		var value = data.deleted[k];
		var t = data.time[k];
		var d = data.date[k];
		var list = document.createElement('li');
		list.setAttribute('id', 'history');
		var inp = document.createElement('p');
		inp.innerText = value;
		var date= document.createElement('p');
		date.setAttribute('id', 'date');
		date.innerText= d;
		var time= document.createElement('p');
		time.setAttribute('id', 'time');
		time.innerText= t;
		list.appendChild(inp);
		list.appendChild(date);
		list.appendChild(time);
		document.getElementById('history').insertBefore(list,document.getElementById('history').childNodes[0]);
	}
}

function onEnter(e, textarea)
{
var code = (e.keyCode ? e.keyCode : e.which);
if(code == 13) 
  { 
     addItem();
  }
}


document.getElementById('add').onclick = function(){
	addItem();
}

function addItem(){
		var value = document.getElementById('item').value;
		if(value){
			addItemTodo(value);
			document.getElementById('item').value = "";
			data.todo.push(value);
			//console.log(data);
			dataUpdate();
		}
}

function removeElement(){
	var item = this.parentNode.parentNode;
	var list = item.parentNode;
	var value = item.innerText;
	var target = document.getElementById('history');
	var ico = item.childNodes[1];
	var del_date = '' + new Date().today();
	var del_time = '' + new Date().timeNow();
	var date= document.createElement('p');
	date.setAttribute('id', 'date');
	date.innerText= del_date;
	var time= document.createElement('p');
	time.setAttribute('id', 'time');
	time.innerText= del_time;
	item.removeChild(ico);
	item.appendChild(date)
	item.appendChild(time)

	
	var id = list.id;
	
	if(id == 'todo'){
		data.todo.splice(data.todo.indexOf(value), 1);
	}else{
		data.completed.splice(data.completed.indexOf(value),1);
	}
	data.deleted.push(value);
	data.time.push(del_time);
	data.date.push(del_date);
	//console.log(data);
	

	target.insertBefore(item,target.childNodes[0]);
	var length = target.getElementsByTagName('li').length;
	console.log(target.childNodes[4]);
	if(length > 5){
		target.removeChild(target.childNodes[5]);
		data.deleted.splice(0 ,1);
		data.time.splice(0 ,1);
		data.date.splice(0 ,1);
	}
	dataUpdate();
	console.log(data);
}


function completElement(e)
{
	var item = this.parentNode.parentNode;
	var parent=  item.parentNode;
	var id = parent.id;
	var value = item.innerText;

	if(id == 'todo'){
		data.todo.splice(data.todo.indexOf(value),1);
		data.completed.push(value);
	}else{
		data.completed.splice(data.completed.indexOf(value),1);
		data.todo.push(value);
	}
	//console.log(data);
	dataUpdate();

	var target = (id == 'todo')? document.getElementById('completed'): document.getElementById('todo');
	target.insertBefore(item,target.childNodes[0]);
	
}

function addItemTodo(input, completed){
	var list = completed? document.getElementById('completed'):document.getElementById('todo')
	//creating a li
	var item = document.createElement('li');
	// adding text to the li
	item.innerText = input;
	//creating a div in the li
	var buttons = document.createElement('div');
	//setting the divs class to buttons
	buttons.classList.add("buttons");
	//creating a remove button
	var remove = document.createElement('button');
	//setting the buttons class as delete 
	remove.classList.add('delete');
	remove.innerHTML = removeSVG;
	remove.addEventListener('click', removeElement);
	//creating a completed button
	var complete = document.createElement('button');
	//setting the buttons class as complete
	complete.classList.add('complete');
	complete.innerHTML= completeSVG;
	complete.addEventListener('click', completElement);


	buttons.appendChild(remove);
	buttons.appendChild(complete);
	item.appendChild(buttons);
	list.insertBefore(item, list.childNodes[0])
}
//-----------------------------------------------------
//remove 





