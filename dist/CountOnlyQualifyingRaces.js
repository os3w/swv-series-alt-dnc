/*!
 * name=Count Only Qualifying Races
 * dependencies=
 *
 * author=os3w (https://github.com/os3w)
 * version=0.1.0-beta-01
 * date=2023-07-25
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
 * SwvSeriesAltDnc v0.1.0-beta-01 2023-07-25 09:55:17
 * https://github.com/os3w/swv-series-alt-dnc
 * Copyright (C) 2023 os3w (https://github.com/os3w).
 * MIT license.
 */
!function(){"use strict";const t="DNQ",e=["DNC","OOD"],s=t=>!0!==t.isNotSailed&&t,o=(e,s)=>{if(e.rank===t){if(s.rank!==t)return 1}else if(s.rank===t)return-1;const o=e.net-s.net;return o||0},n=(t,e)=>{if(e<1)return[];const s=t.slice().sort(((t,e)=>t-e)).slice(-e).reverse(),o=[];let n=NaN,r=NaN;for(const e of s)e===n?(r=t.indexOf(e,r+1),o.push(r)):(r=t.indexOf(e),n=e,o.push(r));return o},r=t=>{c(t),i(t)},c=t=>{for(const e of t.competitors){let t=0,o=0;const r=[];for(const n of e.results){const e=s(n);if(!e){r.push(-1/0);continue}const{isDiscard:c,score:i}=e;c&&(++t,e.isDiscard=!1),o+=i,r.push(i)}const c=n(r,t);let i=o;for(const t of c){const o=s(e.results[t]);o&&(o.isDiscard=!0,i-=o.score)}e.total=o,e.net=i}},i=e=>{console.log("Before",JSON.parse(JSON.stringify(e.competitors))),e.competitors.sort(o);let s=0;for(const o of e.competitors){if(++s,o.rank===t)break;o.rank=s}console.log("After",JSON.parse(JSON.stringify(e.competitors)))
},a=t=>null===t?0:Math.round(10*parseFloat(t)),l=({code:t,isDiscard:e,score:s})=>{const o=t?u(s)+" "+t:u(s);return e?"("+o+")":o},u=t=>(t/10).toFixed(1);class m{constructor(){this.competitors=[],this.columns=[],this.raceCount=0,this.qualifiedCount=0}parse(t){for(const e of t.children)switch(e.nodeName){case"COLGROUP":this.parseColGroup(e);break;case"TBODY":this.parseSummaryRows(e)}return this}parseColGroup(t){for(const e of t.children){if("COL"!==e.nodeName)continue;const{className:t}=e;switch(t){case"rank":case"total":case"nett":this.columns.push({type:t});break;case"race":this.columns.push({type:t,index:this.raceCount}),++this.raceCount;break;default:this.columns.push({type:"label",name:t})}}}parseRaceScore(t){const e=t.innerHTML;if("&nbsp;"===e)return{element:t,html:e,isNotSailed:!0};const{isCts:s,isDiscard:o,score:n,code:r}=f(e);return{element:t,html:e,isCts:s,isDiscard:o,score:n,code:r}}parseSummaryRow(e){const s={rank:NaN,net:NaN,total:NaN,results:[]};s.elements={competitor:e}
;let o=0;for(const n of e.children){if("TD"!==n.nodeName)continue;const e=this.columns[o];switch(++o,e.type){case"rank":s.elements.rank=n,s.rank=d(n.textContent),s.rank!==t&&++this.qualifiedCount;break;case"total":s.elements.total=n,s.total=a(n.textContent);break;case"nett":s.elements.net=n,s.net=a(n.textContent);break;case"race":s.results[e.index]=this.parseRaceScore(n)}}return s}parseSummaryRows(t){for(const e of t.children)"TR"===e.nodeName&&e.classList.contains("summaryrow")&&this.competitors.push(this.parseSummaryRow(e))}}const d=e=>null===e||e===t?t:parseFloat(e),f=t=>{const s="("===t.charAt(0),o=s?t.slice(1,-1):t,n=a(o),r=o.indexOf(" "),c=r<0?null:o.slice(r+1),i=null===c||(t=>!e.includes(t))(c);return{isCts:i,isDiscard:s,score:n,code:c}},p=t=>{var e;for(const o of t.competitors){const{elements:t,rank:n,results:r}=o;(null===(e=null==t?void 0:t.competitor)||void 0===e?void 0:e.parentElement)&&t.competitor.parentElement.insertBefore(t.competitor,null),
(null==t?void 0:t.rank)&&(t.rank.textContent="number"==typeof n?C(n):n);for(const t of r){const e=s(t);e&&(t.element.textContent=l(e))}(null==t?void 0:t.net)&&t.total&&(t.net.textContent=u(o.net),t.total.textContent=u(o.total))}},h=(t,e)=>{const o=[];for(let n=0;n<e;++n){const e={};for(const{results:o}of t.competitors){const t=s(o[n]);if(t)!0!==e.isSailed&&(e.isSailed=!0,e.ctsCount=0),t.isCts&&++e.ctsCount;else{if(e.isSailed)continue;e.isSailed=!1}}o.push(e)}return o},C=t=>{let e="th";switch(t%10){case 1:t%100!=11&&(e="st");break;case 2:t%100!=12&&(e="nd");break;case 3:t%100!=13&&(e="rd")}return t+e};class N{parse(t){const e=t.querySelectorAll(".summarytitle"),s=[];return e.forEach((t=>{const e=(t=>{var e,s;const o={id:t.id.slice(7),caption:"",title:null!==(e=t.textContent)&&void 0!==e?e:"",competitors:[],resultsColumns:[],qualifiedCount:0,races:[]};let n=t,r=0;for(;n=n.nextElementSibling,
n&&!n.classList.contains("summarytitle");)if(n.classList.contains("summarycaption"))o.caption=null!==(s=n.textContent)&&void 0!==s?s:"";else if(n.classList.contains("summarytable")){const t=(c=n,(new m).parse(c));r=t.raceCount,o.qualifiedCount=t.qualifiedCount,o.competitors=t.competitors,o.resultsColumns=t.columns}var c;return o.races=h(o,r),o})(t);e&&s.push(e)})),{groups:s}}}const k=t=>(t.isSailed=!1,t),y=e=>{const{competitors:o,races:n,qualifiedCount:r}=e;for(let e=0;e<n.length;++e){const i=!0===(c=n[e]).isSailed&&c;if(!i)continue;let a=!1;for(const n of o){a||n.rank===t||(a=!0);const o=s(n.results[e]);!1!==o&&("DNC"===o.code&&(o.score=10*(Math.max(r,i.ctsCount)+1)))}a||k(i)}var c};document.addEventListener("DOMContentLoaded",(()=>{const t=(e=document,(new N).parse(e));var e;for(const e of t.groups)y(e),r(e),p(e);(()=>{const t=document.querySelector(".seriestitle"),e=document.createElement("div")
;e.innerHTML="DNC scores and races sailed are provisional based on the number of qualifiers.<br><small>Rescored by Count Only Qualifying Races effect v0.1.0-beta-01</small>",null==t||t.insertAdjacentElement("afterend",e)})()}))}();
