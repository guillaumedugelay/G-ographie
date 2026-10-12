// Connexion à deux joueurs, partagée par tous les mini-jeux.
// Firebase Realtime Database (projet mk8-random), connexion anonyme, données sous « duel/ ».
// Étapes : salon (appariement automatique) → salle (prénoms + « Prêt ») → partie (messages du jeu).
import{initializeApp}from"https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import{getAuth,signInAnonymously}from"https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import{getDatabase,ref,push,set,onValue,onChildAdded,onDisconnect,serverTimestamp}from"https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

const FIREBASE_CONFIG={apiKey:"AIzaSyAe3C_t4mhxCom1MuzRmmJM3coRcS-y5GM",authDomain:"mk8-random.firebaseapp.com",databaseURL:"https://mk8-random-default-rtdb.europe-west1.firebasedatabase.app",projectId:"mk8-random",storageBucket:"mk8-random.firebasestorage.app",messagingSenderId:"955981216553",appId:"1:955981216553:web:e9135d716291da54d3d538"};

export const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// key : identifiant du jeu (un salon par jeu). onChange : appelé à chaque changement d'état.
// onMessage(m) : messages du jeu envoyés par l'adversaire. onStart() : appelé chez l'hôte quand les deux sont prêts.
export function createDuo({key,onChange,onMessage,onStart}){
  const myId=Math.random().toString(36).slice(2,10);
  let fdb=null,srvOff=0,topic=null,lobbySrc=null,gameSrc=null,waiters={},candidate=null,candSince=0;
  let helloTimer=null,waitTimer=null,pairTimer=null;
  let savedName="";try{savedName=localStorage.getItem("duo-name")||""}catch(e){}
  const duo={
    id:myId,
    phase:"boot",          // boot | lobby | room | play | closed | error
    status:"Connexion…",
    isHost:false,
    me:{name:savedName,ready:false},
    opp:{name:"",ready:false},
    forfeit:null,          // null | "me" | "opp"
    lobbyCount:1,
  };
  const changed=()=>onChange&&onChange(duo);
  const setStatus=t=>{duo.status=t;changed()};
  function netError(e){
    console.error(e);
    const msg=String((e&&(e.code||e.message))||e);
    setStatus(/permission/i.test(msg)?"Accès refusé par la base Firebase (règles « duel » à ajouter)":"Erreur : "+msg);
  }
  const gameRef=()=>ref(fdb,"duel/games/"+topic);
  // Les messages sont envoyés en texte JSON : Firebase ne les transforme pas (objets vides, tableaux).
  const raw=m=>push(gameRef(),{f:myId,j:JSON.stringify(m)}).catch(netError);
  duo.send=m=>raw({t:"game",m});

  // --- Salon : les joueurs en attente s'annoncent, ils sont appariés par ordre d'identifiant ---
  const live=()=>{const now=Date.now()-srvOff;return Object.keys(waiters).filter(id=>now-waiters[id]<13000).concat(myId).sort()};
  function lobbyStart(){
    clearInterval(waitTimer);clearInterval(pairTimer);clearInterval(helloTimer);
    if(gameSrc){gameSrc();gameSrc=null}
    if(lobbySrc){lobbySrc();lobbySrc=null}
    waiters={};candidate=null;topic=null;duo.phase="lobby";duo.lobbyCount=1;
    const lobby="duel/lobby/"+key;
    const me=ref(fdb,lobby+"/"+myId);
    onDisconnect(me).remove();
    lobbySrc=onValue(ref(fdb,lobby),snap=>{
      const v=snap.val()||{};waiters={};
      Object.keys(v).forEach(id=>{if(id!==myId&&v[id]&&v[id].t)waiters[id]=v[id].t});
    },netError);
    const announce=()=>set(me,{t:serverTimestamp()}).catch(netError);
    announce();waitTimer=setInterval(announce,5000);
    pairTimer=setInterval(tryPair,1000);
    setStatus("Recherche d'un adversaire…");
  }
  function tryPair(){
    const l=live(),i=l.indexOf(myId),pid=l[i^1];
    const n=Math.min(l.length,2);
    if(n!==duo.lobbyCount){duo.lobbyCount=n;changed()}
    if(!pid){candidate=null;return}
    if(pid!==candidate){candidate=pid;candSince=Date.now()}
    if(Date.now()-candSince>=2500)pairWith(pid);
  }
  function pairWith(pid){
    clearInterval(waitTimer);clearInterval(pairTimer);
    if(lobbySrc){lobbySrc();lobbySrc=null}
    duo.isHost=myId<pid;
    topic=key+"-"+[myId,pid].sort().join("-");
    setStatus("Adversaire trouvé, connexion…");
    const t0=Date.now();
    gameSrc=onChildAdded(gameRef(),snap=>{const v=snap.val();if(v&&v.f!==myId){try{got(JSON.parse(v.j))}catch(e){console.error(e)}}},netError);
    const hello=()=>{
      if(duo.phase!=="lobby")return;
      if(Date.now()-t0>12000){lobbyStart();return}
      raw({t:"hello"});
    };
    hello();helloTimer=setInterval(hello,2500);
  }
  function got(m){
    if(m.t==="hello"){
      if(duo.phase==="lobby"){
        clearInterval(helloTimer);raw({t:"hello"});
        duo.phase="room";duo.lobbyCount=2;duo.status="Connecté";
        if(duo.me.ready)raw({t:"ready",name:duo.me.name,r:true});
        changed();
      }
      return;
    }
    if(m.t==="bye"){duo.phase="closed";changed();return}
    if(m.t==="ready"){
      duo.opp.name=m.name||duo.opp.name;duo.opp.ready=!!m.r;
      changed();checkStart();return;
    }
    if(m.t==="forfeit"){duo.forfeit="opp";changed();return}
    if(m.t==="game"){
      // Le premier message de jeu fait passer l'invité en partie
      if(duo.phase==="room"&&m.m&&m.m.start)enterPlay();
      onMessage&&onMessage(m.m);changed();
    }
  }
  function enterPlay(){duo.phase="play";duo.forfeit=null;duo.me.ready=false;duo.opp.ready=false}
  function checkStart(){
    if(duo.isHost&&duo.phase==="room"&&duo.me.ready&&duo.opp.ready){
      enterPlay();
      onStart&&onStart();   // l'hôte crée la partie et l'envoie avec {start:true}
      changed();
    }
  }
  duo.setName=n=>{duo.me.name=n;try{localStorage.setItem("duo-name",n)}catch(e){}};
  duo.setReady=r=>{
    if(!duo.me.name.trim())return;
    duo.me.ready=r;raw({t:"ready",name:duo.me.name.trim(),r});changed();checkStart();
  };
  duo.giveUp=()=>{if(duo.phase!=="play"||duo.forfeit)return;duo.forfeit="me";raw({t:"forfeit"});changed()};
  // Après une partie : retour à la salle, chacun doit cliquer « Prêt » à nouveau
  duo.toRoom=()=>{duo.phase="room";duo.forfeit=null;duo.me.ready=false;raw({t:"ready",name:duo.me.name,r:false});changed()};
  duo.oppName=()=>duo.opp.name||"Adversaire";
  addEventListener("pagehide",()=>{if(topic&&duo.phase!=="lobby")raw({t:"bye"})});

  duo.start=async()=>{
    try{
      const app=initializeApp(FIREBASE_CONFIG,"duo-"+key);
      fdb=getDatabase(app);
      await signInAnonymously(getAuth(app));
      onValue(ref(fdb,".info/serverTimeOffset"),snap=>{srvOff=-(snap.val()||0)});
    }catch(e){
      console.error(e);duo.phase="error";
      setStatus("Connexion au serveur impossible ("+((e&&(e.code||e.message))||"erreur")+").");
      return;
    }
    lobbyStart();
  };
  return duo;
}

// Écrans communs : salon d'attente, salle (prénom + Prêt), adversaire parti.
// Renvoie le HTML, ou null si la partie est en cours (le jeu dessine lui-même).
export function commonScreen(duo,{intro}){
  if(duo.phase==="boot"||duo.phase==="error")
    return `<div class="panel"><p>${esc(duo.status)}</p>${duo.phase==="error"?'<div class="row"><button onclick="location.reload()">Réessayer</button></div>':""}</div>`;
  if(duo.phase==="closed")
    return `<div class="panel"><h2>Ton adversaire a quitté la partie</h2><div class="row"><button onclick="location.reload()">Nouvelle partie</button></div></div>`;
  if(duo.phase==="lobby")
    return `<div class="panel"><div class="big pulse">${duo.lobbyCount} / 2</div>
      <h2 style="text-align:center">${duo.lobbyCount>1?"Adversaire trouvé !":"En attente d'un adversaire…"}</h2>
      <p class="mute" style="text-align:center"><span class="status">${esc(duo.status)}</span>${intro}</p></div>`;
  if(duo.phase==="room"){
    const o=duo.opp;
    return `<div class="panel">
      <h2>Avant de commencer</h2>
      <label for="nm">Ton prénom</label>
      <input type="text" id="nm" maxlength="20" value="${esc(duo.me.name)}" autocomplete="off"${duo.me.ready?" disabled":""}>
      <div class="row"><button id="ready">${duo.me.ready?"Pas encore prêt":"Prêt"}</button></div>
      <p class="mute">${o.ready?`<b>${esc(o.name)}</b> est prêt.`:o.name?`En attente que <b>${esc(o.name)}</b> soit prêt…`:"Ton adversaire choisit son prénom…"}</p>
      ${duo.me.ready&&!o.ready?'<p class="mute">Tu es prêt. La partie démarre dès que ton adversaire l\'est aussi.</p>':""}
    </div>`;
  }
  return null;
}
// Branche les boutons des écrans communs (à appeler après avoir injecté le HTML).
export function bindCommon(duo,root){
  const nm=root.querySelector("#nm"),rd=root.querySelector("#ready");
  if(nm)nm.addEventListener("input",()=>duo.setName(nm.value));
  if(rd)rd.onclick=()=>{
    if(!duo.me.ready&&!duo.me.name.trim()){nm&&nm.focus();return}
    duo.setReady(!duo.me.ready);
  };
}
