!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="92f424ff-2626-445d-8db8-8be30244094e",e._sentryDebugIdIdentifier="sentry-dbid-92f424ff-2626-445d-8db8-8be30244094e")}catch(e){}}(),(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[810],{99955:function(e,n,t){Promise.resolve().then(t.bind(t,26032))},26032:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return d}});var o=t(96342),r=t(70290),i=t(73806),s=t(68239),a=t(44796),l=t(91160),u=t(27572),d=function(){let e=(0,s.useRouter)(),n=(0,a.useRef)(null),{user:t,anonUser:d}=(0,r.kP)();(0,a.useEffect)(()=>{let e;if(!n.current)return;let t=new l.xsS,o=new l.FM8,r=new l.FM8,i=new l.FM8,s=new u.CP7({canvas:n.current,antialias:!0}),a=window.innerWidth,d=window.innerHeight,c=a/d,f=new l.iKG(-c,c,1,-1,.1,1e3);f.position.z=1;let v=e=>{e instanceof MouseEvent?o.set(e.clientX,e.clientY):e instanceof TouchEvent&&o.set(e.touches[0].clientX,e.touches[0].clientY)};window.addEventListener("mousemove",v),window.addEventListener("touchmove",v);let p=new l._12(2,2),g=new l.jyz({vertexShader:"\n        varying vec2 v_texcoord;\n        void main() {\n          gl_Position = vec4(position, 1.0);\n          v_texcoord = uv;\n        }\n      ",fragmentShader:"\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nvarying vec2 v_texcoord;\n\nuniform vec2 u_mouse;\nuniform vec2 u_resolution;\nuniform float u_pixelRatio;\n\n/* common constants */\n#ifndef PI\n#define PI 3.1415926535897932384626433832795\n#endif\n#ifndef TWO_PI\n#define TWO_PI 6.2831853071795864769252867665590\n#endif\n\n/* Coordinate and unit utils */\n#ifndef FNC_COORD\n#define FNC_COORD\nvec2 coord(in vec2 p) {\n    p = p / u_resolution.xy;\n    // correct aspect ratio\n    if (u_resolution.x > u_resolution.y) {\n        p.x *= u_resolution.x / u_resolution.y;\n        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;\n    } else {\n        p.y *= u_resolution.y / u_resolution.x;\n        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;\n    }\n    // centering\n    p -= 0.5;\n    p *= vec2(-1.0, 1.0);\n    return p;\n}\n#endif\n\n#define st0 coord(gl_FragCoord.xy)\n#define mx coord(u_mouse * u_pixelRatio)\n\n/* signed distance to a circle */\nfloat sdCircle(in vec2 st, in vec2 center) {\n    return length(st - center) * 2.0;\n}\n\n/* Polygon SDF (for a convex polygon)\n   Reference: Inigo Quilez: https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm\n*/\nfloat sdPolygon(vec2 p, vec2 v0, vec2 v1, vec2 v2, vec2 v3) {\n    vec2 V[4];\n    V[0] = v0; V[1] = v1; V[2] = v2; V[3] = v3;\n\n    float d = dot(p - V[0], p - V[0]);\n    float s = 1.0;\n\n    for (int i = 0; i < 4; i++) {\n        vec2 e = V[(i+1)%4] - V[i];\n        vec2 w = p - V[i];\n        float proj = clamp(dot(w, e)/dot(e, e), 0.0, 1.0);\n        vec2 closest = V[i] + e * proj;\n        float distSq = dot(p - closest, p - closest);\n        if (distSq < d) d = distSq;\n        float cross = w.x * e.y - w.y * e.x;\n        if (cross < 0.0) s = -1.0;\n    }\n\n    return s * sqrt(d);\n}\n\n/* antialiased step function */\nfloat aastep(float threshold, float value) {\n    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;\n    return smoothstep(threshold - afwidth, threshold + afwidth, value);\n}\n\n/* Signed distance drawing methods */\nfloat fill(in float x) { return 1.0 - aastep(0.0, x); }\nfloat fill(float x, float size, float edge) {\n    return 1.0 - smoothstep(size - edge, size + edge, x);\n}\n\nfloat stroke(in float d, in float t) { return (1.0 - aastep(t, abs(d))); }\nfloat stroke(float x, float size, float w, float edge) {\n    float d = smoothstep(size - edge, size + edge, x + w * 0.5) - smoothstep(size - edge, size + edge, x - w * 0.5);\n    return clamp(d, 0.0, 1.0);\n}\n\nvoid main() {\n    vec2 pixel = 1.0 / u_resolution.xy;\n    vec2 st = st0 + 0.5;\n    vec2 posMouse = mx * vec2(1., -1.) + 0.5;\n    \n    /* sdf Circle params */\n    float circleSize = 0.05;\n    float circleEdge = 0.9;\n\n    /* sdf Circle */\n    float sdfCircle = fill(sdCircle(st, posMouse), circleSize, circleEdge);\n\n    /* Transform to a more convenient space for the polygon */\n    vec2 p = (st - 0.5) * 4.2;\n\n    // Vertices for grok logo\n    vec2 v0 = vec2(1.0, -1.0);   // bottom-left\n    vec2 v1 = vec2(0.5, -1); // bottom-right\n    vec2 v2 = vec2(-1, 1);  // top-right\n    vec2 v3 = vec2(-0.5, 1);  // top-left\n\n    float sdfPoly = sdPolygon(p, v0, v1, v2, v3);\n\n    // Border size around the logo\n    float borderSize = 0.05;\n\n    // Combine logo with circle-based stroke\n    float sdf = stroke(sdfPoly, 0.0, borderSize, sdfCircle) * 4.0;\n\n    vec3 color = vec3(sdf);\n    gl_FragColor = vec4(color.rgb, 1.0);\n}\n",uniforms:{u_mouse:{value:r},u_resolution:{value:i},u_pixelRatio:{value:1}}}),h=new l.Kj0(p,g);t.add(h);let x=0,m=()=>{let n=.001*performance.now(),i=n-x;x=n,r.x=l.M8C.damp(r.x,o.x,8,i),r.y=l.M8C.damp(r.y,o.y,8,i),s.render(t,f),e=requestAnimationFrame(m)},b=()=>{a=window.innerWidth,d=window.innerHeight;let e=window.devicePixelRatio;s.setSize(a,d,!1),s.setPixelRatio(e),f.left=-1,f.right=1,f.top=1,f.bottom=-1,f.updateProjectionMatrix(),i.set(a,d).multiplyScalar(e),g.uniforms.u_pixelRatio.value=e};return b(),m(),window.addEventListener("resize",b),()=>{window.removeEventListener("resize",b),window.removeEventListener("mousemove",v),window.removeEventListener("touchmove",v),cancelAnimationFrame(e),s.dispose(),p.dispose(),g.dispose()}},[]);let c=(0,a.useCallback)(()=>{e.replace("sign-in")},[]),f=(0,a.useCallback)(()=>{e.replace("sign-out")},[]);return(0,o.jsxs)("main",{className:"dark",children:[(0,o.jsx)("canvas",{ref:n,style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",display:"block"}}),(0,o.jsx)("div",{style:{position:"absolute",top:"90%",left:"50%",transform:"translate(-50%, -50%)"},children:(0,o.jsxs)("div",{className:"flex flex-col gap-2 items-center",children:[(0,o.jsx)("div",{className:"text-white",children:"Coming Soon"}),(0,o.jsx)(i.z,{onClick:()=>window.location.href="https://grok.x.com",children:"Go to Grok in X"})]})}),(0,o.jsx)("div",{className:"absolute top-8 -right-5 transform -translate-x-1/2 -translate-y-1/2 opacity-90",children:t||d?(0,o.jsx)(i.z,{variant:"ghost",onClick:f,children:"Log Out"}):(0,o.jsx)(i.z,{variant:"ghost",onClick:c,children:"Sign in"})})]})}},70290:function(e,n,t){"use strict";t.d(n,{kP:function(){return o.useSession}});var o=t(71896);t(26436)},71896:function(e,n,t){"use strict";t.d(n,{default:function(){return f},useSession:function(){return c}});var o=t(96342);t(59662);var r=(0,t(67663).$)("3d55585550d3305c62709ccb2a9fef78be08f3d2"),i=t(44796),s=t(10940),a=t(74198),l=t(26436);let u=(0,i.createContext)(void 0),d=e=>(0,s.M)()(n=>({user:null==e?void 0:e.user,updateUser:e=>n(n=>({...n||{},user:{...n.user||{},...e}})),clearUser:()=>n(e=>({...e||{},user:void 0})),refreshSession:async()=>(0,l.Z)().then(e=>{n(e)}),anonUser:null==e?void 0:e.anonUser,refreshAnonUser:async(e,t)=>r({privateKey:t,anonUserId:e}).then(t=>{n(n=>({...n||{},anonUser:{anonUserId:e,expirationDate:t.challengeExpirationDate}}))})})),c=()=>{let e=(0,i.useContext)(u);if(!e)throw Error("useSession must be used within SessionStoreProvider");return(0,a.o)(e)};var f=e=>{let{initialData:n,children:t}=e,r=(0,i.useRef)();return r.current||(r.current=d(n)),(0,o.jsx)(u.Provider,{value:r.current,children:t})}},26436:function(e,n,t){"use strict";t(59662);var o=t(67663);n.Z=(0,o.$)("4f6050e9caf7c9ac64f16c7979ce79be3e6ea7a3")},73806:function(e,n,t){"use strict";t.d(n,{d:function(){return l},z:function(){return u}});var o=t(96342),r=t(51448),i=t(42063),s=t(44796),a=t(8240);let l=(0,i.j)(["inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors","focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50","[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:-mx-0.5"],{variants:{variant:{primary:"bg-button-primary text-background hover:bg-button-primary-hover",secondary:"bg-button-secondary text-primary hover:bg-button-secondary-hover",card:"ring-1 ring-inset ring-card-border bg-card hover:bg-card-hover text-primary",ghost:"text-primary hover:bg-button-ghost-hover",ghostSecondary:"text-secondary hover:text-primary hover:bg-button-ghost-hover",text:"text-primary bg-transparent hover:underline",outline:"bg-background border border-card-border backdrop-blur-xl shadow-sm text-secondary hover:text-primary",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",link:"text-primary underline-offset-4 hover:underline"},size:{md:"h-9 rounded-xl px-3.5 py-2 text-base",icon:"h-10 w-10 rounded-xl",none:"",lg:"h-10 rounded-3xl px-4",pill:"h-9 rounded-full px-3.5 py-2 text-base",default:"h-9 px-4 py-2 rounded-lg",sm:"h-8 rounded-lg px-3 text-xs",iconSm:"h-6 w-6 rounded-full",noPadding:"h-9 rounded-lg"}},defaultVariants:{variant:"primary",size:"default"}}),u=s.forwardRef((e,n)=>{let{className:t,variant:i,size:s,asChild:u=!1,...d}=e,c=u?r.g7:"button";return(0,o.jsx)(c,{className:(0,a.cn)(l({variant:i,size:s,className:t})),ref:n,type:"button",...d})});u.displayName="Button"},8240:function(e,n,t){"use strict";t.d(n,{cn:function(){return i}});var o=t(70594),r=t(24484);function i(){for(var e=arguments.length,n=Array(e),t=0;t<e;t++)n[t]=arguments[t];return(0,r.m6)((0,o.W)(n))}},68239:function(e,n,t){"use strict";t.r(n);var o=t(58115),r={};for(var i in o)"default"!==i&&(r[i]=(function(e){return o[e]}).bind(0,i));t.d(n,r)},67663:function(e,n,t){"use strict";Object.defineProperty(n,"$",{enumerable:!0,get:function(){return r}});let o=t(59662);function r(e){let{createServerReference:n}=t(59080);return n(e,o.callServer)}},74198:function(e,n,t){"use strict";t.d(n,{U:function(){return l},o:function(){return s}});var o=t(44796),r=t(10940);let i=e=>e;function s(e,n=i){let t=o.useSyncExternalStore(e.subscribe,()=>n(e.getState()),()=>n(e.getInitialState()));return o.useDebugValue(t),t}let a=e=>{let n=(0,r.M)(e),t=e=>s(n,e);return Object.assign(t,n),t},l=e=>e?a(e):a},10940:function(e,n,t){"use strict";t.d(n,{M:function(){return r}});let o=e=>{let n;let t=new Set,o=(e,o)=>{let r="function"==typeof e?e(n):e;if(!Object.is(r,n)){let e=n;n=(null!=o?o:"object"!=typeof r||null===r)?r:Object.assign({},n,r),t.forEach(t=>t(n,e))}},r=()=>n,i={setState:o,getState:r,getInitialState:()=>s,subscribe:e=>(t.add(e),()=>t.delete(e))},s=n=e(o,r,i);return i},r=e=>e?o(e):o}},function(e){e.O(0,[829,411,681,454,190,744],function(){return e(e.s=99955)}),_N_E=e.O()}]);