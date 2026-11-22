var j=globalThis,B=j.ShadowRoot&&(j.ShadyCSS===void 0||j.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,te=Symbol(),fe=new WeakMap,T=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(B&&e===void 0){let n=t!==void 0&&t.length===1;n&&(e=fe.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&fe.set(t,e))}return e}toString(){return this.cssText}},ge=r=>new T(typeof r=="string"?r:r+"",void 0,te),P=(r,...e)=>{let t=r.length===1?r[0]:e.reduce((n,s,i)=>n+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[i+1],r[0]);return new T(t,r,te)},_e=(r,e)=>{if(B)r.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let n=document.createElement("style"),s=j.litNonce;s!==void 0&&n.setAttribute("nonce",s),n.textContent=t.cssText,r.appendChild(n)}},ne=B?r=>r:r=>r instanceof CSSStyleSheet?(e=>{let t="";for(let n of e.cssRules)t+=n.cssText;return ge(t)})(r):r;var{is:Ze,defineProperty:et,getOwnPropertyDescriptor:tt,getOwnPropertyNames:nt,getOwnPropertySymbols:rt,getPrototypeOf:st}=Object,F=globalThis,ye=F.trustedTypes,it=ye?ye.emptyScript:"",ot=F.reactiveElementPolyfillSupport,L=(r,e)=>r,re={toAttribute(r,e){switch(e){case Boolean:r=r?it:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,e){let t=r;switch(e){case Boolean:t=r!==null;break;case Number:t=r===null?null:Number(r);break;case Object:case Array:try{t=JSON.parse(r)}catch{t=null}}return t}},ve=(r,e)=>!Ze(r,e),$e={attribute:!0,type:String,converter:re,reflect:!1,useDefault:!1,hasChanged:ve};Symbol.metadata??=Symbol("metadata"),F.litPropertyMetadata??=new WeakMap;var _=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$e){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let n=Symbol(),s=this.getPropertyDescriptor(e,n,t);s!==void 0&&et(this.prototype,e,s)}}static getPropertyDescriptor(e,t,n){let{get:s,set:i}=tt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let l=s?.call(this);i?.call(this,o),this.requestUpdate(e,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$e}static _$Ei(){if(this.hasOwnProperty(L("elementProperties")))return;let e=st(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(L("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(L("properties"))){let t=this.properties,n=[...nt(t),...rt(t)];for(let s of n)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[n,s]of t)this.elementProperties.set(n,s)}this._$Eh=new Map;for(let[t,n]of this.elementProperties){let s=this._$Eu(t,n);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let s of n)t.unshift(ne(s))}else e!==void 0&&t.push(ne(e));return t}static _$Eu(e,t){let n=t.attribute;return n===!1?void 0:typeof n=="string"?n:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _e(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){let n=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,n);if(s!==void 0&&n.reflect===!0){let i=(n.converter?.toAttribute!==void 0?n.converter:re).toAttribute(t,n.type);this._$Em=e,i==null?this.removeAttribute(s):this.setAttribute(s,i),this._$Em=null}}_$AK(e,t){let n=this.constructor,s=n._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let i=n.getPropertyOptions(s),o=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:re;this._$Em=s;let l=o.fromAttribute(t,i.type);this[s]=l??this._$Ej?.get(s)??l,this._$Em=null}}requestUpdate(e,t,n,s=!1,i){if(e!==void 0){let o=this.constructor;if(s===!1&&(i=this[e]),n??=o.getPropertyOptions(e),!((n.hasChanged??ve)(i,t)||n.useDefault&&n.reflect&&i===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,n))))return;this.C(e,t,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:s,wrapped:i},o){n&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),i!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,i]of this._$Ep)this[s]=i;this._$Ep=void 0}let n=this.constructor.elementProperties;if(n.size>0)for(let[s,i]of n){let{wrapped:o}=i,l=this[s];o!==!0||this._$AL.has(s)||l===void 0||this.C(s,void 0,i,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(n=>n.hostUpdate?.()),this.update(t)):this._$EM()}catch(n){throw e=!1,this._$EM(),n}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};_.elementStyles=[],_.shadowRootOptions={mode:"open"},_[L("elementProperties")]=new Map,_[L("finalized")]=new Map,ot?.({ReactiveElement:_}),(F.reactiveElementVersions??=[]).push("2.1.2");var de=globalThis,be=r=>r,W=de.trustedTypes,we=W?W.createPolicy("lit-html",{createHTML:r=>r}):void 0,Se="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,Te="?"+y,at=`<${Te}>`,w=document,R=()=>w.createComment(""),H=r=>r===null||typeof r!="object"&&typeof r!="function",he=Array.isArray,ct=r=>he(r)||typeof r?.[Symbol.iterator]=="function",se=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xe=/-->/g,Ee=/>/g,v=RegExp(`>|${se}(?:([^\\s"'>=/]+)(${se}*=${se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ae=/'/g,ke=/"/g,Pe=/^(?:script|style|textarea|title)$/i,ue=r=>(e,...t)=>({_$litType$:r,strings:e,values:t}),d=ue(1),Rt=ue(2),Ht=ue(3),x=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),Ce=new WeakMap,b=w.createTreeWalker(w,129);function Le(r,e){if(!he(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return we!==void 0?we.createHTML(e):e}var lt=(r,e)=>{let t=r.length-1,n=[],s,i=e===2?"<svg>":e===3?"<math>":"",o=U;for(let l=0;l<t;l++){let a=r[l],p,u,c=-1,f=0;for(;f<a.length&&(o.lastIndex=f,u=o.exec(a),u!==null);)f=o.lastIndex,o===U?u[1]==="!--"?o=xe:u[1]!==void 0?o=Ee:u[2]!==void 0?(Pe.test(u[2])&&(s=RegExp("</"+u[2],"g")),o=v):u[3]!==void 0&&(o=v):o===v?u[0]===">"?(o=s??U,c=-1):u[1]===void 0?c=-2:(c=o.lastIndex-u[2].length,p=u[1],o=u[3]===void 0?v:u[3]==='"'?ke:Ae):o===ke||o===Ae?o=v:o===xe||o===Ee?o=U:(o=v,s=void 0);let g=o===v&&r[l+1].startsWith("/>")?" ":"";i+=o===U?a+at:c>=0?(n.push(p),a.slice(0,c)+Se+a.slice(c)+y+g):a+y+(c===-2?l:g)}return[Le(r,i+(r[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]},M=class r{constructor({strings:e,_$litType$:t},n){let s;this.parts=[];let i=0,o=0,l=e.length-1,a=this.parts,[p,u]=lt(e,t);if(this.el=r.createElement(p,n),b.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=b.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(Se)){let f=u[o++],g=s.getAttribute(c).split(y),I=/([.?@])?(.*)/.exec(f);a.push({type:1,index:i,name:I[2],strings:g,ctor:I[1]==="."?oe:I[1]==="?"?ae:I[1]==="@"?ce:A}),s.removeAttribute(c)}else c.startsWith(y)&&(a.push({type:6,index:i}),s.removeAttribute(c));if(Pe.test(s.tagName)){let c=s.textContent.split(y),f=c.length-1;if(f>0){s.textContent=W?W.emptyScript:"";for(let g=0;g<f;g++)s.append(c[g],R()),b.nextNode(),a.push({type:2,index:++i});s.append(c[f],R())}}}else if(s.nodeType===8)if(s.data===Te)a.push({type:2,index:i});else{let c=-1;for(;(c=s.data.indexOf(y,c+1))!==-1;)a.push({type:7,index:i}),c+=y.length-1}i++}}static createElement(e,t){let n=w.createElement("template");return n.innerHTML=e,n}};function E(r,e,t=r,n){if(e===x)return e;let s=n!==void 0?t._$Co?.[n]:t._$Cl,i=H(e)?void 0:e._$litDirective$;return s?.constructor!==i&&(s?._$AO?.(!1),i===void 0?s=void 0:(s=new i(r),s._$AT(r,t,n)),n!==void 0?(t._$Co??=[])[n]=s:t._$Cl=s),s!==void 0&&(e=E(r,s._$AS(r,e.values),s,n)),e}var ie=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,s=(e?.creationScope??w).importNode(t,!0);b.currentNode=s;let i=b.nextNode(),o=0,l=0,a=n[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new O(i,i.nextSibling,this,e):a.type===1?p=new a.ctor(i,a.name,a.strings,this,e):a.type===6&&(p=new le(i,this,e)),this._$AV.push(p),a=n[++l]}o!==a?.index&&(i=b.nextNode(),o++)}return b.currentNode=w,s}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}},O=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,s){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=E(this,e,t),H(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==x&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ct(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&H(this._$AH)?this._$AA.nextSibling.data=e:this.T(w.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,s=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=M.createElement(Le(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===s)this._$AH.p(t);else{let i=new ie(s,this),o=i.u(this.options);i.p(t),this.T(o),this._$AH=i}}_$AC(e){let t=Ce.get(e.strings);return t===void 0&&Ce.set(e.strings,t=new M(e)),t}k(e){he(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,n,s=0;for(let i of e)s===t.length?t.push(n=new r(this.O(R()),this.O(R()),this,this.options)):n=t[s],n._$AI(i),s++;s<t.length&&(this._$AR(n&&n._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let n=be(e).nextSibling;be(e).remove(),e=n}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},A=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,s,i){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=h}_$AI(e,t=this,n,s){let i=this.strings,o=!1;if(i===void 0)e=E(this,e,t,0),o=!H(e)||e!==this._$AH&&e!==x,o&&(this._$AH=e);else{let l=e,a,p;for(e=i[0],a=0;a<i.length-1;a++)p=E(this,l[n+a],t,a),p===x&&(p=this._$AH[a]),o||=!H(p)||p!==this._$AH[a],p===h?e=h:e!==h&&(e+=(p??"")+i[a+1]),this._$AH[a]=p}o&&!s&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},oe=class extends A{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},ae=class extends A{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},ce=class extends A{constructor(e,t,n,s,i){super(e,t,n,s,i),this.type=5}_$AI(e,t=this){if((e=E(this,e,t,0)??h)===x)return;let n=this._$AH,s=e===h&&n!==h||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==h&&(n===h||s);s&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},le=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){E(this,e)}};var dt=de.litHtmlPolyfillSupport;dt?.(M,O),(de.litHtmlVersions??=[]).push("3.3.3");var Ue=(r,e,t)=>{let n=t?.renderBefore??e,s=n._$litPart$;if(s===void 0){let i=t?.renderBefore??null;n._$litPart$=s=new O(e.insertBefore(R(),i),i,void 0,t??{})}return s._$AI(r),s};var pe=globalThis,m=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ue(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return x}};m._$litElement$=!0,m.finalized=!0,pe.litElementHydrateSupport?.({LitElement:m});var ht=pe.litElementPolyfillSupport;ht?.({LitElement:m});(pe.litElementVersions??=[]).push("4.2.2");var ut=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugby_team_tracker"}}}],X=class extends m{constructor(){super(...arguments);this._label=t=>t.name==="entity"?"Game entity":t.name}setConfig(t){this._config=t}set hass(t){this._hass=t}_changed(t){let n={...this._config,...t.detail.value};this._config=n,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n},bubbles:!0,composed:!0}))}render(){if(this._config)return d`<ha-form
      .hass=${this._hass}
      .data=${this._config}
      .schema=${ut}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`}};X.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugby-tracker-game-card-editor")||customElements.define("rugby-tracker-game-card-editor",X);var pt=/^sensor\..*(current|next|previous)_game/;function q(r){return r?Object.keys(r).find(e=>pt.test(e))??"":""}function Re(r,e,t){return!r||!e?!0:r[t]!==e[t]}function He(r,e,t){return!r||!e?!0:t.some(n=>r[n]!==e[n])}var mt={mode:"empty",home:{name:""},away:{name:""},headline:"No game"},N=()=>({...mt,home:{name:""},away:{name:""}}),k=r=>typeof r=="string"&&r!==""?r:void 0,me=r=>typeof r=="number"&&Number.isFinite(r)?r:void 0,ft=new Set(["www.rugbypass.com","rugbypass.com"]);function $(r){if(!(typeof r!="string"||r.trim()===""))try{let e=new URL(r);return e.protocol!=="https:"||!ft.has(e.hostname)||e.username!==""||e.password!==""||e.port!==""?void 0:e.href}catch{return}}var Me=$;function Ve(r,e){return`Open the match on the website: ${r} v ${e}`}var De=r=>`Open ${r} on the website`,ze=()=>"Open the match on the website",Oe=r=>typeof r=="string"&&r.trim()!==""?r.trim():void 0,gt={one:"st",two:"nd",few:"rd",other:"th"},_t=r=>typeof r=="number"&&Number.isInteger(r)&&r>0?r:void 0;function yt(r,e){if(typeof e!="string"||!/^en(?:$|[-_])/i.test(e))return`#${r}`;let t;try{t=new Intl.PluralRules(e,{type:"ordinal"})}catch{t=new Intl.PluralRules("en",{type:"ordinal"})}return`${r}${gt[t.select(r)]??"th"}`}function K(r,e){let t=_t(r);return t===void 0?{}:{rank:t,rankLabel:yt(t,e)}}function Ne(r,e,t){let n=k(r);if(!n)return{headline:"TBC"};let s=new Date(n);if(Number.isNaN(s.getTime()))return{headline:n};try{return{dateLine:new Intl.DateTimeFormat(e,{weekday:"short",day:"numeric",month:"short",timeZone:t}).format(s),headline:new Intl.DateTimeFormat(e,{hour:"2-digit",minute:"2-digit",timeZone:t}).format(s)}}catch{return{headline:n}}}function C(r,e,t){try{if(!r||r.state==="unavailable"||r.state==="unknown")return N();let n=r.attributes;if(!n||typeof n!="object")return N();let s=k(n.period),i=k(n.home_team),o=k(n.away_team);if(!s||!i||!o)return N();let l=n.logos&&typeof n.logos=="object"?n.logos:{},a=me(n.home_score),p=me(n.away_score),u={name:i,logo:k(l.home),score:a,...K(n.home_rank,e),url:Me(n.home_team_url)},c={name:o,logo:k(l.away),score:p,...K(n.away_rank,e),url:Me(n.away_team_url)},f=`${a??"-"} \u2013 ${p??"-"}`;switch(s){case"Kick off":return{mode:"upcoming",home:u,away:c,...Ne(n.kickoff,e,t),venue:Oe(n.venue),matchUrl:$(n.match_url)};case"Postponed":case"Cancelled":return{mode:"upcoming",home:u,away:c,...Ne(n.kickoff,e,t),badge:s,venue:Oe(n.venue),matchUrl:$(n.match_url)};case"First Half":case"Second Half":{let g=me(n.minute);return{mode:"live",home:u,away:c,headline:f,badge:g===void 0?s:`${s} ${g}'`,matchUrl:$(n.match_url)}}case"Half Time":return{mode:"live",home:u,away:c,headline:f,badge:s,matchUrl:$(n.match_url)};case"Result":return{mode:"final",home:u,away:c,headline:f,badge:"Full time",matchUrl:$(n.match_url)};default:return N()}}catch{return N()}}var je=r=>`Open the match against ${r} on the website`,V=5,Ie=/_(?:current_game|next_game|previous_game_[1-5])$/,$t=/^([WLD]) \d+–\d+$/,S=r=>typeof r=="string"&&r!==""?r:void 0;function Be(r){if(typeof r!="string"||!Ie.test(r))return;let e=r.replace(Ie,"");return{current:`${e}_current_game`,next:`${e}_next_game`,previous:[1,2,3,4,5].map(t=>`${e}_previous_game_${t}`)}}function Fe(r){let e=Array.isArray(r?.previous)?r.previous.filter(s=>typeof s=="string"&&s!==""):[];if(!(!!r&&typeof r=="object"&&(typeof r.current=="string"||typeof r.next=="string"||Array.isArray(r.previous))))throw new Error("rugby-tracker-team-card: configure at least 'next', 'current' or 'previous'");let n={...r,previous:e.slice(0,V)};return typeof n.title!="string"&&delete n.title,typeof n.show_header!="boolean"&&delete n.show_header,n}var vt=/(?:^|\s+)(?:current game|next game|previous game [1-5])\s*$/i;function bt(r){if(!r||typeof r!="object")return[];let e=Array.isArray(r.previous)?r.previous.slice(0,V):[];return[r.next,r.current,...e].filter(t=>typeof t=="string"&&t!=="")}function wt(r,e){try{let t=bt(e),n=s=>r&&typeof r=="object"?r[s]:void 0;for(let s of t){let i=n(s)?.attributes;if(!i||typeof i!="object")continue;let o=i.home_away==="home"?S(i.home_team):i.home_away==="away"?S(i.away_team):void 0;if(o)return o}for(let s of t){let i=n(s)?.attributes,o=i&&typeof i=="object"?S(i.friendly_name):void 0;if(!o)continue;let l=o.replace(vt,"").trim();return l!==""?l:void 0}}catch{}}function xt(r){return[r.current,r.next,...(r.previous??[]).slice(0,V)].filter(e=>typeof e=="string"&&e!=="")}function Et(r,e,t){let n=S(r);if(!n)return"\u2013";let s=new Date(n);if(Number.isNaN(s.getTime()))return n;try{return new Intl.DateTimeFormat(e,{day:"numeric",month:"short",timeZone:t}).format(s)}catch{return n}}function At(r,e,t){try{if(!r||r.state==="unknown"||r.state==="unavailable")return;let n=r.attributes;if(!n||typeof n!="object")return;let s=S(n.opposition);if(!s)return;let i=typeof r.state=="string"?r.state:"",o=$t.exec(i),l=o?{W:"win",L:"loss",D:"draw"}[o[1]]:"unknown";return{date:Et(n.kickoff,e,t),opposition:s,location:typeof n.venue=="string"&&n.venue.trim()!==""?n.venue.trim():void 0,...K(n.home_away==="home"?n.away_rank:n.home_away==="away"?n.home_rank:void 0,e),matchUrl:$(n.match_url),score:i||"Result unavailable",outcome:l}}catch{return}}function We(r,e,t,n){let s=c=>c?r[c]:void 0,i=C(s(e.current),t,n),o=C(s(e.next),t,n),l=i.mode==="live"?i:o.mode==="upcoming"?o:C(void 0,t,n),a=i.mode==="live"?e.current:e.next??e.current,p=(e.previous??[]).slice(0,V).map(c=>At(s(c),t,n)).filter(c=>c!==void 0),u=e.show_header===!1?void 0:S(e.title)??wt(r,e);return{top:l,previous:p,heading:u,moreInfoEntity:a}}function Xe(r,e,t,n,s){return!r||e?!0:t?He(n,s,xt(r)):!0}function qe(r){return 2+Math.min(V,r)}function Ke(r){let e=Be(q(r));return e?{type:"custom:rugby-tracker-team-card",...e}:{type:"custom:rugby-tracker-team-card",next:""}}function Ye(r,e,t,n,s){let i={type:t??"custom:rugby-tracker-team-card"};e&&(i.title=e),s===!1&&(i.show_header=!1);let o=r?Be(r):void 0;return o?(i.current=o.current,i.next=o.next,i.previous=[...o.previous]):i.next=r??"",i}var kt=[{name:"entity",selector:{entity:{domain:"sensor",integration:"rugby_team_tracker"}}},{name:"title",selector:{text:{}}},{name:"show_header",selector:{boolean:{}}}],Ct={entity:"Any game sensor for the team",title:"Header title (optional, defaults to the team name)",show_header:"Show header"},Y=class extends m{constructor(){super(...arguments);this._helper=t=>t.name==="entity"?"Other sensors are filled in automatically. Set them individually in YAML if needed.":t.name==="show_header"?"Show the followed team's name (or your title) at the top of the card.":void 0;this._label=t=>Ct[t.name]??t.name}setConfig(t){this._config=t}set hass(t){this._hass=t}_changed(t){let n=t.detail?.value??{},s=typeof n.entity=="string"?n.entity:"",i=typeof n.title=="string"&&n.title!==""?n.title:void 0,o=n.show_header===!1?!1:void 0,l=Ye(s,i,this._config?.type,this._config,o);this._config=l,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:l},bubbles:!0,composed:!0}))}render(){if(!this._config)return;let t={entity:this._config.next||this._config.current||this._config.previous?.[0]||"",title:this._config.title??"",show_header:this._config.show_header!==!1};return d`<ha-form
      .hass=${this._hass}
      .data=${t}
      .schema=${kt}
      .computeLabel=${this._label}
      .computeHelper=${this._helper}
      @value-changed=${this._changed}
    ></ha-form>`}};Y.properties={_config:{state:!0},_hass:{state:!0}};customElements.get("rugby-tracker-team-card-editor")||customElements.define("rugby-tracker-team-card-editor",Y);function G(r,e){r.customCards=r.customCards||[],r.customCards.some(t=>t.type===e.type)||r.customCards.push(e)}function J(r,e=500){let t,n,s=!1,i=()=>{t!==void 0&&clearTimeout(t),t=void 0,n=void 0};return{start(o){o.button!==void 0&&o.button!==0||(i(),s=!1,n=o,t=setTimeout(()=>{t=void 0,n=void 0,s=!0,r()},e))},move(o){n&&Math.hypot(o.clientX-n.clientX,o.clientY-n.clientY)>10&&i()},cancel:i,consumeFired(){let o=s;return s=!1,o}}}function Q(r,e){r.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))}function Ge(r){return d`${r.logo?d`<img class="logo" src=${r.logo} alt="" />`:d`<div class="logo"></div>`}
    <div class="name">
      ${r.name}${r.rankLabel?d` <span class="rank">${r.rankLabel}</span>`:h}
    </div>`}function Je(r,e){return e&&r.url?d`<a
      class="team team-link"
      href=${r.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label=${De(r.name)}
      >${Ge(r)}</a
    >`:d`<div class="team">${Ge(r)}</div>`}function Qe(r){return d`${r.dateLine?d`<div class="dateline">${r.dateLine}</div>`:h}
    <div class="headline">${r.headline}</div>
    ${r.venue?d`<div class="venue">${r.venue}</div>`:h}
    ${r.badge?d`<div class="badge">${r.badge}</div>`:h}`}function St(r,e){return e&&r.matchUrl?d`<a
      class="centre centre-link"
      href=${r.matchUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label=${ze()}
      >${Qe(r)}</a
    >`:d`<div class="centre">${Qe(r)}</div>`}function Z(r,e={}){if(r.mode==="empty")return d`<div class="empty">${r.headline}</div>`;let t=e.linkMode==="parts",n=d`<div class="game ${r.mode}">
    <div class="row">
      ${Je(r.home,t)} ${St(r,t)} ${Je(r.away,t)}
    </div>
  </div>`;return t||!r.matchUrl||r.mode!=="live"&&r.mode!=="final"?n:d`<a
    class="game-link"
    href=${r.matchUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label=${Ve(r.home.name,r.away.name)}
    >${n}</a
  >`}var ee=P`
    ha-card {
      padding: 16px;
      color: var(--primary-text-color);
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .team {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      min-width: 0;
    }
    .logo {
      width: 56px;
      height: 56px;
      object-fit: contain;
    }
    .name {
      margin-top: 6px;
      font-weight: 500;
      max-width: 100%;
      overflow-wrap: anywhere;
    }
    .rank {
      font-size: 0.8em;
      font-weight: 400;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .centre {
      flex: 1;
      min-width: 0;
      text-align: center;
    }
    .headline {
      font-size: 1.4em;
      font-weight: 600;
    }
    .game.upcoming .headline {
      font-size: 1.15em;
      white-space: nowrap;
    }
    .dateline {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .venue {
      min-width: 0;
      max-width: 100%;
      font-size: 0.85em;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .game-link,
    .prev-row a.prev-link {
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      border-radius: 8px;
    }
    .game-link {
      display: block;
    }
    a.team-link,
    a.centre-link {
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      border-radius: 8px;
    }
    a.centre-link {
      display: block;
    }
    a.team-link:hover,
    a.centre-link:hover,
    a.team-link:focus-visible,
    a.centre-link:focus-visible {
      background: var(--secondary-background-color);
    }
    a.team-link:focus-visible,
    a.centre-link:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .game-link:hover,
    .game-link:focus-visible,
    .prev-row a.prev-link:hover,
    .prev-row a.prev-link:focus-visible {
      background: var(--secondary-background-color);
    }
    .badge {
      display: inline-block;
      margin-top: 6px;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.85em;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }
    ha-card .game.live .badge {
      background: var(--error-color, #db4437);
      color: var(--text-primary-color, #fff);
    }
    ha-card .game.live .headline {
      color: var(--primary-color);
    }
    .empty {
      text-align: center;
      color: var(--secondary-text-color);
      padding: 8px;
    }
`;var D=class extends m{constructor(){super(...arguments);this._press=J(()=>{let t=this._view()?.moreInfoEntity;t&&Q(this,t)})}disconnectedCallback(){super.disconnectedCallback(),this._press.cancel()}static getConfigElement(){return document.createElement("rugby-tracker-team-card-editor")}static getStubConfig(t){return Ke(t?.states)}shouldUpdate(t){let n=t.get("_hass");return Xe(this._config,t.has("_config"),t.has("_hass"),n?.states,this._hass?.states)}setConfig(t){this._config=Fe(t)}set hass(t){this._hass=t}getCardSize(){return qe(this._view()?.previous.length??0)}_view(){if(!this._config)return;let t=this._hass;return We(t?.states??{},this._config,t?.locale?.language??"en",t?.config?.time_zone??"UTC")}render(){let t=this._view();return t?d`<ha-card
      @pointerdown=${n=>this._press.start(n)}
      @pointermove=${n=>this._press.move(n)}
      @pointerup=${()=>this._press.cancel()}
      @pointercancel=${()=>this._press.cancel()}
      @pointerleave=${()=>this._press.cancel()}
      @contextmenu=${n=>n.preventDefault()}
      @click=${n=>{this._press.consumeFired()&&(n.preventDefault(),n.stopPropagation())}}
    >
      ${t.heading?d`<div class="heading">${t.heading}</div>`:h}
      ${Z(t.top,{linkMode:"parts"})}
      <hr class="divider" />
      ${t.previous.length===0?d`<div class="none">No previous games</div>`:d`<ul class="previous">
            ${t.previous.map(n=>{let s=d`<span class="date">${n.date}</span>
                <span class="opp"
                  >${n.opposition}${n.rankLabel?d` <span class="rank">${n.rankLabel}</span>`:h}${n.location?d` <span class="loc">(${n.location})</span>`:h}</span
                >
                <span class="score ${n.outcome}">${n.score}</span>`;return d`<li class="prev-row">
                ${n.matchUrl?d`<a
                      class="prev-link"
                      href=${n.matchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label=${je(n.opposition)}
                      >${s}</a
                    >`:s}
              </li>`})}
          </ul>`}
    </ha-card>`:h}};D.properties={_config:{state:!0},_hass:{state:!0}},D.styles=[ee,P`
      .heading {
        font-size: 1.1em;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .divider {
        border: 0;
        border-top: 1px solid var(--divider-color);
        margin: 12px 0;
      }
      .previous {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .prev-row {
        display: flex;
        gap: 8px;
        align-items: baseline;
        padding: 3px 0;
        font-size: 0.9em;
      }
      .prev-row a.prev-link {
        display: flex;
        flex: 1;
        min-width: 0;
        gap: 8px;
        align-items: baseline;
        margin: -3px -4px;
        padding: 3px 4px;
      }
      .date {
        flex: 0 0 auto;
        min-width: 5.5em;
        color: var(--secondary-text-color);
      }
      .opp {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .loc,
      .prev-row .rank {
        color: var(--secondary-text-color);
      }
      .prev-row .rank {
        font-size: inherit;
      }
      .score {
        flex: 0 0 auto;
        font-weight: 600;
      }
      .score.win {
        color: var(--success-color);
      }
      .score.loss {
        color: var(--error-color);
      }
      .score.draw {
        color: var(--warning-color);
      }
      .score.unknown {
        color: var(--secondary-text-color);
      }
      .none {
        text-align: center;
        color: var(--secondary-text-color);
      }
    `];customElements.get("rugby-tracker-team-card")||customElements.define("rugby-tracker-team-card",D);G(window,{type:"rugby-tracker-team-card",name:"Rugby Tracker Team Card",description:"Current or next game plus the previous five results for one team"});var z=class extends m{constructor(){super(...arguments);this._press=J(()=>{this._config&&Q(this,this._config.entity)})}disconnectedCallback(){super.disconnectedCallback(),this._press.cancel()}static getConfigElement(){return document.createElement("rugby-tracker-game-card-editor")}static getStubConfig(t){return{type:"custom:rugby-tracker-game-card",entity:q(t?.states)}}shouldUpdate(t){if(!this._config||t.has("_config"))return!0;if(t.has("_hass")){let n=t.get("_hass");return Re(n?.states,this._hass?.states,this._config.entity)}return!0}setConfig(t){if(!t||typeof t.entity!="string"||!t.entity)throw new Error("rugby-tracker-game-card: 'entity' is required");this._config=t}set hass(t){this._hass=t}getCardSize(){return 2}_view(){let t=this._hass,n=t&&this._config?t.states[this._config.entity]:void 0;return C(n,t?.locale?.language??"en",t?.config?.time_zone??"UTC")}render(){return this._config?d`<ha-card
      @pointerdown=${t=>this._press.start(t)}
      @pointermove=${t=>this._press.move(t)}
      @pointerup=${()=>this._press.cancel()}
      @pointercancel=${()=>this._press.cancel()}
      @pointerleave=${()=>this._press.cancel()}
      @contextmenu=${t=>t.preventDefault()}
      @click=${t=>{this._press.consumeFired()&&(t.preventDefault(),t.stopPropagation())}}
      >${Z(this._view())}</ha-card
    >`:h}};z.properties={_config:{state:!0},_hass:{state:!0}},z.styles=ee;customElements.get("rugby-tracker-game-card")||customElements.define("rugby-tracker-game-card",z);G(window,{type:"rugby-tracker-game-card",name:"Rugby Tracker Game Card",description:"Shows a rugby game: kick-off, live score or final result."});export{z as RugbyTrackerGameCard};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
