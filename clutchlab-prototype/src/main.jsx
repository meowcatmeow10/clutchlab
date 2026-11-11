import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  Activity, ArrowUpRight, Bell, Box, Brain, Check, ChevronDown, CircleHelp,
  Crosshair, Flame, Gamepad2, Gauge, GraduationCap, Home, Map, Menu,
  Play, Plus, Search, Settings, Shield, Sparkles, Target, Trophy, Users,
  Volume2, Zap
} from 'lucide-react';
import './style.css';

const nav = [
  { label: 'Overview', icon: Home },
  { label: '3D Viewer', icon: Box },
  { label: 'Training', icon: Crosshair },
  { label: 'Utility Academy', icon: GraduationCap },
  { label: 'Community', icon: Users },
];

function Sidebar({ page, setPage, mobileOpen, setMobileOpen }) {
  return <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
    <div className="brand"><div className="brand-mark"><Crosshair size={21}/></div><span>CLUTCH<span className="brand-accent">LAB</span></span></div>
    <div className="workspace"><div className="avatar">P</div><div><b>Player space</b><small>Free account</small></div><ChevronDown size={15}/></div>
    <div className="nav-label">WORKSPACE</div>
    {nav.map(({label,icon:Icon}) => <button key={label} className={`nav-item ${page===label?'active':''}`} onClick={()=>{setPage(label);setMobileOpen(false)}}><Icon size={18}/><span>{label}</span>{label==='Training'&&<span className="nav-new">NEW</span>}</button>)}
    <div className="sidebar-bottom">
      <div className="upgrade-card"><div className="upgrade-icon"><Sparkles size={17}/></div><b>Unlock your potential</b><p>Build better habits with focused practice.</p><button onClick={()=>setPage('Training')}>Explore training <ArrowUpRight size={14}/></button></div>
      <button className="nav-item"><Settings size={18}/><span>Settings</span></button>
      <div className="profile-row"><div className="avatar profile-avatar">P</div><div><b>PlayerOne</b><small>Level 12 · Beginner</small></div><button className="icon-button"><ChevronDown size={16}/></button></div>
    </div>
  </aside>
}

function Stat({ icon: Icon, label, value, note, color='purple' }) {
  return <div className="stat-card"><div className={`stat-icon ${color}`}><Icon size={18}/></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>
}

function MapScene() {
  const mountRef = useRef(null);
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#111722');
    scene.fog = new THREE.Fog('#111722', 24, 62);
    const camera = new THREE.PerspectiveCamera(48, el.clientWidth/el.clientHeight, .1, 150);
    camera.position.set(17, 18, 22);
    const renderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.target.set(0,0,0); controls.maxPolarAngle=Math.PI/2.05;
    scene.add(new THREE.HemisphereLight(0x9eb8dc,0x22202a,2.0));
    const sun = new THREE.DirectionalLight(0xffe0bd,2.4); sun.position.set(-8,18,10); sun.castShadow=true; scene.add(sun);
    const floorMat = new THREE.MeshStandardMaterial({color:'#77786d', roughness:.94});
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(34,30),floorMat); floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; scene.add(floor);
    const grid = new THREE.GridHelper(34,34,'#a4a28f','#888777'); grid.position.y=.025; grid.material.transparent=true; grid.material.opacity=.13; scene.add(grid);
    const wallMat = new THREE.MeshStandardMaterial({color:'#b5a58c',roughness:.9});
    const darkMat = new THREE.MeshStandardMaterial({color:'#4c514e',roughness:.95});
    function block(x,z,w,d,h,mat=wallMat, rot=0) {
      const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat); m.position.set(x,h/2,z); m.rotation.y=rot; m.castShadow=true; m.receiveShadow=true; scene.add(m);
      const top=new THREE.Mesh(new THREE.BoxGeometry(w+.04,.09,d+.04),new THREE.MeshStandardMaterial({color:'#d1c2a4'})); top.position.set(x,h+.04,z); top.rotation.y=rot; scene.add(top);
    }
    // Original training layout: a compact, Mirage-inspired tactical arena, not a game asset.
    block(0,-13,34,.8,3,darkMat); block(0,13,34,.8,3,darkMat); block(-17,0,.8,26,3,darkMat); block(17,0,.8,26,3,darkMat);
    block(-7,-7,9,.7,2.7); block(7,-7,9,.7,2.7); block(-7,7,9,.7,2.7); block(7,7,9,.7,2.7);
    block(0,-4,5,.7,2.5,darkMat); block(0,4,5,.7,2.5,darkMat);
    block(-12,0,3,5,2.6); block(12,0,3,5,2.6);
    block(-3,0,2,2,1.4,darkMat); block(3,0,2,2,1.4,darkMat);
    // Boxes and site props
    const crateMat=new THREE.MeshStandardMaterial({color:'#9b7650',roughness:.85});
    [[-10,-9],[-9,-10],[10,9],[9,10],[0,9],[0,-9]].forEach(([x,z])=>{const c=new THREE.Mesh(new THREE.BoxGeometry(1.7,1.5,1.7),crateMat);c.position.set(x,.75,z);c.castShadow=true;c.receiveShadow=true;scene.add(c)});
    // Site markings
    const siteMat=new THREE.MeshStandardMaterial({color:'#d4bb79',transparent:true,opacity:.2});
    const site=new THREE.Mesh(new THREE.PlaneGeometry(7,6),siteMat);site.rotation.x=-Math.PI/2;site.position.set(10,.04,-8);scene.add(site);
    const site2=site.clone();site2.position.set(-10,.04,8);scene.add(site2);
    // Tactical pins
    function pin(x,z,color,label) {
      const g=new THREE.Group(); const stem=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,1.3,10),new THREE.MeshStandardMaterial({color}));stem.position.y=.65;g.add(stem);
      const orb=new THREE.Mesh(new THREE.SphereGeometry(.28,16,12),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.45}));orb.position.y=1.38;g.add(orb);g.position.set(x,0,z);scene.add(g);
    }
    pin(-11,8,'#9c87ff','A'); pin(11,-8,'#53d6a1','B'); pin(0,0,'#ffb45e','MID');
    const resize=()=>{if(!el.isConnected)return;camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight)};
    const ro=new ResizeObserver(resize);ro.observe(el);
    let frame; const animate=()=>{frame=requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)};animate();
    return ()=>{cancelAnimationFrame(frame);ro.disconnect();controls.dispose();renderer.dispose();el.removeChild(renderer.domElement);};
  }, []);
  return <div className="map-canvas" ref={mountRef}><div className="map-hint"><span className="live-dot"></span> INTERACTIVE 3D PREVIEW</div><div className="map-controls"><span>Drag to orbit</span><span>Scroll to zoom</span></div></div>
}

function Viewer() {
  const [map,setMap]=useState('Mirage');
  const [layer,setLayer]=useState('All');
  return <div className="page-content">
    <div className="page-heading"><div><div className="eyebrow">MAP LAB / 3D ENVIRONMENT</div><h1>3D Map Viewer</h1><p>Explore tactical spaces, plan utility and learn map control.</p></div><button className="button secondary"><Plus size={16}/> Create lineup</button></div>
    <div className="viewer-toolbar"><div className="map-select"><Map size={16}/><select value={map} onChange={e=>setMap(e.target.value)}><option>Mirage</option><option>Inferno</option><option>Dust II</option><option>Anubis</option></select><ChevronDown size={14}/></div><div className="layer-tabs">{['All','Smokes','Flashes','Molotovs'].map(x=><button key={x} onClick={()=>setLayer(x)} className={layer===x?'selected':''}>{x}</button>)}</div><button className="icon-button"><Volume2 size={17}/></button></div>
    <div className="viewer-layout"><div className="viewer-main"><MapScene/><div className="map-footer"><div><b>{map} · Training layout</b><small>Original 3D practice environment · Not an official CS2 map extract</small></div><div className="map-legend"><span><i className="dot purple-dot"></i> A site</span><span><i className="dot green-dot"></i> B site</span><span><i className="dot orange-dot"></i> Mid</span></div></div></div>
      <aside className="viewer-side"><div className="side-title">TACTICAL LAYERS <span className="count-pill">{layer==='All'?'12':layer==='Smokes'?'5':layer==='Flashes'?'4':'3'}</span></div><p className="muted small">Choose a lineup category to explore.</p>
        {['A site execute','Mid control smoke','B site retake','Window flash','Connector molotov'].filter((_,i)=>layer==='All'||(layer==='Smokes'&&i<2)||(layer==='Flashes'&&i===3)||(layer==='Molotovs'&&i===4)).map((x,i)=><button className="lineup-row" key={x}><div className="lineup-thumb"><Crosshair size={16}/></div><div><b>{x}</b><small>{['Smoke · 2 steps','Smoke · 3 steps','Smoke · 2 steps','Flash · 1 step','Molotov · 2 steps'][['A site execute','Mid control smoke','B site retake','Window flash','Connector molotov'].indexOf(x)]}</small></div><ArrowUpRight size={15}/></button>)}
        <button className="button primary full" onClick={()=>alert('Lineup editor is part of the next development milestone.')}>Open lineup editor <ArrowUpRight size={15}/></button>
      </aside>
    </div>
  </div>
}

function Training() {
  const [mode,setMode]=useState('Aim');
  const [running,setRunning]=useState(false);
  const [hits,setHits]=useState(0);
  const [misses,setMisses]=useState(0);
  const [target,setTarget]=useState({left:52,top:44});
  const reset=()=>{setHits(0);setMisses(0);setRunning(true);setTarget({left:52,top:44})};
  const shoot=()=>{if(!running)return;setHits(h=>h+1);setTarget({left:12+Math.random()*76,top:12+Math.random()*72})};
  return <div className="page-content"><div className="page-heading"><div><div className="eyebrow">PRACTICE / PERSONAL SKILL</div><h1>Training Center</h1><p>Short, focused drills to build consistency.</p></div><div className="streak"><Flame size={17}/> 4 day streak</div></div>
    <div className="training-tabs">{['Aim','Reaction','Crosshair placement','Spray control'].map(x=><button onClick={()=>setMode(x)} className={mode===x?'selected':''} key={x}>{x}</button>)}</div>
    <div className="training-layout"><div className="training-stage"><div className="stage-top"><span><span className="live-dot"></span> {running?'SESSION LIVE':'PRACTICE RANGE'}</span><span>MODE: {mode.toUpperCase()}</span></div><div className="aim-area" onClick={()=>running&&setMisses(m=>m+1)}>{running?<button className="aim-target" style={{left:`${target.left}%`,top:`${target.top}%`}} onClick={e=>{e.stopPropagation();shoot()}}><span/></button>:<div className="stage-start"><div className="target-icon"><Target size={28}/></div><h2>Ready to train?</h2><p>Click the targets as they appear. Track your accuracy and build consistency.</p><button className="button primary" onClick={reset}><Play size={16} fill="currentColor"/> Start session</button></div>}</div><div className="stage-bottom"><span><Crosshair size={15}/> Click targets to score</span><button onClick={reset}>Restart drill</button></div></div>
      <div className="training-stats"><div className="panel"><div className="panel-heading">SESSION STATS</div><div className="metric"><span>Hits</span><b>{hits}</b></div><div className="metric"><span>Misses</span><b>{misses}</b></div><div className="metric"><span>Accuracy</span><b>{hits+misses?Math.round(hits/(hits+misses)*100):0}%</b></div><div className="metric"><span>Best streak</span><b>{hits}</b></div></div><div className="panel tip-panel"><div className="tip-icon"><Brain size={18}/></div><b>Training tip</b><p>Focus on smooth, controlled movements. Accuracy first, speed second. Consistency beats flicking wildly.</p></div></div>
    </div>
    <div className="section-heading"><div><h2>More ways to practice</h2><p>Pick a drill that matches your next goal.</p></div></div><div className="drill-grid">{[['Prefire routes','Learn common angles and clear them with purpose',Crosshair],['Reaction test','Build faster target recognition',Zap],['Utility practice','Learn lineups and timing',Shield]].map(([t,d,I])=><button className="drill-card" key={t} onClick={()=>setMode(t)}><div className="drill-icon"><I size={19}/></div><b>{t}</b><p>{d}</p><span>Explore drill <ArrowUpRight size={14}/></span></button>)}</div>
  </div>
}

function Academy() {
  const [tab,setTab]=useState('Smokes');
  const items={Smokes:['Mirage window smoke','Mirage connector smoke','Inferno CT smoke','Dust II Xbox smoke'],Flashes:['Mirage A ramp popflash','B short support flash','Inferno banana flash'],Molotovs:['Mirage ticket molotov','Inferno new box molotov'],Guides:['How to take mid control','Basic retake principles','Entry pathing fundamentals']};
  return <div className="page-content"><div className="page-heading"><div><div className="eyebrow">LEARN / UTILITY & KNOWLEDGE</div><h1>Utility Academy</h1><p>Build a reliable playbook, one lineup at a time.</p></div><button className="button secondary"><Plus size={16}/> Submit lineup</button></div>
    <div className="academy-hero"><div><span className="eyebrow">THE FUNDAMENTALS</span><h2>Know your utility.<br/><em>Own the round.</em></h2><p>Browse community-style learning paths for the most played maps.</p><button className="button primary" onClick={()=>setTab('Smokes')}>Explore lineups <ArrowUpRight size={15}/></button></div><div className="academy-art"><div className="art-ring"></div><div className="art-cross"><Crosshair size={70}/></div><span className="art-tag">UTILITY / 001</span></div></div>
    <div className="training-tabs">{Object.keys(items).map(x=><button className={tab===x?'selected':''} onClick={()=>setTab(x)} key={x}>{x}</button>)}</div>
    <div className="academy-list">{items[tab].map((x,i)=><div className="academy-row" key={x}><div className="academy-number">0{i+1}</div><div className="academy-symbol"><Map size={18}/></div><div className="academy-info"><b>{x}</b><small>{tab==='Guides'?'Strategy guide':'Mirage · Standard lineup · Beginner friendly'}</small></div><span className="difficulty">BEGINNER</span><button className="icon-button"><ArrowUpRight size={17}/></button></div>)}</div>
  </div>
}

function Community() {
  return <div className="page-content"><div className="page-heading"><div><div className="eyebrow">CONNECT / FIND YOUR PEOPLE</div><h1>Community</h1><p>Find practice partners and make your next session count.</p></div><button className="button primary"><Plus size={16}/> Create LFG post</button></div>
    <div className="community-banner"><div><span className="eyebrow">LOOKING FOR GROUP</span><h2>Better together.</h2><p>Find players who want to learn, practice and improve.</p></div><Users size={72}/></div>
    <div className="section-heading"><div><h2>Players looking to practice</h2><p>Example community profiles for the prototype.</p></div><button className="button secondary"><Search size={15}/> Filter players</button></div>
    <div className="player-list">{[['Nova','Faceit 4','Mirage utility · chill practice','EU','N'],['Kairo','Faceit 6','Prefire & teamplay','EU','K'],['Moss','Faceit 2','Learning basics · no toxicity','EU','M'],['Vex','Faceit 5','Retakes and executes','EU','V']].map(([n,l,d,r,a])=><div className="player-row" key={n}><div className="avatar player-avatar">{a}</div><div className="player-info"><b>{n} <span className="online-dot"></span></b><small>{d}</small></div><span className="rank-tag">{l}</span><span className="region">{r}</span><button className="button secondary compact">Invite</button></div>)}</div>
  </div>
}

function Overview({setPage}) {
  return <div className="page-content"><div className="welcome-row"><div><div className="eyebrow">WEDNESDAY, NOVEMBER 11, 2026</div><h1>Ready to level up?</h1><p>Your next improvement starts with one good session.</p></div><div className="welcome-actions"><button className="button secondary"><Bell size={16}/></button><button className="button primary" onClick={()=>setPage('Training')}><Play size={15} fill="currentColor"/> Start training</button></div></div>
    <div className="hero-card"><div className="hero-copy"><div className="hero-chip"><Sparkles size={13}/> YOUR TRAINING HUB</div><h2>Small reps.<br/><em>Big impact.</em></h2><p>Make every practice session count. Train your aim, learn your utility and build confidence round by round.</p><button className="button light" onClick={()=>setPage('Training')}>Continue training <ArrowUpRight size={15}/></button></div><div className="hero-graphic"><div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div><div className="hero-crosshair"><Crosshair size={116}/></div><div className="hero-coordinate">47° 29' 12.0" N<br/>19° 02' 31.0" E</div><div className="hero-label">CL / TRAINING DIVISION</div></div></div>
    <div className="stats-grid"><Stat icon={Flame} label="Current streak" value="4 days" note="+1 day this week" color="orange"/><Stat icon={Target} label="Training time" value="2.4 hrs" note="This week" color="purple"/><Stat icon={Gauge} label="Aim accuracy" value="68.5%" note="Personal best: 72%" color="green"/><Stat icon={Trophy} label="Total XP" value="2,450" note="Level 12 · 550 to next" color="blue"/></div>
    <div className="dashboard-grid"><div className="panel continue-panel"><div className="panel-heading-row"><div><h2>Pick up where you left off</h2><p>Recommended for your next session</p></div><button className="text-button" onClick={()=>setPage('Training')}>View all <ArrowUpRight size={14}/></button></div><div className="continue-item"><div className="continue-art"><Crosshair size={28}/></div><div className="continue-info"><span className="eyebrow">AIM TRAINING · 10 MIN</span><b>Precision fundamentals</b><small>Improve target acquisition and control.</small></div><button className="round-play" onClick={()=>setPage('Training')}><Play size={16} fill="currentColor"/></button></div><div className="continue-item"><div className="continue-art map-art"><Map size={28}/></div><div className="continue-info"><span className="eyebrow">MAP KNOWLEDGE · 8 MIN</span><b>Mirage mid control</b><small>Learn the key angles and utility.</small></div><button className="round-play" onClick={()=>setPage('3D Viewer')}><Play size={16} fill="currentColor"/></button></div></div>
      <div className="panel goal-panel"><div className="panel-heading-row"><div><h2>Weekly goal</h2><p>You're building a habit.</p></div><Activity size={18} className="muted"/></div><div className="goal-number">2.4 <small>/ 4 hrs</small></div><div className="progress-track"><div style={{width:'60%'}}></div></div><div className="goal-bottom"><span>60% completed</span><span>1.6 hrs to go</span></div><div className="goal-quote">“Consistency is a skill. Show up, even for 10 minutes.”</div></div>
    </div>
  </div>
}

function App() {
  const [page,setPage]=useState('Overview');
  const [mobileOpen,setMobileOpen]=useState(false);
  return <div className="app-shell"><Sidebar page={page} setPage={setPage} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/><main className="main-area"><header className="topbar"><button className="icon-button mobile-menu" onClick={()=>setMobileOpen(!mobileOpen)}><Menu size={19}/></button><div className="breadcrumb">CLUTCHLAB <span>/</span> <b>{page.toUpperCase()}</b></div><div className="topbar-right"><div className="server-status"><span className="online-dot"></span> ALL SYSTEMS NORMAL</div><button className="icon-button"><CircleHelp size={17}/></button><div className="avatar top-avatar">P</div></div></header>{page==='Overview'?<Overview setPage={setPage}/>:page==='3D Viewer'?<Viewer/>:page==='Training'?<Training/>:page==='Utility Academy'?<Academy/>:<Community/>}<footer className="footer"><span>© 2026 CLUTCHLAB</span><span>BUILT FOR THE GRIND <span className="footer-dot">●</span></span><span>Prototype v0.1</span></footer></main></div>
}

createRoot(document.getElementById('root')).render(<App/>);
