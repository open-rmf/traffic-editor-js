(this["webpackJsonptraffic-editor-pwa"]=this["webpackJsonptraffic-editor-pwa"]||[]).push([[0],{110:function(e,n,t){},125:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),c=t(23),i=t.n(c),o=(t(110),t(19)),s=t(166),l=t(178),u=t(179),j=t(61),d=t(180),x=t(98),b=t.n(x),f=t(184),h=t(181),p=t(182),O=t(10),m=t.n(O),v=t(25),g=t(56),y=t(91),w=t(185),k=t(173),C=t(174),S=t(176),M=t(168),_=t(170),I=t(126),E=t(171),B=t(172),N=t(93),z=t.n(N),D=t(175),A=t(9),G=t(99),H=function(e){if(!e)return[];var n=[];for(var t in e){var a=e[t],r={name:t,type_idx:a[0],value:a[1]};n.push(r)}return n},P=function(e){return{x:e[0],y:-e[1],name:e[3],params:H(e[4])}},F=function(e){return{start_idx:e[0],end_idx:e[1],params:H(e[2])}},L=function(e){return{start_idx:e[0],end_idx:e[1],params:H(e[2])}},V=function(e,n){var t,a={name:e,vertices:[],walls:[],lanes:[]},r=Object(A.a)(n.vertices);try{for(r.s();!(t=r.n()).done;){var c=t.value;a.vertices.push(P(c))}}catch(d){r.e(d)}finally{r.f()}var i,o=Object(A.a)(n.walls);try{for(o.s();!(i=o.n()).done;){var s=i.value;a.walls.push(F(s))}}catch(d){o.e(d)}finally{o.f()}var l,u=Object(A.a)(n.lanes);try{for(u.s();!(l=u.n()).done;){var j=l.value;a.lanes.push(L(j))}}catch(d){u.e(d)}finally{u.f()}return a},q={name:"",filename:"",yaml:"",levels:[],lifts:[],crowd_sim:void 0},J=function(e,n,t){e.filename=n,e.yaml=t;var a=G.a.parse(t);for(var r in e.name=a.name,e.crowd_sim=a.crowd_sim,e.levels=[],a.levels){var c=a.levels[r];e.levels.push(V(r,c))}console.log("parsed it")},T=r.a.createContext(q),R=t(13),U=Object(s.a)((function(e){return{directoryButton:{fontSize:e.typography.h5.fontSize},filename:{fontSize:e.typography.h5.fontSize,textDecoration:"underline"},dialog:{backgroundColor:e.palette.background.paper}}}));function W(e){var n=U(e),t=r.a.useContext(T),a=r.a.useState([]),c=Object(o.a)(a,2),i=c[0],s=c[1],l=r.a.useState(),u=Object(o.a)(l,2),j=u[0],d=u[1],x=function(){var e=Object(g.a)(m.a.mark((function e(){var n,t,a,r,c,i,o,l;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s([]),e.next=3,window.showDirectoryPicker();case 3:return n=e.sent,e.next=6,d(n);case 6:t=!0,a=!1,e.prev=8,c=function(){var e=l;e.name.endsWith(".building.yaml")&&s((function(n){return[].concat(Object(v.a)(n),[e.name])}))},i=Object(y.a)(n.values());case 11:return e.next=13,i.next();case 13:return o=e.sent,t=o.done,e.next=17,o.value;case 17:if(l=e.sent,t){e.next=23;break}c();case 20:t=!0,e.next=11;break;case 23:e.next=29;break;case 25:e.prev=25,e.t0=e.catch(8),a=!0,r=e.t0;case 29:if(e.prev=29,e.prev=30,t||null==i.return){e.next=34;break}return e.next=34,i.return();case 34:if(e.prev=34,!a){e.next=37;break}throw r;case 37:return e.finish(34);case 38:return e.finish(29);case 39:case"end":return e.stop()}}),e,null,[[8,25,29,39],[30,,34,38]])})));return function(){return e.apply(this,arguments)}}(),b=function(){var n=Object(g.a)(m.a.mark((function n(a){var r,c,i;return m.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!j){n.next=11;break}return n.next=3,j.getFileHandle(a);case 3:return r=n.sent,n.next=6,r.getFile();case 6:return c=n.sent,n.next=9,c.text();case 9:i=n.sent,J(t,a,i);case 11:e.onOpen();case 12:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}();return Object(R.jsxs)(w.a,{open:e.open,onClose:e.onCancel,children:[Object(R.jsx)(k.a,{children:"Open Building Map"}),Object(R.jsxs)(C.a,{className:n.dialog,children:[Object(R.jsx)(D.a,{variant:"contained",color:"primary",onClick:x,children:"Select Directory..."}),function(){if(i.length>0)return Object(R.jsx)("div",{children:Object(R.jsx)(M.a,{subheader:Object(R.jsx)(_.a,{component:"div",children:"Available Files"}),children:i.map((function(e){return Object(R.jsxs)(I.a,{button:!0,children:[Object(R.jsx)(E.a,{children:Object(R.jsx)(z.a,{})}),Object(R.jsx)(B.a,{primary:e,onClick:function(n){b(e)}})]},e)}))})})}()]}),Object(R.jsx)(S.a,{children:Object(R.jsx)(D.a,{onClick:e.onCancel,color:"primary",children:"Cancel"})})]})}var K=t(177),Q=t(187),X=t(94),Y=t.n(X),Z=t(95),$=t.n(Z);function ee(){var e=r.a.useContext(T);if(!e.filename)return Object(R.jsx)("p",{children:"No building loaded."});var n=10,t=function(e){return n+=3,Object(R.jsxs)(Q.a,{nodeId:String(n-3),label:e.name,children:[Object(R.jsx)(Q.a,{nodeId:String(n-2),label:"vertices",children:e.vertices.map((function(e){return function(e){n+=1;var t="("+e.x+", "+e.y+")";if(e.name&&(t+=" name: "+e.name),e.params.length){var a,r=Object(A.a)(e.params);try{for(r.s();!(a=r.n()).done;){var c=a.value;t+=" ".concat(c.name,"=").concat(c.value)}}catch(i){r.e(i)}finally{r.f()}}return Object(R.jsx)(Q.a,{nodeId:String(n),label:t},n)}(e)}))},n-2),Object(R.jsx)(Q.a,{nodeId:String(n-1),label:"walls",children:e.walls.map((function(e){return function(e){n+=1;var t="(".concat(e.start_idx," => ").concat(e.end_idx,")");return Object(R.jsx)(Q.a,{nodeId:String(n),label:t},n)}(e)}))},n-1)]},n-3)};return Object(R.jsxs)(K.a,{defaultCollapseIcon:Object(R.jsx)(Y.a,{}),defaultExpandIcon:Object(R.jsx)($.a,{}),defaultExpanded:["2"],children:[Object(R.jsx)(Q.a,{nodeId:"0",label:"name: "+e.name}),Object(R.jsx)(Q.a,{nodeId:"1",label:"filename: "+e.filename}),Object(R.jsx)(Q.a,{nodeId:"2",label:"levels",children:e.levels.map((function(e){return t(e)}))})]})}var ne=t(12),te=t(43),ae=t(186);function re(){var e=r.a.useContext(T),n=function(e){var n=e.vertices.map((function(e){return function(e){var n=e.x/50,t=e.y/50;return Object(R.jsxs)("mesh",{position:[n,t,.25],scale:1,rotation:new ne.Euler(Math.PI/2,0,0),children:[Object(R.jsx)("cylinderGeometry",{args:[.3,.3,.2,8]}),Object(R.jsx)("meshStandardMaterial",{color:"green"})]})}(e)})),t=e.walls.map((function(n){return function(e,n){var t=n[e.start_idx],a=n[e.end_idx],r=(t.x+a.x)/2/50,c=(t.y+a.y)/2/50,i=a.x-t.x,o=a.y-t.y,s=Math.sqrt(i*i+o*o)/50,l=Math.atan2(o,i);return Object(R.jsxs)("mesh",{position:[r,c,1],rotation:new ne.Euler(0,0,l),scale:1,children:[Object(R.jsx)("boxGeometry",{args:[s,.1,2]}),Object(R.jsx)("meshStandardMaterial",{color:"#8080d0"})]})}(n,e.vertices)})),a=e.lanes.map((function(n){return function(e,n){var t=n[e.start_idx],a=n[e.end_idx],r=(t.x+a.x)/2/50,c=(t.y+a.y)/2/50,i=a.x-t.x,o=a.y-t.y,s=Math.sqrt(i*i+o*o)/50,l=Math.atan2(o,i);return Object(R.jsxs)("mesh",{position:[r,c,0],rotation:new ne.Euler(0,0,l),scale:1,children:[Object(R.jsx)("boxGeometry",{args:[s,1,.1]}),Object(R.jsx)("meshStandardMaterial",{color:"#d08080"})]})}(n,e.vertices)}));return[].concat(Object(v.a)(n),Object(v.a)(t),Object(v.a)(a))},t=function(){var e=Object(te.c)((function(e){return e.camera}));return e.up=new ne.Vector3(0,0,1),ne.Object3D.DefaultUp=new ne.Vector3(0,0,1),Object(R.jsx)(ae.a,{enableDamping:!1,camera:e})};return Object(R.jsxs)(te.a,{frameloop:"demand",camera:{position:[3,-10,5]},children:[Object(R.jsx)(t,{}),Object(R.jsx)("axesHelper",{}),Object(R.jsx)("gridHelper",{args:[100,100],rotation:new ne.Euler(Math.PI/2,0,0),position:new ne.Vector3(50,-50,0)}),Object(R.jsx)("ambientLight",{}),Object(R.jsx)("pointLight",{position:[10,10,10]}),e.levels.map((function(e){return n(e)}))]})}var ce=Object(s.a)((function(e){return{root:{flexGrow:1,minHeight:"100vh"},flex:{flex:1},menuButton:{marginLeft:-12,marginRight:20},toolbarMargin:e.mixins.toolbar,workingArea:{backgroundColor:"black",height:"calc(100vh - 64px)"}}}));function ie(e){var n=r.a.useState(null),t=Object(o.a)(n,2),a=t[0],c=t[1],i=r.a.useState(!1),s=Object(o.a)(i,2),x=s[0],O=s[1],m=ce(e);return Object(R.jsx)("div",{className:m.root,children:Object(R.jsxs)(T.Provider,{value:q,children:[Object(R.jsx)(l.a,{position:"fixed",children:Object(R.jsxs)(u.a,{children:[Object(R.jsx)(d.a,{className:m.menuButton,color:"inherit","aria-label":"Menu",onClick:function(e){c(e.currentTarget)},children:Object(R.jsx)(b.a,{})}),Object(R.jsx)(f.a,{keepMounted:!0,anchorEl:a,open:Boolean(a),onClose:function(){return c(null)},getContentAnchorEl:null,anchorOrigin:{vertical:"bottom",horizontal:"center"},transformOrigin:{vertical:"top",horizontal:"center"},children:Object(R.jsx)(h.a,{onClick:function(){O(!0),c(null)},children:"Open Building Map"})}),Object(R.jsx)(j.a,{variant:"h5",color:"inherit",className:m.flex,children:"Traffic Editor"})]})}),Object(R.jsx)("div",{className:m.toolbarMargin}),Object(R.jsx)(W,{open:x,onOpen:function(){return O(!1)},onCancel:function(){return O(!1)}}),Object(R.jsxs)(p.a,{container:!0,spacing:0,children:[Object(R.jsx)(p.a,{item:!0,xs:3,children:Object(R.jsx)(ee,{})}),Object(R.jsx)(p.a,{item:!0,xs:9,className:m.workingArea,children:Object(R.jsx)(re,{})})]})]})})}i.a.render(Object(R.jsx)(r.a.StrictMode,{children:Object(R.jsx)(ie,{})}),document.getElementById("root"))}},[[125,1,2]]]);
//# sourceMappingURL=main.53c56f08.chunk.js.map