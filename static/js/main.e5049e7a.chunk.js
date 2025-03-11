(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{197:function(t,e,a){t.exports=a(211)},206:function(t,e,a){},207:function(t,e,a){},208:function(t,e,a){},209:function(t,e,a){},210:function(t,e,a){},211:function(t,e,a){"use strict";a.r(e);var n=a(0),r=a.n(n),i=a(67),s=a.n(i),o=(a(206),a(1)),l=a(17);a(207);var c=t=>{let{ufoData:e,militaryBaseData:a,usMapData:i}=t;const s=Object(n.useRef)(),c=Object(n.useRef)(),[d,h]=Object(n.useState)({width:0,height:0});return Object(n.useEffect)(()=>{const t=()=>{const t=s.current.parentElement.clientWidth;h({width:t,height:.6*t})};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),Object(n.useEffect)(()=>{if(!i||!d.width||!d.height)return;const t=o.o(s.current),n=o.o(c.current);t.selectAll("*").remove(),t.attr("width",d.width).attr("height",d.height).attr("viewBox",[0,0,d.width,d.height]).attr("style","max-width: 100%; height: auto;");const r=o.e().fitSize([d.width,d.height],l.a(i,i.objects.states)),h=o.f().projection(r),u={Alabama:"AL",Alaska:"AK",Arizona:"AZ",Arkansas:"AR",California:"CA",Colorado:"CO",Connecticut:"CT",Delaware:"DE",Florida:"FL",Georgia:"GA",Hawaii:"HI",Idaho:"ID",Illinois:"IL",Indiana:"IN",Iowa:"IA",Kansas:"KS",Kentucky:"KY",Louisiana:"LA",Maine:"ME",Maryland:"MD",Massachusetts:"MA",Michigan:"MI",Minnesota:"MN",Mississippi:"MS",Missouri:"MO",Montana:"MT",Nebraska:"NE",Nevada:"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND",Ohio:"OH",Oklahoma:"OK",Oregon:"OR",Pennsylvania:"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD",Tennessee:"TN",Texas:"TX",Utah:"UT",Vermont:"VT",Virginia:"VA",Washington:"WA","West Virginia":"WV",Wisconsin:"WI",Wyoming:"WY","District of Columbia":"DC"},g=o.k(e,t=>t.length,t=>t.state?t.state.toUpperCase():"Unknown");console.log("State codes in UFO data:",Array.from(g.keys())),console.log("First few UFO state values:",e.slice(0,5).map(t=>t.state));const p=o.n(o.g).domain([0,o.i(Array.from(g.values()))||1]);t.append("g").selectAll("path").data(l.a(i,i.objects.states).features).join("path").attr("fill",t=>{const e=t.properties.name,a=u[e];let n=0;return a&&g.has(a)?n=g.get(a):a&&g.has(a.toLowerCase())&&(n=g.get(a.toLowerCase())),p(n)}).attr("stroke","#999").attr("stroke-width",.5).attr("d",h).attr("class","state").on("mouseover",function(t,e){const a=e.properties.name,r=u[a];let i=0;r&&g.has(r)?i=g.get(r):r&&g.has(r.toLowerCase())?i=g.get(r.toLowerCase()):a&&g.has(a)&&(i=g.get(a)),o.o(this).attr("stroke","#333").attr("stroke-width",1.5),n.style("opacity",1).html(`<strong>${a}</strong><br>${i.toLocaleString()} UFO sightings`).style("left",t.pageX+10+"px").style("top",t.pageY-28+"px")}).on("mousemove",function(t){n.style("left",t.pageX+10+"px").style("top",t.pageY-28+"px")}).on("mouseout",function(){o.o(this).attr("stroke","#999").attr("stroke-width",.5),n.style("opacity",0)}),t.append("g").selectAll("circle").data(e).join("circle").attr("cx",t=>{const e=r([t.longitude,t.latitude]);return e?e[0]:null}).attr("cy",t=>{const e=r([t.longitude,t.latitude]);return e?e[1]:null}).attr("r",3).attr("fill","rgba(255, 215, 0, 0.6)").attr("stroke","rgba(255, 215, 0, 0.9)").attr("stroke-width",1).attr("class","ufo-sighting").on("mouseover",function(t,e){o.o(this).attr("r",6).attr("fill","rgba(255, 215, 0, 0.9)"),n.style("opacity",1).html(`\n            <strong>UFO Sighting</strong><br>\n            Date: ${e.date||e.datetime||"Unknown"}<br>\n            Location: ${e.city||"Unknown"}, ${e.state||"Unknown"}<br>\n            Shape: ${e.shape||"Unknown"}<br>\n            Duration: ${e.duration||"N/A"}\n          `).style("left",t.pageX+10+"px").style("top",t.pageY-28+"px")}).on("mouseout",function(){o.o(this).attr("r",3).attr("fill","rgba(255, 215, 0, 0.6)"),n.style("opacity",0)}),a.length>0&&t.append("g").selectAll("path").data(a).join("path").attr("transform",t=>{const e=r([t.longitude,t.latitude]);return e?`translate(${e[0]}, ${e[1]})`:null}).attr("d","M-5,-5 L0,-10 L5,-5 L5,5 L-5,5 Z").attr("fill","rgba(220, 20, 60, 0.7)").attr("stroke","rgba(220, 20, 60, 0.9)").attr("stroke-width",1).attr("class","military-base").on("mouseover",function(t,e){o.o(this).attr("fill","rgba(220, 20, 60, 0.9)"),n.style("opacity",1).html(`\n              <strong>Military Base</strong><br>\n              Name: ${e.name||"Unknown"}<br>\n              Type: ${e.type||"N/A"}<br>\n              Branch: ${e.branch||"N/A"}\n            `).style("left",t.pageX+10+"px").style("top",t.pageY-28+"px")}).on("mouseout",function(){o.o(this).attr("fill","rgba(220, 20, 60, 0.7)"),n.style("opacity",0)});const m=d.width-200-20,f=d.height-40,y=o.m().domain([0,o.i(Array.from(g.values()))]).range([0,200]),w=o.a(y).ticks(5).tickFormat(o.d(",.0f"));t.append("defs").append("linearGradient").attr("id","sightings-gradient").attr("x1","0%").attr("y1","0%").attr("x2","100%").attr("y2","0%").selectAll("stop").data([0,.2,.4,.6,.8,1]).join("stop").attr("offset",t=>100*t+"%").attr("stop-color",t=>p(t*o.i(Array.from(g.values())))),t.append("rect").attr("x",m).attr("y",f).attr("width",200).attr("height",15).style("fill","url(#sightings-gradient)"),t.append("g").attr("transform",`translate(${m}, ${f+15})`).call(w).attr("font-size","10px"),t.append("text").attr("x",m).attr("y",f-5).attr("font-size","12px").text("UFO Sightings by State");const b=t.append("g").attr("transform",`translate(20, ${d.height-80})`);b.append("circle").attr("cx",10).attr("cy",10).attr("r",5).attr("fill","rgba(255, 215, 0, 0.6)").attr("stroke","rgba(255, 215, 0, 0.9)").attr("stroke-width",1),b.append("text").attr("x",25).attr("y",15).text("UFO Sighting").attr("font-size","12px"),b.append("path").attr("transform","translate(10, 40)").attr("d","M-4,-4 L0,-8 L4,-4 L4,4 L-4,4 Z").attr("fill","rgba(220, 20, 60, 0.7)").attr("stroke","rgba(220, 20, 60, 0.9)").attr("stroke-width",1),b.append("text").attr("x",25).attr("y",45).text("Military Base").attr("font-size","12px")},[i,e,a,d]),r.a.createElement("div",{className:"map-container"},r.a.createElement("svg",{ref:s}),r.a.createElement("div",{className:"tooltip",ref:c}))};a(208);var d=t=>{let{ufoData:e,yearRange:a}=t;const i=Object(n.useRef)(),s=Object(n.useRef)(),[l,c]=Object(n.useState)({width:0,height:0});return Object(n.useEffect)(()=>{const t=()=>{const t=i.current.parentElement.clientWidth;c({width:t,height:300})};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),Object(n.useEffect)(()=>{if(!e.length||!l.width||!l.height)return;const t=o.o(i.current),a=o.o(s.current);t.selectAll("*").remove(),t.attr("width",l.width).attr("height",l.height).attr("viewBox",[0,0,l.width,l.height]).attr("style","max-width: 100%; height: auto;"),t.append("text").attr("x",l.width/2).attr("y",20).attr("text-anchor","middle").style("font-size","16px").style("font-weight","bold").text("UFO Sightings Over Time");const n=40,r=30,c=60,d=60,h=l.width-d-r,u=l.height-n-c,g=o.k(e,t=>t.length,t=>t.year),p=Array.from(g,t=>{let[e,a]=t;return{year:e,count:a}}).sort((t,e)=>t.year-e.year),m=o.m().domain([o.j(p,t=>t.year),o.i(p,t=>t.year)]).range([0,h]),f=o.m().domain([0,1.1*o.i(p,t=>t.count)]).range([u,0]),y=t.append("g").attr("transform",`translate(${d}, ${n})`),w=o.a(m).ticks(10).tickFormat(t=>t);y.append("g").attr("transform",`translate(0, ${u})`).call(w);const b=o.b(f).ticks(10);y.append("g").call(b),y.append("text").attr("transform",`translate(${h/2}, ${u+40})`).style("text-anchor","middle").text("Year"),y.append("text").attr("transform","rotate(-90)").attr("y",-40).attr("x",-u/2).style("text-anchor","middle").text("Number of Sightings");const x=o.h().x(t=>m(t.year)).y(t=>f(t.count)).curve(o.c);y.append("path").datum(p).attr("fill","none").attr("stroke","steelblue").attr("stroke-width",2).attr("d",x),y.selectAll(".dot").data(p).join("circle").attr("class","dot").attr("cx",t=>m(t.year)).attr("cy",t=>f(t.count)).attr("r",4).attr("fill","steelblue").on("mouseover",(t,e)=>{a.style("opacity",1).html(`<strong>${e.year}</strong>: ${e.count} sightings`).style("left",t.pageX+10+"px").style("top",t.pageY-28+"px")}).on("mouseout",()=>{a.style("opacity",0)})},[e,l]),r.a.createElement("div",{className:"timeline-container"},r.a.createElement("svg",{ref:i}),r.a.createElement("div",{className:"tooltip",ref:s}))};a(209);const h={AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",DC:"District of Columbia",PR:"Puerto Rico",GU:"Guam",VI:"Virgin Islands",AS:"American Samoa",MP:"Northern Mariana Islands",BC:"British Columbia",ON:"Ontario",QC:"Quebec",AB:"Alberta",Wa:"Washington",Ca:"California",Tx:"Texas",Fl:"Florida",Ny:"New York","":"Unknown Location"};var u=t=>{let{ufoData:e}=t;const a=Object(n.useRef)(),i=Object(n.useRef)(),[s,l]=Object(n.useState)({width:0,height:0});return Object(n.useEffect)(()=>{const t=()=>{const t=a.current.parentElement.clientWidth;l({width:t,height:400})};return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),Object(n.useEffect)(()=>{if(!e.length||!s.width||!s.height)return;const t=o.o(a.current),n=o.o(i.current);t.selectAll("*").remove(),t.attr("width",s.width).attr("height",s.height).attr("viewBox",[0,0,s.width,s.height]).attr("style","max-width: 100%; height: auto;"),t.append("text").attr("x",s.width/2).attr("y",20).attr("text-anchor","middle").style("font-size","16px").style("font-weight","bold").text("Top 10 States by UFO Sightings");const r=40,l=30,c=60,d=120,u=s.width-d-l,g=s.height-r-c,p=o.k(e,t=>t.length,t=>t.state);console.log("State codes in data for ranking chart:",Array.from(p.keys()));const m=Array.from(p,t=>{let[e,a]=t;const n=e?e.toUpperCase():e;console.log("Processing state:",e,"count:",a);let r=h[n];return r||(console.warn("Could not find state name for code:",n),r=n||"Unknown State"),{state:n,stateName:r,count:a}}).sort((t,e)=>e.count-t.count).slice(0,10);console.log("Final top 10 states data:",m);const f=o.m().domain([0,1.1*o.i(m,t=>t.count)]).range([0,u]),y=o.l().domain(m.map(t=>t.stateName)).range([0,g]).padding(.2),w=t.append("g").attr("transform",`translate(${d}, ${r})`),b=o.a(f).ticks(6).tickFormat(o.d(",d"));w.append("g").attr("transform",`translate(0, ${g})`).call(b);const x=o.b(y);w.append("g").call(x),w.append("text").attr("transform",`translate(${u/2}, ${g+40})`).style("text-anchor","middle").text("Number of Sightings"),w.selectAll(".bar").data(m).join("rect").attr("class","bar").attr("x",0).attr("y",t=>y(t.stateName)).attr("width",t=>f(t.count)).attr("height",y.bandwidth()).attr("fill","steelblue").on("mouseover",(t,e)=>{o.o(t.currentTarget).attr("fill","#3a7ca5"),n.style("opacity",1).html(`<strong>${e.stateName}</strong>: ${e.count.toLocaleString()} sightings`).style("left",t.pageX+10+"px").style("top",t.pageY-28+"px")}).on("mouseout",t=>{o.o(t.currentTarget).attr("fill","steelblue"),n.style("opacity",0)}),w.selectAll(".bar-label").data(m).join("text").attr("class","bar-label").attr("x",t=>f(t.count)+5).attr("y",t=>y(t.stateName)+y.bandwidth()/2+5).attr("font-size","12px").text(t=>t.count.toLocaleString())},[e,s]),r.a.createElement("div",{className:"state-ranking-container"},r.a.createElement("svg",{ref:a}),r.a.createElement("div",{className:"tooltip",ref:i}))},g=a(16),p=a.n(g);const m=t=>{return p.a.parse(t,{header:!0,skipEmptyLines:!0,dynamicTyping:!0}).data.filter(t=>t.latitude&&t.longitude).map(t=>{const e=new Date(t.datetime||t.date).getFullYear();return{...t,year:e,latitude:parseFloat(t.latitude),longitude:parseFloat(t.longitude)}})},f=t=>{return p.a.parse(t,{header:!0,skipEmptyLines:!0,dynamicTyping:!0}).data.filter(t=>t.latitude&&t.longitude).map(t=>({...t,latitude:parseFloat(t.latitude),longitude:parseFloat(t.longitude)}))};a(210);var y=function(){const[t,e]=Object(n.useState)([]),[a,i]=Object(n.useState)([]),[s,o]=Object(n.useState)(null),[l,h]=Object(n.useState)(!0),[g,p]=Object(n.useState)(null),[y,w]=Object(n.useState)([1950,2023]),[b,x]=Object(n.useState)([]),[N,k]=Object(n.useState)(!0);Object(n.useEffect)(()=>{(async()=>{try{const a=await fetch("/UFO/data/ufo-sightings.csv"),n=await a.text(),r=m(n);e(r);const s=await fetch("/UFO/data/military-bases.csv"),l=await s.text(),c=f(l);i(c);const d=await fetch("/UFO/data/us-states.json"),u=await d.json();o(u),h(!1)}catch(t){p("Failed to load data: "+t.message),h(!1)}})()},[]);const O=t.filter(t=>{const e=t.year>=y[0]&&t.year<=y[1],a=0===b.length||b.includes(t.state);return e&&a});return l?r.a.createElement("div",{className:"loading"},"Loading data..."):g?r.a.createElement("div",{className:"error"},g):r.a.createElement("div",{className:"app"},r.a.createElement("header",null,r.a.createElement("h1",null,"UFO Sightings & Military Bases Visualization"),r.a.createElement("p",null,"Exploring the relationship between reported UFO sightings and US military installations")),r.a.createElement("main",null,r.a.createElement("section",{className:"main-visualization"},r.a.createElement(c,{ufoData:O,militaryBaseData:N?a:[],usMapData:s})),r.a.createElement("section",{className:"supporting-charts"},r.a.createElement("div",{className:"chart timeline"},r.a.createElement(d,{ufoData:t,yearRange:y})),r.a.createElement("div",{className:"chart state-ranking"},r.a.createElement(u,{ufoData:t})))),r.a.createElement("footer",null,r.a.createElement("p",null,"Data sources: NUFORC UFO Sightings Database, Department of Defense Military Installations")))};var w=t=>{t&&t instanceof Function&&a.e(3).then(a.bind(null,212)).then(e=>{let{getCLS:a,getFID:n,getFCP:r,getLCP:i,getTTFB:s}=e;a(t),n(t),r(t),i(t),s(t)})};s.a.createRoot(document.getElementById("root")).render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(y,null))),w()}},[[197,1,2]]]);
//# sourceMappingURL=main.e5049e7a.chunk.js.map