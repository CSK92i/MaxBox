# MAXBOX - Site Web Self-Stockage

Site web moderne et sécurisé pour le centre de self-stockage MAXBOX.

## 📋 Structure du Projet

```
maxbox/
├── index.html              # Page d'accueil
├── about.html             # À propos
├── services.html          # Services
├── pricing.html           # Tarifs
├── contact.html           # Formulaire de contact
├── sitemap.xml            # Sitemap pour SEO
├── robots.txt             # Instructions web crawlers
├── .htaccess              # Configuration Apache
├── api/
│   └── contact.php        # Gestion formulaire contact
├── css/
│   ├── style.css          # Styles principaux
│   ├── responsive.css     # Styles responsifs
│   ├── contact.css        # Styles page contact
│   └── pages.css          # Styles pages internes
└── js/
    ├── main.js            # Scripts généraux
    ├── phone-protect.js   # Protection téléphone
    └── form.js            # Gestion formulaire
```

## 🚀 Mise en Place

### Prérequis
- Serveur web Apache (avec mod_rewrite activé)
- PHP 7.2+ (pour traiter le formulaire)
- Domaine maxbox.fr pointant vers le serveur web

### Installation

1. **Télécharger/Cloner les fichiers**
   ```bash
   cd /var/www/html/maxbox
   # Copier tous les fichiers du projet
   ```

2. **Configurer les permissions**
   ```bash
   chmod 755 -R .
   chmod 644 *.html *.php *.txt *.xml
   chmod 755 api/
   ```

3. **Configurer le serveur Apache**
   - S'assurer que `mod_rewrite` est activé
   - S'assurer que `mod_deflate` et `mod_expires` sont activés
   - Copier `.htaccess` à la racine du site

4. **Configurer l'email**
   - Éditer `api/contact.php` ligne 44
   - Remplacer `location@groupe-hgi.com` par l'adresse email souhaitée
   - S'assurer que le serveur peut envoyer des emails (SMTP configuré)

## 📧 Formulaire de Contact

Le formulaire inclut :
- Champs : Prénom, Nom, Société, Email, Téléphone, Message
- Captcha mathématique simple
- Validation en temps réel
- Envoi d'emails de confirmation
- Protection contre le spam

**Configuration d'envoi des emails :**

Éditer `api/contact.php` et modifier :
```php
$to = 'location@groupe-hgi.com';  // Email destinataire
```

## 🔒 Protection du Téléphone

Le numéro de téléphone est protégé contre les harvesting bots :
- Affichage initial : "Afficher le téléphone"
- Révélation sur clic pour l'utilisateur
- Obfuscation côté frontend
- Tracking des révélations (analytics optionnel)

## 📹 Intégration Vidéo

Pour intégrer votre vidéo de présentation :

**Option 1 : Vidéo auto-hébergée**
```html
<!-- Remplacer le contenu de video-container dans index.html -->
<video controls style="width: 100%; height: auto;">
    <source src="videos/presentation.mp4" type="video/mp4">
    Votre navigateur ne supporte pas la vidéo.
</video>
```

**Option 2 : YouTube/Vimeo**
```html
<iframe width="100%" height="600" src="https://www.youtube.com/embed/VIDEOID"
    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen></iframe>
```

## 🔍 Optimisation SEO

### Métadonnées
- Balises title et meta description uniques par page
- Open Graph pour réseaux sociaux
- Canonical URLs
- Schema.org markup (à ajouter)

### Performance
- Compression GZIP activée
- Cache navigateur configuré
- Images optimisées recommandées
- Minification CSS/JS recommandée

### Structure
- Sitemap XML inclus
- robots.txt configuré
- Heading hierarchy correcte
- URLs lisibles

### À ajouter pour encore mieux
```html
<!-- Dans le <head> -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "MAXBOX",
  "image": "https://maxbox.fr/logo.png",
  "description": "Centre de self-stockage moderne et sécurisé",
  "telephone": "0756833089",
  "email": "location@groupe-hgi.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Adresse à remplir",
    "addressLocality": "Ville",
    "addressRegion": "Région",
    "postalCode": "Code postal",
    "addressCountry": "FR"
  }
}
</script>
```

## 🎨 Personnalisation des Couleurs

Éditer `css/style.css` dans la section `:root` :
```css
:root {
    --primary: #0f4c9f;           /* Bleu principal */
    --primary-dark: #0a3a7a;      /* Bleu foncé */
    --secondary: #00bcd4;         /* Cyan/Turquoise */
    --accent: #ff6b35;            /* Orange (non utilisé actuellement) */
    /* ... */
}
```

## 📱 Responsive Design

Le site est fully responsive :
- Desktop : 1200px+
- Tablet : 768px - 1200px
- Mobile : < 768px
- Extra small : < 480px

Testé sur Chrome, Firefox, Safari, Edge

## ♿ Accessibilité

- Navigation au clavier
- Labels pour tous les inputs
- Contraste de couleurs suffisant
- Hiérarchie de headings
- Images avec alt text

## 🔐 Sécurité

- HTTPS forcé via .htaccess
- En-têtes de sécurité (X-Frame-Options, CSP-like)
- Validation côté serveur du formulaire
- Protection MIME-sniffing
- Répertoires non listés

## 📊 Analyser le Trafic

Ajouter Google Analytics dans `js/main.js` :
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🐛 Troubleshooting

### Le formulaire ne s'envoie pas
1. Vérifier que PHP est activé
2. Vérifier la configuration SMTP du serveur
3. Vérifier les logs Apache : `/var/log/apache2/error.log`

### Images ne s'affichent pas
1. Vérifier les chemins des images
2. Vérifier les permissions des fichiers (644)

### Styles ne s'appliquent pas
1. Vérifier les chemins CSS
2. Vider le cache navigateur (Ctrl+Shift+Del)
3. Vérifier la compression GZIP

### Téléphone ne s'affiche pas au clic
1. Vérifier que `js/phone-protect.js` est chargé
2. Ouvrir la console (F12) pour voir les erreurs

## 📞 Support

Pour les questions techniques, consulter les fichiers de configuration :
- `api/contact.php` pour les emails
- `.htaccess` pour la configuration serveur
- `js/form.js` pour la validation du formulaire

## 📝 Licence

© 2026 MAXBOX. Tous droits réservés.

---

**Créé avec ❤️ pour MAXBOX**
