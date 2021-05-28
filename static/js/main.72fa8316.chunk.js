(this["webpackJsonptraffic-editor-pwa"]=this["webpackJsonptraffic-editor-pwa"]||[]).push([[0],{117:function(e,t,n){},132:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),i=n(24),o=n.n(i),c=(n(117),n(186)),l=n(205),u=n(73),s=Object(u.a)((function(e){return{building:{name:"",levels:[],params:[],uuid:""},selection:null,setSelection:function(t){return e((function(e){return{selection:t}}))},clearSelection:function(){return e((function(e){return{selection:null}}))},editorMode:"3d",setEditorMode:function(t){return e((function(e){return{editorMode:t}}))}}})),d=n(181),j=n(210),x=n(96),b=n.n(x),f=n(97),p=n.n(f),m=n(7);function v(){var e=s((function(e){return e.building})),t=s((function(e){return e.setSelection}));if(""===e.name)return Object(m.jsxs)("div",{style:{margin:"1em"},children:[Object(m.jsx)("p",{children:"No map loaded."}),Object(m.jsx)("p",{children:"To load a map, click the menu icon in the upper-left."})]});var n=function(e){return Object(m.jsx)(j.a,{nodeId:e.uuid,label:"".concat(e.name,"=").concat(e.value)},e.uuid)},r=function(e){return Object(m.jsxs)(j.a,{nodeId:e.uuid,label:e.name,children:[Object(m.jsx)(j.a,{nodeId:e.uuid+"_vertices",label:"vertices",children:e.vertices.map((function(e){return function(e){var r="("+e.x+", "+e.y+")";return e.name&&(r=e.name+": "+r),Object(m.jsx)(j.a,{nodeId:e.uuid,onClick:function(n){t(e)},label:r,children:e.params.map((function(e){return n(e)}))},e.uuid)}(e)}))}),Object(m.jsx)(j.a,{nodeId:e.uuid+"_lanes",label:"lanes",children:e.lanes.map((function(e){return function(e){var n="(".concat(e.start_idx," => ").concat(e.end_idx,")");return Object(m.jsx)(j.a,{nodeId:e.uuid,label:n,onClick:function(n){t(e)}},e.uuid)}(e)}))}),Object(m.jsx)(j.a,{nodeId:e.uuid+"_walls",label:"walls",children:e.walls.map((function(e){return function(e){var n="(".concat(e.start_idx," => ").concat(e.end_idx,")");return Object(m.jsx)(j.a,{nodeId:e.uuid,onClick:function(n){t(e)},label:n},e.uuid)}(e)}))}),Object(m.jsx)(j.a,{nodeId:e.uuid+"_floors",label:"floors",children:e.floors.map((function(e){return function(e){var r="floor (";return r+=e.vertex_indices.map((function(e){return e.toString()})).join(", ")+")",Object(m.jsx)(j.a,{nodeId:e.uuid,label:r,onClick:function(n){t(e)},children:e.params.map((function(e){return n(e)}))},e.uuid)}(e)}))})]},e.uuid)};return Object(m.jsxs)(d.a,{defaultCollapseIcon:Object(m.jsx)(b.a,{}),defaultExpandIcon:Object(m.jsx)(p.a,{}),children:[Object(m.jsx)(j.a,{nodeId:e.uuid+"_name",label:"name: "+e.name}),Object(m.jsx)(j.a,{nodeId:e.uuid+"_levels",label:"levels",children:e.levels.map((function(e){return r(e)}))})]})}var h=n(13),O=n(12),g=n(26),y=n(184),w=n(185),k=n(182),C=n(183),S=n(27);function M(e){var t=s((function(e){return e.selection})),n=s((function(e){return e.setSelection})),r=e.vertex.x/50,a=e.vertex.y/50,i="rgb(0, 128, 0)";return t&&t.uuid===e.vertex.uuid&&(i="rgb(255, 100, 10)"),Object(m.jsxs)("mesh",{position:[r,a,.25+e.elevation],scale:1,rotation:new O.Euler(Math.PI/2,0,0),onClick:function(t){t.stopPropagation(),console.log("vertex onClick"),n(e.vertex)},children:[Object(m.jsx)("cylinderGeometry",{args:[.3,.3,.2,8]}),Object(m.jsx)("meshStandardMaterial",{color:i})]},e.vertex.uuid)}function _(e){var t=s((function(e){return e.selection})),n=s((function(e){return e.setSelection})),r=e.vertex_start,i=e.vertex_end,o=(r.x+i.x)/2/50,c=(r.y+i.y)/2/50,l=i.x-r.x,u=i.y-r.y,d=Math.sqrt(l*l+u*u)/50,j=Math.atan2(u,l),x=a.a.useMemo((function(){var n=new O.Color(.1,.1,.7);return t&&t.uuid===e.wall.uuid&&n.setRGB(1,.4,.1),n}),[t,e.wall.uuid]);return Object(m.jsxs)("mesh",{position:[o,c,1+e.elevation],rotation:new O.Euler(0,0,j),scale:1,onClick:function(t){t.stopPropagation(),n(e.wall)},children:[Object(m.jsx)("boxGeometry",{args:[d,.1,2]}),Object(m.jsx)("meshStandardMaterial",{color:x})]},e.wall.uuid)}function I(e){var t=s((function(e){return e.selection})),n=s((function(e){return e.setSelection})),r=a.a.useMemo((function(){var t,n=new O.Shape,r=!1,a=Object(h.a)(e.vertices);try{for(a.s();!(t=a.n()).done;){var i=t.value;r?n.lineTo(i.x/50,i.y/50):(n.moveTo(i.x/50,i.y/50),r=!0)}}catch(c){a.e(c)}finally{a.f()}var o=e.vertices[0];return n.lineTo(o.x/50,o.y/50),n}),[e.vertices]),i=a.a.useMemo((function(){var n=new O.Color(1,1,1);return t&&t.uuid===e.floor.uuid&&n.setRGB(1,.4,.1),n}),[t,e.floor.uuid]);return Object(m.jsxs)("mesh",{onClick:function(t){t.stopPropagation(),console.log("floor onClick"),n(e.floor)},children:[Object(m.jsx)("extrudeGeometry",{args:[r,{depth:.1,bevelEnabled:!1}]}),Object(m.jsx)("meshStandardMaterial",{color:i})]},e.floor.uuid)}function N(e){var t=s((function(e){return e.selection})),n=s((function(e){return e.setSelection})),r=e.vertex_start,i=e.vertex_end,o=(r.x+i.x)/2/50,c=(r.y+i.y)/2/50,l=i.x-r.x,u=i.y-r.y,d=Math.sqrt(l*l+u*u)/50,j=Math.atan2(u,l),x=a.a.useMemo((function(){var n=new O.Color(.4,.05,.05);return t&&t.uuid===e.lane.uuid&&n.setRGB(.8,.3,.01),n}),[t,e.lane.uuid]);return Object(m.jsxs)("mesh",{position:[o,c,.2+e.elevation],rotation:new O.Euler(0,0,j),scale:1,onClick:function(t){t.stopPropagation(),n(e.lane)},children:[Object(m.jsx)("boxGeometry",{args:[d,1,.1]}),Object(m.jsx)("meshStandardMaterial",{color:x})]},e.lane.uuid)}function T(e){var t=e.level.elevation/2,n=e.level.vertices.map((function(e){return Object(m.jsx)(M,{vertex:e,elevation:t},e.uuid)})),r=e.level.walls.map((function(n){return Object(m.jsx)(_,{wall:n,vertex_start:e.level.vertices[n.start_idx],vertex_end:e.level.vertices[n.end_idx],elevation:t},n.uuid)})),a=e.level.floors.map((function(n){return Object(m.jsx)(I,{floor:n,vertices:n.vertex_indices.map((function(t){return e.level.vertices[t]})),elevation:t},n.uuid)})),i=e.level.lanes.map((function(n){return Object(m.jsx)(N,{lane:n,vertex_start:e.level.vertices[n.start_idx],vertex_end:e.level.vertices[n.end_idx],elevation:t},n.uuid)}));return Object(m.jsx)("group",{children:[].concat(Object(S.a)(n),Object(S.a)(r),Object(S.a)(a),Object(S.a)(i))})}function E(e){var t=s((function(e){return e.building})),n=s((function(e){return e.clearSelection})),a=s((function(e){return e.editorMode}));var i=function(){var e=Object(r.useRef)(null),n=Object(r.useRef)(null);O.Object3D.DefaultUp=new O.Vector3(0,0,1);var i=function(){var e,n=new O.Vector3(1/0,1/0,1/0),r=new O.Vector3(-1/0,-1/0,-1/0),a=Object(h.a)(t.levels);try{for(a.s();!(e=a.n()).done;){var i,o=e.value,c=Object(h.a)(o.vertices);try{for(c.s();!(i=c.n()).done;){var l=i.value;l.x<n.x&&(n.x=l.x),l.x>r.x&&(r.x=l.x),l.y<n.y&&(n.y=l.y),l.y>r.y&&(r.y=l.y)}}catch(u){c.e(u)}finally{c.f()}}}catch(u){a.e(u)}finally{a.f()}return new O.Box3(n,r)}(),o=new O.Vector3((i.min.x+i.max.x)/2/50,(i.min.y+i.max.y)/2/50,0);return Object(m.jsxs)(m.Fragment,{children:[Object(m.jsx)(k.a,{ref:e,position:[20,-20,5],fov:100,makeDefault:"3d"===a}),Object(m.jsx)(C.a,{ref:n,position:[0,0,5],zoom:20,makeDefault:"2d"===a}),"3d"===a?e&&Object(m.jsx)(y.a,{enableDamping:!1,camera:e.current,target:[20,-10,0],mouseButtons:{LEFT:-1,MIDDLE:O.MOUSE.PAN,RIGHT:O.MOUSE.ROTATE}}):n&&Object(m.jsx)(w.a,{enableDamping:!1,target:o,camera:n.current,maxPolarAngle:0,minAzimuthAngle:0,maxAzimuthAngle:0,mouseButtons:{LEFT:-1,MIDDLE:O.MOUSE.PAN,RIGHT:-1}})]})};return Object(m.jsxs)(g.a,{frameloop:"demand",onPointerMissed:function(){console.log("onPointerMissed"),n()},children:[Object(m.jsx)(i,{}),Object(m.jsx)("axesHelper",{}),Object(m.jsx)("ambientLight",{}),Object(m.jsx)("pointLight",{position:[10,10,10]}),t.levels.map((function(e){return Object(m.jsx)(T,{level:e},e.uuid)}))]})}var D=n(189),R=n(190),A=n(191),B=n(188),G=n(187),H=Object(c.a)((function(e){return{noSelectionDiv:{},table:{padding:"0px",margin:"0px"},tableHead:{},tableHeadRow:{borderBottomStyle:"solid",borderBottom:"1px",borderBottomColor:e.palette.primary.main},tableHeadCell:{fontWeight:"bold",padding:"0px",paddingLeft:"5px"},tableCell:{padding:"0px",paddingLeft:"5px"}}}));function L(){var e=H(),t=s((function(e){return e.selection}));if(!t)return Object(m.jsx)("div",{className:e.noSelectionDiv});var n=t.params.map((function(t){return Object(m.jsxs)(G.a,{children:[Object(m.jsx)(B.a,{className:e.tableCell,children:t.name}),Object(m.jsx)(B.a,{className:e.tableCell,children:t.value.toString()})]})}));return Object(m.jsxs)(D.a,{className:e.table,children:[Object(m.jsx)(R.a,{className:e.tableHead,children:Object(m.jsxs)(G.a,{className:e.tableHeadRow,children:[Object(m.jsx)(B.a,{className:e.tableHeadCell,children:"Property Name"}),Object(m.jsx)(B.a,{className:e.tableHeadCell,children:"Property Value"})]})}),Object(m.jsx)(A.a,{children:n})]})}var P=n(11),z=n.n(P),F=n(35),V=n(20),U=n(200),q=n(201),J=n(202),W=n(204),K=n(211),Q=n(102),X=n.n(Q),Y=n(208),Z=n(203),$=n(64),ee=n(16),te=n(100),ne=n(209),re=n(196),ae=n(197),ie=n(199),oe=n(192),ce=n(193),le=n(133),ue=n(194),se=n(195),de=n(101),je=n.n(de),xe=n(198),be=n(103),fe=n(207);function pe(e){if(!e)return[];var t=Array();for(var n in e){var r=e[n],a={name:n,type_idx:r[0],value:r[1],uuid:Object(fe.a)()};t.push(a)}return t}function me(e,t){return{uuid:Object(fe.a)(),name:e,elevation:t.elevation,params:Array(),vertices:t.vertices.map((function(e){return{x:(t=e)[0],y:-t[1],name:t[3],uuid:Object(fe.a)(),params:pe(t[4])};var t})),walls:t.walls.map((function(e){return{start_idx:(t=e)[0],end_idx:t[1],params:pe(t[2]),uuid:Object(fe.a)()};var t})),floors:t.floors.map((function(e){return t=e,{uuid:Object(fe.a)(),params:pe(t.parameters),vertex_indices:t.vertices.map((function(e){return e}))};var t})),lanes:t.lanes.map((function(e){return t=e,{uuid:Object(fe.a)(),start_idx:t[0],end_idx:t[1],params:pe(t[2])};var t}))}}function ve(e){var t=be.a.parse(e),n={name:t.name,levels:Array(),params:[],uuid:Object(fe.a)()};for(var r in t.levels){var a=t.levels[r];n.levels.push(me(r,a))}return n}function he(e){s.setState({building:ve(e),selection:null})}function Oe(e){return ge.apply(this,arguments)}function ge(){return(ge=Object(F.a)(z.a.mark((function e(t){return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(t).then((function(e){return e.text()})).then((function(e){return he(e)}));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function ye(e){return we.apply(this,arguments)}function we(){return(we=Object(F.a)(z.a.mark((function e(t){return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Oe("/traffic-editor-js"+"/demos/".concat(t,"/").concat(t,".building.yaml"));case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var ke=Object(c.a)((function(e){return{directoryButton:{fontSize:e.typography.h5.fontSize},filename:{fontSize:e.typography.h5.fontSize,textDecoration:"underline"},dialog:{backgroundColor:e.palette.background.paper}}}));function Ce(e){var t=ke(e),n=a.a.useState([]),r=Object(V.a)(n,2),i=r[0],o=r[1],c=a.a.useState(),l=Object(V.a)(c,2),u=l[0],s=l[1],d=function(){var e=Object(F.a)(z.a.mark((function e(){var t,n,r,a,i,c,l,u;return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return o([]),e.next=3,window.showDirectoryPicker();case 3:return t=e.sent,e.next=6,s(t);case 6:n=!0,r=!1,e.prev=8,i=function(){var e=u;e.name.endsWith(".building.yaml")&&o((function(t){return[].concat(Object(S.a)(t),[e.name])}))},c=Object(te.a)(t.values());case 11:return e.next=13,c.next();case 13:return l=e.sent,n=l.done,e.next=17,l.value;case 17:if(u=e.sent,n){e.next=23;break}i();case 20:n=!0,e.next=11;break;case 23:e.next=29;break;case 25:e.prev=25,e.t0=e.catch(8),r=!0,a=e.t0;case 29:if(e.prev=29,e.prev=30,n||null==c.return){e.next=34;break}return e.next=34,c.return();case 34:if(e.prev=34,!r){e.next=37;break}throw a;case 37:return e.finish(34);case 38:return e.finish(29);case 39:case"end":return e.stop()}}),e,null,[[8,25,29,39],[30,,34,38]])})));return function(){return e.apply(this,arguments)}}(),j=function(){var t=Object(F.a)(z.a.mark((function t(n){var r,a;return z.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!u){t.next=11;break}return t.next=3,u.getFileHandle(n);case 3:return r=t.sent,t.next=6,r.getFile();case 6:return a=t.sent,t.next=9,a.text();case 9:he(t.sent);case 11:e.onOpen();case 12:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}();return Object(m.jsxs)(ne.a,{open:e.open,onClose:e.onCancel,children:[Object(m.jsx)(re.a,{children:"Open Building Map"}),Object(m.jsxs)(ae.a,{className:t.dialog,children:[Object(m.jsx)(xe.a,{variant:"contained",color:"primary",onClick:d,children:"Select Directory..."}),function(){if(i.length>0)return Object(m.jsx)("div",{children:Object(m.jsx)(oe.a,{subheader:Object(m.jsx)(ce.a,{component:"div",children:"Available Files"}),children:i.map((function(e){return Object(m.jsxs)(le.a,{button:!0,children:[Object(m.jsx)(ue.a,{children:Object(m.jsx)(je.a,{})}),Object(m.jsx)(se.a,{primary:e,onClick:function(t){j(e)}})]},e)}))})})}()]}),Object(m.jsx)(ie.a,{children:Object(m.jsx)(xe.a,{onClick:e.onCancel,color:"primary",children:"Cancel"})})]})}var Se=Object(ee.a)((function(e){return{root:{backgroundColor:e.palette.primary.light,padding:e.spacing(.5)},grouped:{color:e.palette.primary.contrastText,"&.Mui-selected:hover, &:hover":{background:e.palette.primary.dark},"&.Mui-selected":{background:e.palette.primary.dark,color:e.palette.primary.contrastText}}}}))(K.a),Me=Object(c.a)((function(e){return{root:{flexGrow:1,minHeight:"100vh"},flex:{flex:1},menuButton:{marginLeft:-12,marginRight:20},toolbarMargin:e.mixins.toolbar,workingArea:{backgroundColor:"black",height:"calc(100vh - 64px)"},mainGrid:{},gridLeftColumn:{borderRight:"5px",borderRightStyle:"solid",borderRightColor:e.palette.primary.main},propertyGridItem:{borderTop:"5px",borderTopStyle:"solid",borderTopColor:e.palette.primary.main}}}));function _e(e){var t=Me(e),n=a.a.useState(null),r=Object(V.a)(n,2),i=r[0],o=r[1],c=a.a.useState(!1),l=Object(V.a)(c,2),u=l[0],d=l[1],j=s((function(e){return e.editorMode})),x=s((function(e){return e.setEditorMode}));return Object(m.jsxs)(U.a,{position:"fixed",children:[Object(m.jsxs)(q.a,{children:[Object(m.jsx)(J.a,{className:t.menuButton,color:"inherit","aria-label":"Menu",onClick:function(e){o(e.currentTarget)},children:Object(m.jsx)(X.a,{})}),Object(m.jsxs)(Y.a,{keepMounted:!0,anchorEl:i,open:Boolean(i),onClose:function(){return o(null)},getContentAnchorEl:null,anchorOrigin:{vertical:"bottom",horizontal:"center"},transformOrigin:{vertical:"top",horizontal:"center"},transitionDuration:0,children:[Object(m.jsx)(Z.a,{onClick:Object(F.a)(z.a.mark((function e(){return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Oe("http://localhost:8000/map_file");case 2:o(null);case 3:case"end":return e.stop()}}),e)}))),children:"Open map from localhost:8000"}),Object(m.jsx)(Z.a,{onClick:Object(F.a)(z.a.mark((function e(){return z.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ye("office");case 2:o(null);case 3:case"end":return e.stop()}}),e)}))),children:"Open demo map"}),Object(m.jsx)(Z.a,{onClick:function(){d(!0),o(null)},children:"Open map from local file..."})]}),Object(m.jsx)($.a,{variant:"h6",color:"inherit",className:t.flex,children:"Traffic Editor"}),Object(m.jsxs)(Se,{value:j,size:"small",exclusive:!0,onChange:function(e,t){null!==t&&x(t)},"aria-label":"editor mode",children:[Object(m.jsx)(W.a,{value:"3d",children:"3D"}),Object(m.jsx)(W.a,{value:"2d",children:"2D"})]})]}),Object(m.jsx)(Ce,{open:u,onOpen:function(){return d(!1)},onCancel:function(){return d(!1)}})]})}var Ie=Object(c.a)((function(e){return{root:{flexGrow:1,minHeight:"100vh"},flex:{flex:1},menuButton:{marginLeft:-12,marginRight:20},toolbarMargin:e.mixins.toolbar,workingArea:{backgroundColor:"black",height:"calc(100vh - 64px)"},gridLeftColumn:{borderRight:"5px",borderRightStyle:"solid",borderRightColor:e.palette.primary.main},propertyGridItem:{borderTop:"5px",borderTopStyle:"solid",borderTopColor:e.palette.primary.main}}}));function Ne(e){var t=Ie(e);return Object(m.jsxs)("div",{className:t.root,children:[Object(m.jsx)(_e,{}),Object(m.jsx)("div",{className:t.toolbarMargin}),Object(m.jsxs)(l.a,{container:!0,spacing:0,children:[Object(m.jsxs)(l.a,{className:t.gridLeftColumn,container:!0,xs:3,direction:"column",spacing:0,children:[Object(m.jsx)(l.a,{item:!0,style:{height:"40vh",overflow:"auto"},children:Object(m.jsx)(v,{})}),Object(m.jsx)(l.a,{item:!0,className:t.propertyGridItem,style:{height:"40vh",overflow:"auto"},children:Object(m.jsx)(L,{})})]}),Object(m.jsx)(l.a,{item:!0,xs:9,className:t.workingArea,children:Object(m.jsx)(E,{})})]})]})}o.a.render(Object(m.jsx)(a.a.StrictMode,{children:Object(m.jsx)(Ne,{})}),document.getElementById("root"))}},[[132,1,2]]]);
//# sourceMappingURL=main.72fa8316.chunk.js.map