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
		item.dataset.fastWzrd!=="companies" && item.dataset.fastWzrd!=="ydo" && 
		item.dataset.fastWzrd!=="videowiz" && item.dataset.fastWzrd!=="images" && 
		item.dataset.fastWzrd!=="entity_search"){
		yandex_serp.push(item.querySelector(serp_selector).innerText);
	}
});
const yandex_serp_print=yandex_serp.map((ya_serp, i)=>`№${i+1+pagination_yandex_serp()*10} - ${ya_serp}`);
console.log(yandex_serp_print.join(`\n`));

/*2. Парсинг сайтов из органической выдачи из Гугла */
const google_serp=[];
document.querySelectorAll(".g").forEach((item)=>{ 
	let position_arrow = item.querySelector("cite").innerText.search(" ›");
	google_serp.push(item.querySelector("cite").innerText.slice(0, position_arrow));
});
const google_serp_print=google_serp.map((go_serp, i)=>`№${i} - ${go_serp}`);
console.log(google_serp_print.join(`\n`));

/*3. Проверка нахождения элементов на странице */
const nodes_site=['title', 'h1', 'strong', 'b', 'i', 'em'];
nodes_site.map(node_length_text=>{let node_length_text_el = document.querySelectorAll(node_length_text);
console.log(`Количество элементов ${node_length_text} = ${node_length_text_el.length}`);
if(node_length_text_el.length>0){
	node_length_text_el.forEach((item)=>{console.log(`Текст элеманта ${node_length_text}: ${item.innerText}`)})}
});

/*4. Проверка на внешние ссылки */
const links_site=[];
document.querySelectorAll("a").forEach((item)=>{links_site.push(item.href)});
const nofollow_links=(site_address)=>{
	const nofollow_link=links_site.filter(link_site=>link_site.search(site_address)==-1);
	console.log(nofollow_link.join(`\n`));
}
nofollow_links(window.location.hostname);

/*5. Проверка существования robots.txt и sitemap.xml и их содержание*/
clear();
const input_rs=['robots.txt', 'sitemap.xml'];
input_rs.map(async (rs)=>{
	let response = await fetch(`/${rs}`);
	let status_file = await response.ok;
	let text_file = await response.text(); // прочитать тело ответа как текст
	if (status_file) {console.log(`Файл ${rs} есть в корне сайта! Его содержимое: 
	${text_file}`);} 
	else {console.log(`Файл ${rs} не найден!`);}
});

/*6. Проверка на наличие alt у изображений*/
const image_alt=[]; const image_no_alt=[];
document.querySelectorAll("img").forEach((has_alt)=>{
	if (has_alt.alt.search(/(.?[a-zA-Zа-яёА-ЯЁ]{3,}\s?.*)/gm)>-1) {image_alt.push(has_alt.alt);} 
	else {image_no_alt.push(`Alt: ${has_alt.alt}, адрес: ${has_alt.src}`);} 
});
if (image_no_alt.length>0) {console.log(`Атрибут alt отсутствует или некачественный у следующих изображений:
${image_no_alt.join(`\n`)}`);} 
if (image_alt.length>0) {console.log(`Текст атрибута alt:
${image_alt.join(`\n`)}`);} 