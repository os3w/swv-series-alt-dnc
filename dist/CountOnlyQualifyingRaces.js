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
 * SwvSeriesAltDnc v0.1.0-beta-01 2023-07-25 16:38:07
 * https://github.com/os3w/swv-series-alt-dnc
 * Copyright (C) 2023 os3w (https://github.com/os3w).
 * MIT license.
 */
!function(){"use strict";const t="DNQ",e=["DNC","OOD"],s=t=>null===t||!e.includes(t),o=t=>!0!==t.isNotSailed&&t,n=(e,s)=>{if(e.rank===t){if(s.rank!==t)return 1}else if(s.rank===t)return-1;const o=e.net-s.net;return o||0},r=(t,e)=>{if(e<1)return[];const s=t.slice().sort(((t,e)=>t-e)).slice(-e).reverse(),o=[];let n=NaN,r=NaN;for(const e of s)e===n?(r=t.indexOf(e,r+1),o.push(r)):(r=t.indexOf(e),n=e,o.push(r));return o},a=t=>{c(t),i(t)},c=t=>{for(const e of t.competitors){let t=0,s=0;const n=[];for(const r of e.results){const e=o(r);if(!e){n.push(-1/0);continue}const{isDiscard:a,score:c}=e;a&&(++t,e.isDiscard=!1),s+=Math.round(10*c),n.push(c)}const a=r(n,t);let c=s;for(const t of a){const s=o(e.results[t]);s&&(s.isDiscard=!0,c-=Math.round(10*s.score))}e.total=s/10,e.net=c/10}},i=e=>{console.log("Before",JSON.parse(JSON.stringify(e.competitors))),e.competitors.sort(n);let s=0;for(const o of e.competitors){if(++s,o.rank===t)break;o.rank=s}
console.log("After",JSON.parse(JSON.stringify(e.competitors)))},l=t=>null===t?0:parseFloat(t),u=({code:t,isDiscard:e,score:s})=>{const o=t?m(s)+" "+t:m(s);return e?"("+o+")":o},m=t=>t.toFixed(1);class d{constructor(){this.competitors=[],this.columns=[],this.raceCount=0,this.qualifiedCount=0}parse(t){for(const e of t.children)switch(e.nodeName){case"COLGROUP":this.parseColGroup(e);break;case"TBODY":this.parseSummaryRows(e)}return this}parseColGroup(t){for(const e of t.children){if("COL"!==e.nodeName)continue;const{className:t}=e;switch(t){case"rank":case"total":case"nett":this.columns.push({type:t});break;case"race":this.columns.push({type:t,index:this.raceCount}),++this.raceCount;break;default:this.columns.push({type:"label",name:t})}}}parseRaceScore(t){const e=t.innerHTML;if("&nbsp;"===e)return{element:t,html:e,isNotSailed:!0};const{isDiscard:s,score:o,code:n}=p(e);return{element:t,html:e,isDiscard:s,score:o,code:n}}parseSummaryRow(e){const s={rank:NaN,net:NaN,total:NaN,results:[]}
;s.elements={competitor:e};let o=0;for(const n of e.children){if("TD"!==n.nodeName)continue;const e=this.columns[o];switch(++o,e.type){case"rank":s.elements.rank=n,s.rank=f(n.textContent),s.rank!==t&&++this.qualifiedCount;break;case"total":s.elements.total=n,s.total=l(n.textContent);break;case"nett":s.elements.net=n,s.net=l(n.textContent);break;case"race":s.results[e.index]=this.parseRaceScore(n)}}return s}parseSummaryRows(t){for(const e of t.children)"TR"===e.nodeName&&e.classList.contains("summaryrow")&&this.competitors.push(this.parseSummaryRow(e))}}const f=e=>null===e||e===t?t:parseFloat(e),p=t=>{const e="("===t.charAt(0),o=e?t.slice(1,-1):t,n=l(o),r=o.indexOf(" "),a=r<0?null:o.slice(r+1);return{isCts:null===a||s(a),isDiscard:e,score:n,code:a}},h=t=>{var e;for(const s of t.competitors){const{elements:t,rank:n,results:r}=s;(null===(e=null==t?void 0:t.competitor)||void 0===e?void 0:e.parentElement)&&t.competitor.parentElement.insertBefore(t.competitor,null),
(null==t?void 0:t.rank)&&(t.rank.textContent="number"==typeof n?N(n):n);for(const t of r){const e=o(t);e&&(t.element.textContent=u(e))}(null==t?void 0:t.net)&&t.total&&(t.net.textContent=m(s.net),t.total.textContent=m(s.total))}},C=(t,e)=>{const n=[];for(let r=0;r<e;++r){const e={isSailed:!1,cameToStartArea:0};for(const{results:n}of t.competitors){const t=o(n[r]);t?(e.isSailed=!0,s(t.code)&&++e.cameToStartArea):e.isSailed}n.push(e)}return n},N=t=>{let e="th";switch(t%10){case 1:t%100!=11&&(e="st");break;case 2:t%100!=12&&(e="nd");break;case 3:t%100!=13&&(e="rd")}return t+e};class k{parse(t){const e=t.querySelectorAll(".summarytitle"),s=[];return e.forEach((t=>{const e=(t=>{var e,s;const o={id:t.id.slice(7),caption:"",title:null!==(e=t.textContent)&&void 0!==e?e:"",competitors:[],qualifiedCount:0,races:[]};let n=t,r=0;for(;n=n.nextElementSibling,
n&&!n.classList.contains("summarytitle");)if(n.classList.contains("summarycaption"))o.caption=null!==(s=n.textContent)&&void 0!==s?s:"";else if(n.classList.contains("summarytable")){const t=(a=n,(new d).parse(a));r=t.raceCount,o.qualifiedCount=t.qualifiedCount,o.competitors=t.competitors}var a;return o.races=C(o,r),o})(t);e&&s.push(e)})),{groups:s}}}const S=e=>{const{competitors:s,races:n,qualifiedCount:r}=e;for(let e=0;e<n.length;++e){const a=n[e];if(!a.isSailed)continue;let c=!1;for(const n of s){c||n.rank===t||(c=!0);const s=o(n.results[e]);!1!==s&&("DNC"===s.code&&(s.score=Math.max(r,a.cameToStartArea)+1))}c||(a.isSailed=!1)}};document.addEventListener("DOMContentLoaded",(()=>{const t=(e=document,(new k).parse(e));var e;for(const e of t.groups)S(e),a(e),h(e);(()=>{const t=document.querySelector(".seriestitle"),e=document.createElement("div")
;e.innerHTML="DNC scores and races sailed are provisional based on the number of qualifiers.<br><small>Rescored by Count Only Qualifying Races effect v0.1.0-beta-01</small>",null==t||t.insertAdjacentElement("afterend",e)})()}))}();
