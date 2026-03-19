var tousLesEtudiants = [];
var idASupprimer     = null;

var regles = {
  'f-nom':       { fn: function(v){ return v.length >= 2; },                         msg: 'Minimum 2 caractères.' },
  'f-prenom':    { fn: function(v){ return v.length >= 2; },                         msg: 'Minimum 2 caractères.' },
  'f-email':     { fn: function(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, msg: 'Email invalide.' },
  'f-telephone': { fn: function(v){ return /^[\+]?[\d\s\-\(\)]{8,20}$/.test(v); },  msg: 'Numéro invalide.' },
  'f-filiere':   { fn: function(v){ return v !== ''; },                              msg: 'Sélectionnez une filière.' }
};

function esc(s) {
  var d = document.createElement('div');
  d.appendChild(document.createTextNode(String(s)));
  return d.innerHTML;
}

function flash(msg, type) {
  var el = document.getElementById('flash');
  if (!el) return;
  el.textContent   = msg;
  el.className     = 'flash ' + type;
  el.style.display = 'block';
  setTimeout(function(){ el.style.display = 'none'; }, 4000);
}

function chargerEtudiants() {
  fetch('php/afficher.php')
    .then(function(r){ return r.json(); })
    .then(function(data){
      tousLesEtudiants = data;
      afficherTableau(data);
    })
    .catch(function(){
      flash('Impossible de charger les étudiants.', 'erreur');
    });
}

function afficherTableau(etudiants) {
  var corps    = document.getElementById('corps-tableau');
  var vide     = document.getElementById('msg-vide');
  var tableau  = document.getElementById('tableau');
  var compteur = document.getElementById('compteur');
  var pluriel  = document.getElementById('pluriel');

  if (!corps) return;

  if (compteur) compteur.textContent = tousLesEtudiants.length;
  if (pluriel)  pluriel.textContent  = tousLesEtudiants.length > 1 ? 's' : '';

  if (etudiants.length === 0) {
    vide.style.display    = 'block';
    tableau.style.display = 'none';
    return;
  }

  vide.style.display    = 'none';
  tableau.style.display = 'block';
  corps.innerHTML = '';

  etudiants.forEach(function(e, i) {
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td class="td-num">' + (i + 1) + '</td>' +
      '<td class="td-nom">' + esc(e.nom) + ' ' + esc(e.prenom) + '</td>' +
      '<td class="td-email">' + esc(e.email) + '</td>' +
      '<td class="td-tel">' + esc(e.telephone) + '</td>' +
      '<td><span class="td-badge">' + esc(e.filiere) + '</span></td>' +
      '<td class="td-actions">' +
        '<button class="btn btn--modifier" onclick="ouvrirModification(' + e.id + ')">✏️ Modifier</button>' +
        '<button class="btn btn--danger" onclick="demanderSuppression(' + e.id + ')">🗑️ Supprimer</button>' +
      '</td>';
    corps.appendChild(tr);
  });
}

function filtrer(terme) {
  terme = terme.toLowerCase().trim();
  if (!terme) { afficherTableau(tousLesEtudiants); return; }
  var res = tousLesEtudiants.filter(function(e) {
    return (e.nom + ' ' + e.prenom).toLowerCase().includes(terme) ||
            e.filiere.toLowerCase().includes(terme);
  });
  afficherTableau(res);
}

function validerChamp(id) {
  var champ  = document.getElementById(id);
  var erreur = document.getElementById('err-' + id.replace('f-', ''));
  if (!champ || !regles[id]) return true;
  var valeur = champ.value.trim();
  if (!regles[id].fn(valeur)) {
    champ.classList.add('erreur');
    champ.classList.remove('valide');
    if (erreur) { erreur.textContent = regles[id].msg; erreur.classList.add('visible'); }
    return false;
  } else {
    champ.classList.remove('erreur');
    champ.classList.add('valide');
    if (erreur) erreur.classList.remove('visible');
    return true;
  }
}

function validerTout() {
  var ids = ['f-nom', 'f-prenom', 'f-email', 'f-telephone', 'f-filiere'];
  return ids.map(validerChamp).every(function(v){ return v; });
}

function sauvegarder() {
  if (!validerTout()) return;

  var donnees = {
    nom:       document.getElementById('f-nom').value.trim(),
    prenom:    document.getElementById('f-prenom').value.trim(),
    email:     document.getElementById('f-email').value.trim(),
    telephone: document.getElementById('f-telephone').value.trim(),
    filiere:   document.getElementById('f-filiere').value
  };

  fetch('php/ajouter.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(donnees)
  })
  .then(function(r){ return r.json(); })
  .then(function(data) {
    if (data.succes) {
      localStorage.setItem('_flash', '✅ Étudiant ajouté avec succès !');
      window.location.href = 'etudiants.html';
    } else {
      var msg = document.getElementById('message-retour');
      if (msg) {
        msg.textContent = data.erreur || 'Une erreur est survenue.';
        msg.className   = 'message-retour erreur';
      }
    }
  })
  .catch(function(){
    var msg = document.getElementById('message-retour');
    if (msg) {
      msg.textContent = 'Erreur de connexion au serveur.';
      msg.className   = 'message-retour erreur';
    }
  });
}

function ouvrirModification(id) {
  var e = tousLesEtudiants.find(function(x){ return x.id == id; });
  if (!e) return;
  localStorage.setItem('_modifier', JSON.stringify(e));
  window.location.href = 'ajouter.html?mode=modifier';
}

function demanderSuppression(id) {
  idASupprimer = id;
  document.getElementById('modal-suppr').style.display = 'flex';
}

function fermerModalSuppr() {
  idASupprimer = null;
  document.getElementById('modal-suppr').style.display = 'none';
}

function confirmerSuppression() {
  if (!idASupprimer) return;
  fetch('php/supprimer.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: idASupprimer })
  })
  .then(function(r){ return r.json(); })
  .then(function(data) {
    fermerModalSuppr();
    if (data.succes) {
      chargerEtudiants();
      flash('🗑️ Étudiant supprimé avec succès.', 'succes');
    } else {
      flash('Erreur lors de la suppression.', 'erreur');
    }
  });
}

function chargerFlash() {
  var msg = localStorage.getItem('_flash');
  if (msg) {
    flash(msg, 'succes');
    localStorage.removeItem('_flash');
  }
}

function chargerModeModifier() {
  var params = new URLSearchParams(window.location.search);
  if (params.get('mode') !== 'modifier') return;

  var data = localStorage.getItem('_modifier');
  if (!data) return;

  var e = JSON.parse(data);
  localStorage.removeItem('_modifier');

  document.getElementById('f-nom').value       = e.nom;
  document.getElementById('f-prenom').value    = e.prenom;
  document.getElementById('f-email').value     = e.email;
  document.getElementById('f-telephone').value = e.telephone;
  document.getElementById('f-filiere').value   = e.filiere;

  var titre = document.getElementById('form-titre');
  if (titre) titre.textContent = 'Modifier l\'étudiant';

  var btnSave = document.querySelector('.btn--or[onclick="sauvegarder()"]');
  if (btnSave) btnSave.textContent = 'Mettre à jour';

  window.sauvegarder = function() {
    if (!validerTout()) return;
    var donnees = {
      id:        e.id,
      nom:       document.getElementById('f-nom').value.trim(),
      prenom:    document.getElementById('f-prenom').value.trim(),
      email:     document.getElementById('f-email').value.trim(),
      telephone: document.getElementById('f-telephone').value.trim(),
      filiere:   document.getElementById('f-filiere').value
    };
    fetch('php/modifier.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donnees)
    })
    .then(function(r){ return r.json(); })
    .then(function(data) {
      if (data.succes) {
        localStorage.setItem('_flash', '✏️ Étudiant mis à jour avec succès !');
        window.location.href = 'etudiants.html';
      } else {
        var msg = document.getElementById('message-retour');
        if (msg) {
          msg.textContent = data.erreur || 'Erreur lors de la mise à jour.';
          msg.className   = 'message-retour erreur';
        }
      }
    });
  };
}

window.onload = function() {
  var recherche = document.getElementById('recherche');
  if (recherche) {
    chargerEtudiants();
    chargerFlash();
    recherche.addEventListener('input', function(){ filtrer(this.value); });
    document.getElementById('modal-suppr').addEventListener('click', function(e){
      if (e.target === this) fermerModalSuppr();
    });
  }

  var form = document.getElementById('form-etudiant');
  if (form) {
    chargerModeModifier();
    ['f-nom','f-prenom','f-email','f-telephone','f-filiere'].forEach(function(id){
      var champ = document.getElementById(id);
      if (!champ) return;
      champ.addEventListener('blur', function(){ validerChamp(id); });
      champ.addEventListener('input', function(){
        if (this.classList.contains('erreur')) validerChamp(id);
      });
    });
  }
};
