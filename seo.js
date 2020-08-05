/*1. Парсинг сайтов из органической выдачи из Яндекса */
document.querySelectorAll(".serp-item").forEach(function(item){
	if(item.innerText.search("реклама")==-1 && item.querySelector(".link") !==null){
		console.log(item.querySelector(".path .link b").innerText);
	}
});

/*2. Парсинг сайтов из органической выдачи из Гугла */
document.querySelectorAll(".g").forEach(function(item){ 
	let position_arrow = item.querySelector("cite").innerText.search(" ›");
	console.log(item.querySelector("cite").innerText.slice(0, position_arrow));
});

/*3. Проверка нахождения элементов на странице */
const nodes_site=['title', 'h1', 'strong', 'b', 'i', 'em'];
nodes_site.map(node_length_text=>{let node_length_text_el = document.querySelectorAll(node_length_text);
console.log(`Количество элементов ${node_length_text} = ${node_length_text_el.length}`);
if(node_length_text_el.length>0){node_length_text_el.forEach(function (item){console.log(`Текст элеманта ${node_length_text}: ${item.innerText}`)})}
});

/*4. Проверка на внешние ссылки */
const links_site=[];
document.querySelectorAll("a").forEach(function(item){links_site.push(item.href)}); 
links_site.filter(link_site=>link_site.search("santekhnikashchelkovo.com")==-1).map(link_site=>console.log(link_site));