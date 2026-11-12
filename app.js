const $ = s => document.querySelector(s);
const provinces = window.PROVINCES || [];
let selected = null, activeTab = "地理气候", chart = null;
const tabs = ["地理气候","历史文化","旅游资源","风物产业","交通区位","考点速记"];
const fields = {
"地理气候":[["地形与气候","geo"]],
"历史文化":[["历史脉络","history"],["民俗与非遗线索","culture"]],
"旅游资源":[["代表景区与遗产","sites"]],
"风物产业":[["地方风物","food"],["特色产业","industry"]],
"交通区位":[["交通网络","transport"]],
"考点速记":[["高频考点","exam"],["易混淆辨析","mix"]]
};
function norm(s){return String(s||"").replace(/(省|市|壮族自治区|回族自治区|维吾尔自治区|自治区|特别行政区)$/,"").replace("内蒙古","内蒙古").replace("广西","广西").replace("宁夏","宁夏").replace("新疆","新疆").replace("西藏","西藏");}
function getProvince(n){return provinces.find(p=>p.n===norm(n)||p.full===n||p.n===n)||null}
function renderDetail(p){
 selected=p; activeTab="地理气候";
 $("#detail").innerHTML = `<div class="province-head"><div class="region">${p.r} · ${p.tags[0]}</div><h2>${p.full}</h2><p>行政中心：${p.cap}　/　区域：${p.r}</p><div class="tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div></div><div class="tabs">${tabs.map(t=>`<button class="tab ${t===activeTab?"active":""}" data-tab="${t}">${t}</button>`).join("")}</div><div class="facts" id="facts"></div><div class="note">备考提示：本卡片为知识框架摘要。涉及名录批次、景区等级、数据年份及考试口径时，请以当年官方资料和教材为准。</div>`;
 renderFacts();
 $("#detail").querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{activeTab=b.dataset.tab;$("#detail").querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x===b));renderFacts()}));
 if(chart){chart.dispatchAction({type:"downplay",seriesIndex:0});chart.dispatchAction({type:"highlight",seriesIndex:0,name:p.full});}
}
function renderFacts(){
 const list=fields[activeTab]||[];
 $("#facts").innerHTML=list.map(([title,key])=>`<div class="fact"><h4>${title}</h4><p>${selected[key]||"待补充核验"}</p></div>`).join("");
}
function filtered(){
 const q=$("#search").value.trim().toLowerCase(), region=$("#regionFilter").value, category=$("#categoryFilter").value;
 return provinces.filter(p=>(!region||p.r===region)&&(!q||[p.n,p.full,p.cap,p.r,...p.tags,p.geo,p.history,p.culture,p.sites,p.food,p.industry,p.transport,p.exam,p.mix].join(" ").toLowerCase().includes(q))&&(!category||({
"地理气候":p.geo,"历史文化":p.history+" "+p.culture,"旅游资源":p.sites,"风物产业":p.food+" "+p.industry
}[category]||"").toLowerCase().includes(q)));
}
function renderChips(){
 const list=filtered(); $("#provinceChips").innerHTML=list.length?list.map(p=>`<button class="chip ${selected&&selected.n===p.n?"active":""}" data-name="${p.n}">${p.n}</button>`).join(""):'<div class="empty-results">没有找到匹配地区，请调整搜索条件。</div>';
 $("#provinceChips").querySelectorAll("[data-name]").forEach(b=>b.addEventListener("click",()=>{const p=getProvince(b.dataset.name);if(p)renderDetail(p)}));
}
["search","regionFilter","categoryFilter"].forEach(id=>$("#"+id).addEventListener(id==="search"?"input":"change",()=>{renderChips();if(chart)updateMapColors()}));
function updateMapColors(){
 if(!chart)return;const allowed=new Set(filtered().map(p=>p.n));
 chart.setOption({series:[{data:provinces.map(p=>({name:p.full,value:allowed.has(p.n)?1:0}))}]});
}
async function initMap(){
 const el=$("#map"); if(!window.echarts){$("#mapError").style.display="block";return}
 chart=echarts.init(el);
 try{
 const response=await fetch("https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json");
 if(!response.ok)throw new Error("map fetch failed");
 const geo=await response.json(); echarts.registerMap("china-study",geo);
 chart.setOption({tooltip:{trigger:"item",formatter:p=>{const d=getProvince(p.name);return d?`<b>${d.full}</b><br>${d.r} · ${d.cap}`:p.name}},visualMap:{show:false,min:0,max:1,inRange:{color:["#e8e8df","#b9cfc0"]}},series:[{type:"map",map:"china-study",roam:true,zoom:1.12,selectedMode:false,emphasis:{label:{show:true,color:"#20352c"},itemStyle:{areaColor:"#d9b879",borderColor:"#8e7146"}},label:{show:true,fontSize:9,color:"#66756e"},itemStyle:{areaColor:"#dce8df",borderColor:"#f7f5ee",borderWidth:1},data:provinces.map(p=>({name:p.full,value:1}))}]});
 chart.on("click",p=>{const d=getProvince(p.name);if(d)renderDetail(d)});
 window.addEventListener("resize",()=>chart&&chart.resize());
 }catch(e){$("#mapError").style.display="block";$("#mapError").innerHTML='地图底图加载失败。你仍可通过搜索框和下方省份列表查看全部省份。<br>请检查网络后刷新页面。';}
}
renderChips();initMap();
