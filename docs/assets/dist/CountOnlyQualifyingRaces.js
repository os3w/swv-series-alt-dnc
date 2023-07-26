/*!
 * name=Count Only Qualifying Races
 * dependencies=
 *
 * author=os3w (https://github.com/os3w)
 * version=0.2.0-beta-01
 * date=2023-07-26
 * url=https://github.com/os3w/swv-series-alt-dnc
 *
 * Exclude races and rescore DNC results based on the number of competitors
 * qualifying according to the amendments to the Racing Rules of Sailing
 * described at https://github.com/os3w/swv-series-alt-dnc#count-only-qualifying-races.
 *
 * Note that this effect only modifies the results that are DISPLAYED when a
 * results file is viewed in a browser with JavaScript enabled; the results
 * stored in the html file are unchanged. For more information see
 * https://github.com/os3w/swv-series-alt-dnc#result-modifying-effects.
 */
/*!
 * SwvSeriesAltDnc v0.2.0-beta-01 2023-07-26 20:35:06
 * https://github.com/os3w/swv-series-alt-dnc
 * Copyright (C) 2023 os3w (https://github.com/os3w).
 * MIT license.
 */
!function(){"use strict";const t="DNQ",e=["DNC","OOD"],s=t=>null===t||!e.includes(t),o=t=>!0!==t.isNotSailed&&t,n=(e,s)=>{if(e.rank===t){if(s.rank!==t)return 1}else if(s.rank===t)return-1;const o=e.net-s.net;return o||0},r=(t,e)=>{if(e<1)return[];const s=t.slice().sort(((t,e)=>t-e)).slice(-e).reverse(),o=[];let n=NaN,r=NaN;for(const e of s)e===n?(r=t.indexOf(e,r+1),o.push(r)):(r=t.indexOf(e),n=e,o.push(r));return o},c=e=>{(t=>{for(const e of t.competitors){let t=0,s=0;const n=[];for(const r of e.results){const e=o(r);if(!e){n.push(-1/0);continue}const{isDiscard:c,score:a}=e;c&&(++t,e.isDiscard=!1),s+=Math.round(10*a),n.push(a)}const c=r(n,t);let a=s;for(const t of c){const s=o(e.results[t]);s&&(s.isDiscard=!0,a-=Math.round(10*s.score))}e.total=s/10,e.net=a/10}})(e),(e=>{console.log("Before",JSON.parse(JSON.stringify(e.competitors))),e.competitors.sort(n);let s=0;for(const o of e.competitors){if(++s,o.rank===t)break;o.rank=s}
console.log("After",JSON.parse(JSON.stringify(e.competitors)))})(e)},a=t=>null===t?0:parseFloat(t),i=t=>{let e="th";switch(t%10){case 1:t%100!=11&&(e="st");break;case 2:t%100!=12&&(e="nd");break;case 3:t%100!=13&&(e="rd")}return t+e},l=({code:t,isDiscard:e,score:s})=>{const o=t?u(s)+" "+t:u(s);return e?"("+o+")":o},u=t=>t.toFixed(1);class m{constructor(){this.competitors=[],this.columns=[],this.raceCount=0,this.qualifiedCount=0}parse(t){for(const e of t.children)switch(e.nodeName){case"COLGROUP":this.parseColGroup(e);break;case"TBODY":this.parseSummaryRows(e)}return this}parseColGroup(t){for(const e of t.children){if("COL"!==e.nodeName)continue;const{className:t}=e;switch(t){case"rank":case"total":case"nett":this.columns.push({type:t});break;case"race":this.columns.push({type:t,index:this.raceCount}),++this.raceCount;break;default:this.columns.push({type:"label",name:t})}}}parseRaceScore(t){const e=t.innerHTML;if("&nbsp;"===e)return{element:t,html:e,isNotSailed:!0}
;const{isDiscard:s,score:o,code:n}=f(e);return{element:t,html:e,isDiscard:s,score:o,code:n}}parseSummaryRow(e){const s={rank:NaN,net:NaN,total:NaN,results:[]};s.elements={competitor:e};let o=0;for(const n of e.children){if("TD"!==n.nodeName)continue;const e=this.columns[o];switch(++o,e.type){case"rank":s.elements.rank=n,s.rank=d(n.textContent),s.rank!==t&&++this.qualifiedCount;break;case"total":s.elements.total=n,s.total=a(n.textContent);break;case"nett":s.elements.net=n,s.net=a(n.textContent);break;case"race":s.results[e.index]=this.parseRaceScore(n)}}return s}parseSummaryRows(t){for(const e of t.children)"TR"===e.nodeName&&e.classList.contains("summaryrow")&&this.competitors.push(this.parseSummaryRow(e))}}const d=e=>null===e||e===t?t:parseFloat(e),f=t=>{const e="("===t.charAt(0),o=e?t.slice(1,-1):t,n=a(o),r=o.indexOf(" "),c=r<0?null:o.slice(r+1);return{isCts:null===c||s(c),isDiscard:e,score:n,code:c}},p=t=>{var e;for(const s of t.competitors){const{elements:t,rank:n,results:r}=s
;(null===(e=null==t?void 0:t.competitor)||void 0===e?void 0:e.parentElement)&&t.competitor.parentElement.insertBefore(t.competitor,null),(null==t?void 0:t.rank)&&(t.rank.textContent="number"==typeof n?i(n):n);for(const t of r){const e=o(t);e&&(t.element.textContent=l(e))}(null==t?void 0:t.net)&&t.total&&(t.net.textContent=u(s.net),t.total.textContent=u(s.total))}},h=(t,e)=>{const n=[];for(let r=0;r<e;++r){const e={isSailed:!1,countCameToStart:0};for(const{results:n}of t.competitors){const t=o(n[r]);t?(e.isSailed=!0,s(t.code)&&++e.countCameToStart):e.isSailed}n.push(e)}return n};class C{parse(t){const e={groups:[]};return t.querySelectorAll(".summarytitle").forEach((t=>{const s=(t=>{var e,s;const o={id:t.id.slice(7),caption:"",title:null!==(e=t.textContent)&&void 0!==e?e:"",competitors:[],qualifiedCount:0,races:[]};let n=t,r=0;for(;n=n.nextElementSibling,
n&&!n.classList.contains("summarytitle");)if(n.classList.contains("summarycaption"))o.caption=null!==(s=n.textContent)&&void 0!==s?s:"";else if(n.classList.contains("summarytable")){const t=(c=n,(new m).parse(c));r=t.raceCount,o.qualifiedCount=t.qualifiedCount,o.competitors=t.competitors}var c;return o.races=h(o,r),o})(t);s&&e.groups.push(s)})),e}}const N=e=>{const{competitors:s,races:n,qualifiedCount:r}=e;for(let e=0;e<n.length;++e){const c=n[e];if(!c.isSailed)continue;let a=!1;for(const n of s){a||n.rank===t||(a=!0);const s=o(n.results[e]);!1!==s&&("DNC"===s.code&&(s.score=Math.max(r,c.countCameToStart)+1))}a||(c.isSailed=!1)}};document.addEventListener("DOMContentLoaded",(()=>{const t=(e=document,(new C).parse(e));var e;for(const e of t.groups)N(e),c(e),p(e);(()=>{const t=document.querySelector(".seriestitle"),e=document.createElement("div")
;e.innerHTML="DNC scores and races sailed are provisional based on the number of qualifiers.<br><small>Rescored by Count Only Qualifying Races effect v0.2.0-beta-01</small>",null==t||t.insertAdjacentElement("afterend",e)})()}))}();
