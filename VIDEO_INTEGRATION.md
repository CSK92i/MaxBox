# Intégration de la Vidéo de Présentation

## 📹 Instructions pour Intégrer votre Vidéo

### Option 1 : Vidéo auto-hébergée (Recommandée pour la performance)

Si vous avez votre vidéo en format MP4 :

1. **Créer un dossier pour les vidéos**
   ```bash
   mkdir /var/www/html/maxbox/videos
   ```

2. **Télécharger votre vidéo**
   - Placer votre fichier `presentation.mp4` dans le dossier `/videos/`
   - Assurez-vous que le format est MP4 pour une meilleure compatibilité

3. **Éditer index.html** (ou toute autre page avec intégration vidéo)

   Remplacer cette section :
   ```html
   <div class="video-container">
       <p class="video-placeholder">Vidéo de présentation - À intégrer prochainement</p>
   </div>
   ```

   Par :
   ```html
   <div class="video-container">
       <video controls>
           <source src="videos/presentation.mp4" type="video/mp4">
           Votre navigateur ne supporte pas la vidéo HTML5.
       </video>
   </div>
   ```

### Option 2 : Embed YouTube (Facile et rapide)

Si votre vidéo est sur YouTube :

1. Prendre l'ID vidéo depuis l'URL
   - URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - ID: `dQw4w9WgXcQ`

2. Remplacer le contenu du video-container :
   ```html
   <div class="video-container">
       <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
               allowfullscreen>
       </iframe>
   </div>
   ```

### Option 3 : Embed Vimeo

Si votre vidéo est sur Vimeo :

1. Prendre l'ID vidéo depuis l'URL
   - URL: `https://vimeo.com/123456789`
   - ID: `123456789`

2. Remplacer le contenu du video-container :
   ```html
   <div class="video-container">
       <iframe src="https://player.vimeo.com/video/123456789"
               allow="autoplay; fullscreen; picture-in-picture"
               allowfullscreen>
       </iframe>
   </div>
   ```

### Option 4 : Plusieurs vidéos (Galerie)

Si vous voulez plusieurs vidéos :

```html
<section class="video-section">
    <div class="container">
        <h3 class="section-title">Découvrez MAXBOX en Vidéo</h3>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
            <!-- Vidéo 1 -->
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/VIDEO_ID_1"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen>
                </iframe>
                <p style="text-align: center; margin-top: 10px; font-weight: 500;">Présentation générale</p>
            </div>

            <!-- Vidéo 2 -->
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/VIDEO_ID_2"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen>
                </iframe>
                <p style="text-align: center; margin-top: 10px; font-weight: 500;">Tour des installations</p>
            </div>

            <!-- Vidéo 3 -->
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/VIDEO_ID_3"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen>
                </iframe>
                <p style="text-align: center; margin-top: 10px; font-weight: 500;">Témoignages clients</p>
            </div>
        </div>
    </div>
</section>
```

## 🎬 Format et Dimensions Recommandés

### Pour vidéo auto-hébergée
- **Format:** MP4 (H.264)
- **Résolution:** 1920×1080 (1080p) ou 1280×720 (720p)
- **Taille fichier:** 50-300 MB selon la durée
- **Durée:** 1-3 minutes idéalement

### Pour YouTube/Vimeo
- Laissez leurs serveurs gérer les dimensions
- Aspect ratio 16:9 pour plein écran

## 📊 Optimisation SEO Vidéo

Ajouter ce schéma structured data dans le `<head>` :

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Présentation MAXBOX - Centre de Self-Stockage",
  "description": "Découvrez nos installations modernes et sécurisées",
  "thumbnailUrl": "https://maxbox.fr/images/video-thumb.jpg",
  "uploadDate": "2026-03-19T10:30:00Z",
  "duration": "PT2M30S",
  "contentUrl": "https://maxbox.fr/videos/presentation.mp4",
  "embedUrl": "https://maxbox.fr/#video-section"
}
</script>
```

## 💾 Hébergement de Vidéo

### Avantages auto-hébergement
✅ Meilleur contrôle
✅ SEO amélioré
✅ Pas de branding tiers
✅ Vitesse potentiellement meilleure
❌ Coûte plus de bande passante
❌ Nécessite de l'espace serveur

### Avantages YouTube/Vimeo
✅ Bande passante illimitée
✅ Optimisé automatiquement
✅ Statistiques détaillées
✅ Facile de partager
❌ Moins de contrôle SEO
❌ Branding/pubs YouTube

## 🚀 Performance

Pour une vidéo auto-hébergée, optimisez le fichier :

```bash
# Compresser une vidéo avec ffmpeg
ffmpeg -i video-original.mp4 -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k presentation.mp4
```

## ✅ Checklist Intégration

- [ ] Vidéo prête au format approprié
- [ ] Fichier stocké au bon endroit
- [ ] HTML mis à jour avec le bon chemin/ID
- [ ] Tests sur desktop, tablette, mobile
- [ ] Tests du lecteur vidéo
- [ ] Vérification de la durée de chargement
- [ ] SEO structured data ajouté

---

Pour toute question, consultez le README.md ou contactez location@groupe-hgi.com
