import{r as k,j as e,ad as P,ac as z,R as u}from"./bbqge6n6s1oo3m8q.js";import{ap as f,aY as A,dT as O,dU as o,at as h}from"./lemv4z8z7gk39eh5.js";import{cG as D,cH as H,q as I,W as M,U as X}from"./lt2ef0v2naysiy2l.js";import{b as F,U as q,c as B}from"./mn1nh5nafluqb0zf.js";function G({isExpanded:a,children:t}){const s=k.useRef(null);return e.jsx(P,{children:e.jsx(z.div,{className:"z-[1] flex-shrink-0 overflow-x-hidden bg-token-sidebar-surface-primary max-md:!w-0",ref:s,initial:!1,animate:{width:a?"400px":0,transition:{type:"spring",bounce:.12,duration:.3}},onAnimationStart:()=>{s.current&&(s.current.style.visibility="visible")},onAnimationComplete:()=>{s.current&&(a||(s.current.style.visibility="hidden"))},children:e.jsx("div",{className:f("absolute h-full w-[400px]",!a&&"pointer-events-none"),children:e.jsx("div",{className:"flex h-full flex-col",children:t})})})})}function S({children:a,hideNavigation:t=!1,mobileHeaderContent:s,mobileHeaderLeftContent:b,mobileHeaderRightContent:m,mobileHeaderBottomContent:p,sidebar:l,threadFlyout:x,forceOpenDesktopSidebar:v=!1}){const{isUnauthenticated:i}=A(),[j,w]=D(r=>[r.activeStageSidebar,r.activeSidebar]),g=O(),N=o("searchSources"),U=o("summarizer"),C=o("retrievalResults"),y=H(),d=[];let c=null;u.Children.forEach(a,r=>{u.isValidElement(r)&&(r.type===S.Sidebars?c=r:d.push(r))});const n=!i&&!t&&l!=null,R=!t&&(n||i),E=I()&&!!U,T=g&&(!!N||E||!!C);return e.jsxs("div",{className:f("relative flex h-full w-full overflow-hidden transition-colors",w!=="popover-nav"&&"z-0"),children:[n&&e.jsx(F,{isExpanded:v||!y,isPopoverOnDesktop:j,children:i?e.jsx(q,{}):l}),e.jsxs("div",{className:"relative flex h-full max-w-full flex-1 flex-col overflow-hidden",children:[R&&e.jsxs(h,{children:[e.jsx(M,{}),e.jsx(B,{onClickOpenSidebar:()=>X.togglePopoverNavSidebar(),showNavSidebar:n,leftContent:b,rightContent:m,bottomContent:p,children:s})]}),e.jsx("main",{className:"relative h-full w-full flex-1 overflow-auto transition-width",children:d})]}),e.jsx(h,{children:e.jsx(G,{isExpanded:T,children:x})}),c]})}function V({children:a}){return e.jsx(e.Fragment,{children:a})}S.Sidebars=V;export{S};
//# sourceMappingURL=kpws2hmhwlr4j51g.js.map
