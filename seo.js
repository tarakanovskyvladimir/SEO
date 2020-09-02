/*1. Парсинг сайтов из органической выдачи из Яндекса */
clear();
const yandex_serp = [];
let serp_selector=".path .link b" || ".typo a";
const pagination_yandex_serp = () =>{
	const current_url=window.location.href.search("p=");
	const pagination_page=Number(window.location.href.slice(current_url+2))||0;
	return pagination_page;
}
document.querySelectorAll(".serp-item").forEach((item)=>{
	if(item.innerText.search("реклама")==-1 && item.querySelector(".link") !==null && 
		item.children[0].classList.contains("composite")!==true && item.dataset.fastWzrd!=="ydo"
		&& item.dataset.fastWzrd!=="companies" && item.dataset.fastWzrd!=="videowiz" 
		&& item.dataset.fastWzrd!=="images" && item.dataset.fastWzrd!=="entity_search"
		&& item.dataset.fastWzrd!=="market_constr"){
		yandex_serp.push(item.querySelector(serp_selector).innerText);
	}
});
const yandex_serp_with_pos=yandex_serp.map((ya_serp, i)=>`№${i+1+pagination_yandex_serp()*10} - ${ya_serp}`);
console.log(`${yandex_serp.join(`\t`)}
${yandex_serp_with_pos.join(`\n`)}`);

/*2. Парсинг сайтов из органической выдачи из Гугла */
clear();
const google_serp=[];
document.querySelectorAll(".g").forEach((item)=>{ 
	let position_arrow = item.querySelector("cite").innerText.search(" ›");
	google_serp.push(item.querySelector("cite").innerText.slice(0, position_arrow));
});
const google_serp_with_pos=google_serp.map((go_serp, i)=>`№${i} - ${go_serp}`);
console.log(`${google_serp.join(`\t`)}
${google_serp_with_pos.join(`\n`)}`);

/*3. Проверка нахождения элементов на странице */
const nodes_site=['title','meta[name="description"]', 'h1', 'strong', 'b', 'i', 'em'];
nodes_site.map(node_text=>{let node_text_el = document.querySelectorAll(node_text);
console.log(`Количество элементов ${node_text} = ${node_text_el.length}`);
if(node_text_el.length>0){
	if (node_text.search('meta')===-1) {node_text_el.forEach((item)=>{console.log(`Текст элемента ${node_text}: ${item.innerText}`)})} 
	else {node_text_el.forEach((item)=>{console.log(`Текст элемента ${node_text}: ${item.content}`)})}	
}
});

/*4. Проверка на количество ссылок и внешние ссылки */
clear();
const links_site=[];
document.querySelectorAll("a").forEach((item)=>{links_site.push(item.href)});
if (links_site.length>100) {const last_links=links_site.slice(100).join(`\n`);
console.log(`Страница содержит на ${links_site.length-100} ссылок больше, чем может обойти поисковик:
Не вошедшие в обход поисковика ссылки:
${last_links}`);} 
else {console.log('Все нормально! Поисковик проходит по всем ссылкам!');}
const nofollow_links=(site_address)=>{
	const nofollow_link=links_site.filter(link_site=>link_site.search(site_address)==-1);
	if (nofollow_link.length>0) {
		console.log(`Проверьте, чтобы следующие ссылки открывались в новой вкладке и имели атрибут rel="nofollow":
			${nofollow_link.join(`\n`)}`);} 
	else {console.log('Внешние ссылки не найдены!');}
}
nofollow_links(window.location.hostname);

/*5. Проверка существования robots.txt и sitemap.xml и их содержание*/
clear();
const input_rs=['robots.txt', 'sitemap.xml'];
input_rs.map(async (rs)=>{
	let response = await fetch(`/${rs}`);
	let status_file = await response.ok;
	let text_file = await response.text();
	if (status_file) {console.log(`Файл ${rs} есть в корне сайта! Его содержимое: 
	${text_file}`);} 
	else {console.log(`Файл ${rs} не найден!`);}
});

/*6. Проверка на наличие alt у изображений*/
clear();
const image_alt=[]; const image_no_alt=[];
document.querySelectorAll("img").forEach((has_alt)=>{
	if (has_alt.alt.search(/(.?[a-zA-Zа-яёА-ЯЁ]{3,}\s?.*)/gm)>-1) {image_alt.push(has_alt.alt);} 
	else {image_no_alt.push(`Alt: ${has_alt.alt}, адрес: ${has_alt.src}`);} 
});
if (image_no_alt.length>0) {console.log(`Атрибут alt отсутствует или некачественный у следующих изображений:
${image_no_alt.join(`\n`)}`);} 
if (image_alt.length>0) {console.log(`Текст атрибута alt:
${image_alt.join(`\n`)}`);} 

/*7. Проверка веса изображения по сайту.*/
clear(); 
let body_class='detail-catalog-page';
document.querySelectorAll(`.${body_class} img`).forEach(async (check_weight)=>{
	let response = await fetch(check_weight.src);
	let weight=Math.floor(Number(response.headers.get('Content-Length'))/1024);
	let w = Number(check_weight.naturalWidth);
	let h = Number(check_weight.naturalHeight);
	let control_point=(w+h)*0.05;
	if (w>1980 || h>1000) {
		console.log(`Размеры изображения ${check_weight.src} не должны превышать 1980px по ширине и 1000px по высоте!`);} 
	else if (weight>control_point) {
		console.log(`Вес изображения ${check_weight.src} рекомендуется оптимизировать`);} 
	else {console.log(`Вес изображения ${check_weight.src} оптимизирован!`);}
});

/*8. Проверка длины текста*/
let container_class='catalog_detail';
let len_text=document.querySelector(`#${container_class}`).innerText.length;
if (len_text<400) {
	console.log(`Cтраница может быть признана неявным дублем! Добавьте текст в количестве ${400-len_text} символов!`);
} else if (len_text>800) {
	console.log(`Объем текста больше удобного на ${len_text-800} символов! Пожалуйста, сократите его!`);
} else {console.log('Страница соответствует требованиям Яндекс и Google');}

/*9. Проверка микроразметки на сайте*/
let micro_props='itemprop'||'property';
let select_micro_props=document.querySelectorAll(`*[${micro_props}]`);
if (select_micro_props.length>0) {
	select_micro_props.forEach((micro_prop)=>{
		console.log(micro_prop.textContent);
	})	
}