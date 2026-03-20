# 🚀 Guide de Déploiement - MAXBOX

## Prerequisites

Avant de déployer, assurez-vous d'avoir :
- Accès SSH au serveur
- Domaine maxbox.fr configuré et pointant vers le serveur
- PHP 7.2+ installé
- Apache avec mod_rewrite activé
- Certificat SSL/TLS (HTTPS)

## 📋 Étapes de Déploiement

### 1. Préparation du Serveur

```bash
# Se connecter au serveur
ssh user@maxbox.fr

# Créer le répertoire du site
mkdir -p /var/www/maxbox.fr
cd /var/www/maxbox.fr

# Configurer les permissions
chmod 755 .
```

### 2. Télécharger les Fichiers

```bash
# Option A : Git (recommandé)
git clone https://your-repo.git .

# Option B : SFTP/FTP
# Télécharger tous les fichiers via votre client FTP
```

### 3. Configurer les Permissions

```bash
# Permissions des fichiers
find . -type f -exec chmod 644 {} \;

# Permissions des dossiers
find . -type d -exec chmod 755 {} \;

# Permissions spéciales pour les répertoires écriture/log
chmod 777 api/
chmod 777 logs/
```

### 4. Configurer Apache

#### A. Créer un Virtual Host

Créer `/etc/apache2/sites-available/maxbox.fr.conf` :

```apache
<VirtualHost *:80>
    ServerName maxbox.fr
    ServerAlias www.maxbox.fr
    DocumentRoot /var/www/maxbox.fr

    # Redirection HTTPS
    Redirect permanent / https://maxbox.fr/

    ErrorLog ${APACHE_LOG_DIR}/maxbox-error.log
    CustomLog ${APACHE_LOG_DIR}/maxbox-access.log combined
</VirtualHost>

<VirtualHost *:443>
    ServerName maxbox.fr
    ServerAlias www.maxbox.fr
    DocumentRoot /var/www/maxbox.fr

    # SSL Configuration
    SSLEngine on
    SSLCertificateFile /etc/ssl/certs/maxbox.fr.crt
    SSLCertificateKeyFile /etc/ssl/private/maxbox.fr.key
    SSLCertificateChainFile /etc/ssl/certs/maxbox.fr.ca-bundle

    # Security Headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "no-referrer-when-downgrade"

    # Enable mod_rewrite
    <Directory /var/www/maxbox.fr>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/maxbox-error.log
    CustomLog ${APACHE_LOG_DIR}/maxbox-access.log combined
</VirtualHost>
```

#### B. Activer le Virtual Host

```bash
# Activer le site
sudo a2ensite maxbox.fr.conf

# Activer les modules nécessaires
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod ssl
sudo a2enmod deflate
sudo a2enmod expires

# Tester la configuration
sudo apache2ctl configtest

# Redémarrer Apache
sudo systemctl restart apache2
```

### 5. Configurer SSL/TLS

#### Avec Let's Encrypt (Gratuit et automatisé)

```bash
# Installer Certbot
sudo apt-get install certbot python3-certbot-apache

# Générer le certificat
sudo certbot certonly --webroot -w /var/www/maxbox.fr -d maxbox.fr -d www.maxbox.fr

# Le certificat sera dans /etc/letsencrypt/live/maxbox.fr/
```

### 6. Configurer PHP et Email

#### Éditer api/contact.php

```bash
sudo nano /var/www/maxbox.fr/api/contact.php
```

Vérifier/modifier :
- Email destinataire : `location@groupe-hgi.com`
- Configuration SMTP si nécessaire

#### Configurer SMTP (si nécessaire)

Pour un serveur avec mail configure :
```bash
# Vérifier que mail() fonctionne
echo "<?php echo (int)function_exists('mail'); ?>" > /var/www/maxbox.fr/test-mail.php

# Supprimer le fichier de test après vérification
rm /var/www/maxbox.fr/test-mail.php
```

### 7. Vérifications Finales

#### A. Vérifier la Structure des Fichiers

```bash
cd /var/www/maxbox.fr

# Vérifier les fichiers critiques
ls -la | grep -E "index|contact|css|js"
```

#### B. Tester HTTPS

```bash
curl -I https://maxbox.fr
# Doit retourner 200 OK
```

#### C. Tester les Pages

```bash
curl -I https://maxbox.fr/
curl -I https://maxbox.fr/about.html
curl -I https://maxbox.fr/services.html
curl -I https://maxbox.fr/pricing.html
curl -I https://maxbox.fr/contact.html
```

#### D. Tester la Compression GZIP

```bash
curl -I -H "Accept-Encoding: gzip" https://maxbox.fr/
# Doit voir "Content-Encoding: gzip"
```

#### E. Tester le Formulaire

1. Aller sur https://maxbox.fr/contact.html
2. Remplir le formulaire
3. Vérifier que l'email est reçu

### 8. Sécurité - Configurations Supplémentaires

#### A. Créer des Logs

```bash
mkdir -p /var/www/maxbox.fr/logs
chmod 755 /var/www/maxbox.fr/logs
```

#### B. Configurer Firewall

```bash
# Avec UFW
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

#### C. Surveiller les Logs

```bash
# Erreurs Apache
tail -f /var/log/apache2/maxbox-error.log

# Accès
tail -f /var/log/apache2/maxbox-access.log

# Submissions du formulaire
tail -f /var/www/maxbox.fr/logs/contact_submissions.log
```

### 9. Performance et Optimisation

#### A. Minifier CSS/JS

```bash
# Installer nodejs et npm
sudo apt-get install nodejs npm

# Installer minificateurs
npm install -g csso-cli terser

# Minifier
csso css/style.css -o css/style.min.css
terser js/main.js -o js/main.min.js
```

#### B. Optimiser les Images

```bash
# Installer ImageMagick
sudo apt-get install imagemagick

# Convertir en WebP
convert image.jpg -quality 80 image.webp
```

#### C. Ajouter un CDN (optionnel)

Utiliser CloudFlare ou Bunny CDN pour :
- Mise en cache globale
- Compression automatique
- Protection DDoS

### 10. Maintenance Régulière

#### A. Renouvellement SSL

```bash
# Automatique avec Let's Encrypt (cron job)
# Vérifier tous les 60 jours
sudo certbot renew --quiet
```

#### B. Backups

```bash
# Créer une sauvegarde
tar -czf maxbox-backup-$(date +%Y%m%d).tar.gz /var/www/maxbox.fr/

# Sauvegarde automatique quotidienne (crontab)
0 2 * * * tar -czf /backups/maxbox-$(date +\%Y\%m\%d).tar.gz /var/www/maxbox.fr/
```

#### C. Monitoring

```bash
# Installer Prometheus/Grafana pour monitoring
# Ou utiliser des services cloud (Datadog, New Relic, etc.)
```

## 🔐 Checklist Sécurité

- [ ] HTTPS activé et certificat valide
- [ ] .htaccess correctement configuré
- [ ] Fichiers sensibles protégés (api/, logs/)
- [ ] Permissions 644 pour fichiers, 755 pour dossiers
- [ ] Email API sécurisé (validation serveur)
- [ ] CORS configuré correctement
- [ ] Rate limiting sur formulaire (optionnel)
- [ ] Headers de sécurité activés
- [ ] Firewall configuré

## 🚨 Troubleshooting

### Les styles ne s'appliquent pas

```bash
# Vérifier MIME types Apache
sudo a2enmod mimes

# Redémarrer Apache
sudo systemctl restart apache2
```

### Erreur 404 sur pages HTML

```bash
# Vérifier mod_rewrite
apache2ctl -M | grep rewrite

# Activer si absent
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### Email ne s'envoie pas

```bash
# Tester mail()
echo "<?php mail('test@test.com', 'Test', 'Test'); ?>" > test.php

# Vérifier les logs
tail /var/log/mail.log
```

### Certificat SSL n'est pas reconnu

```bash
# Vérifier la chaîne complète
openssl x509 -in /etc/letsencrypt/live/maxbox.fr/cert.pem -text -noout

# Renouveler si expiré
sudo certbot renew --force-renewal
```

## 📞 Support

Pour des questions ou problèmes :
- Email: location@groupe-hgi.com
- Téléphone: 0756833089

---

**Dernière mise à jour : 19 Mars 2026**
