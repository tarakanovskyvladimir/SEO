/*1. Парсинг Covid-19*/
clear();
const people_all = []; const people_ill=[];
const people_died=[]; const people_health=[];
document.querySelectorAll(".user-maps-features-view__feature>.user-maps-features-view__feature-icon").forEach((item)=>{
	if (item.innerText!=="") {people_all.push(Number(item.innerText));} 
	else {people_all.push(Number(item.parentElement.title));}
});
people_all.map((people, index) => {
	if(index%3 === 0){people_died.push(people);}
	if(index%3 === 1){people_health.push(people);}
	if(index%3 === 2){people_ill.push(people);}
});
console.log(`Умерли:
${people_died.join(`\n`)}

Выздоровели:
${people_health.join(`\n`)}

Заразились:
${people_ill.join(`\n`)}`);