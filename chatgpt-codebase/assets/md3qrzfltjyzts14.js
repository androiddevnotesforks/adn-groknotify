import{j as e,r as b,a as M,e as z,c as I,ac as C,L,M as j}from"./bbqge6n6s1oo3m8q.js";import{eK as y,eL as E,d0 as k,eM as A,d1 as _,c_ as v,d7 as w,d9 as T,cG as N,eN as R,eO as F,U as G,eP as P,eQ as U,eR as D,cN as B,cO as H,cJ as K,$ as W,_ as q,eS as O,eT as f,d2 as x}from"./lt2ef0v2naysiy2l.js";import{d$ as Q,L as $,ap as J,aV as V,cy as Z,ba as X,dd as Y}from"./lemv4z8z7gk39eh5.js";import{G as ee}from"./mmwacm2oz5glh3tg.js";function ce({isNewConversation:a}){const r=y();return e.jsxs(e.Fragment,{children:[e.jsx(se,{isNewConversation:a}),r?e.jsx(E,{}):null]})}const se=({isNewConversation:a})=>{const[r,i]=b.useState(!1),d=Q(),u=M(),m=z(),n=I(),o=$();let g;return o==null?null:(o.canInteractWithGizmos()?g=T:g=n.formatMessage({id:"GizmoSidebarListItem.newChat",defaultMessage:"New chat"}),e.jsx("div",{className:J(d?"":"bg-token-sidebar-surface-primary","pt-0"),children:e.jsx(e.Fragment,{children:e.jsx(C.div,{whileTap:{scale:.98},onMouseEnter:()=>{i(!0)},onMouseLeave:()=>{i(!1)},children:e.jsx(k,{loggingGizmoId:"primary",href:"/",isHovered:r,onClick:l=>{V(Z(u))&&!a&&(l.preventDefault(),A(m))},icon:e.jsx(_,{isFirstParty:!0,className:"h-6 w-6"}),isMenuOpen:!1,label:g,hoverRightIcon:e.jsx("div",{className:"flex gap-2",children:e.jsx(X,{side:"right",label:n.formatMessage(v.newChat),className:"flex items-center",children:e.jsx("button",{className:"invisible text-token-text-secondary hover:text-token-text-primary group-hover:visible","aria-label":n.formatMessage(v.newChat),children:e.jsx(w,{className:"icon-md"})})})})})})})}))};function te(){const a=I(),r=N(),i=a.formatMessage({id:"gizmo.exploreStoreEnabled",defaultMessage:"Explore GPTs"});return e.jsx(R,{children:e.jsx(C.div,{whileTap:{scale:.98},children:e.jsx(L,{to:F(),onClick:()=>{r.activeSidebar==="popover-nav"&&G.setActiveSidebar(!1)},children:e.jsx(P,{icon:U,"data-testid":"explore-gpts-button",children:i})},"explore")})})}const ae=2;function ie({gizmos:a,isGizmoFlyout:r,maxToShowOnLoad:i=4,isScreenArch:d,showAllSidebarItems:u}){const m=O(a,s=>s.flair.kind),n=[...(m[f.Workspace]?.map(({resource:s})=>({gizmo:s,section:x.Workspace}))??[]).slice(0,3),...m[f.FirstParty]?.map(({resource:s})=>({gizmo:s,section:x.Keep}))??[],...m[f.SidebarKeep]?.map(({resource:s})=>({gizmo:s,section:x.Keep}))??[]],o=m[f.Recent]??[],l=(d||u?o:o.slice(0,ae)).map(({resource:s})=>({gizmo:s,section:x.Recents})),S=l.length,h=n.length;let t=[];r&&d?t=[...n,...l]:!r&&d?t=n:(t=[...n,...l],u||(t.length>i&&h>i?t=t.slice(0,h):t.length>i&&(t=t.slice(0,i))));const c=d?S>0:a.length>t.length;return{listItems:t,itemsLeft:a.length-t.length,needsToCollapseItems:c,total:a.length}}function de({gizmo:a,currentGizmoId:r,maxToShowOnLoad:i,hideOverflowMenu:d=!1}){const u=b.useRef(!1),m=!i,n=Y(),o=!n.get("enable_arch_updates",!1)||n.get("include_legacy_sidebar_contents",!1),g=N(c=>!D.isGptListCollapsed(c)),{listItems:l,needsToCollapseItems:S,itemsLeft:h}=ie({gizmos:a,isGizmoFlyout:m,maxToShowOnLoad:i,isScreenArch:!o,showAllSidebarItems:g});b.useEffect(()=>{l.length>0&&!u.current&&(B({namespace:H.ChatPageLoad})?.logTiming("render_gizmo_sidebar"),u.current=!0)},[l]);function t(c,s){const p=e.jsx(ee,{gizmo:c,isActive:c.gizmo.id===r,section:s,hideOverflowMenu:d},c.gizmo.id);return o?p:e.jsx("li",{children:p})}return e.jsxs("div",{children:[l.map(({gizmo:c,section:s},p)=>e.jsxs(b.Fragment,{children:[p>1&&s!==l[p-1].section&&e.jsx("div",{className:"my-2 ml-2 h-px w-7 bg-token-sidebar-surface-tertiary"}),t(c,s)]},p)),o&&S?e.jsxs("button",{onClick:G.toggleGptListCollapsed,className:"flex h-10 w-full items-center gap-2 rounded-lg px-2 text-sm text-token-text-primary hover:bg-token-sidebar-surface-secondary",children:[e.jsx("div",{className:"flex h-6 w-6 flex-shrink-0 items-center justify-center",children:e.jsx(K,{className:"icon-md text-token-text-primary"})}),e.jsx("div",{className:"flex grow items-center gap-1",children:g?e.jsxs(e.Fragment,{children:[e.jsx(j,{id:"GizmoSidebarList.showLess",defaultMessage:"See less"}),e.jsx(W,{className:"icon-xs"})]}):e.jsxs(e.Fragment,{children:[e.jsx(j,{id:"GizmoSidebarList.showMoreItems",defaultMessage:"{numMore} more",values:{numMore:h}}),e.jsx(q,{className:"icon-xs"})]})})]}):null,o&&e.jsx(te,{})]})}export{ce as D,te as E,de as G,ie as g};
//# sourceMappingURL=md3qrzfltjyzts14.js.map
