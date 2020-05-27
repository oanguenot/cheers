Status

Mai 14

-   Réussi à déclencher le Oauth et à récupérer un code

Mai 18:

-   Réussi à générer et retourner un token Rainbow
-   Réussi à se connecter à Rainbow

Mai 19

-   Lecture des parametres host, appId du serveur au démarrage de l'application
-   Prendre en compte les paramètres de config du serveur coté client
-   Réfactorer le code pour sortie la partie Rainbow de la vue
-   Affichage de la page de login

Mai 20

-   Creation de la page principale contenant un spinner pendant la phase de chargement + login du SDK
-   Retour à la page de login si echec
-   Affichage du bouton upload si ok

Mai 21

-   Connection à Rainbow en mode Admin (autre end-point pour créer un compte guest) et récupérer son id

Mai 24

-   Affichage du file uploader
-   Utilisation de l'ID pour récupérer le guest, créer la conversation et uploader le fichier sélectionné

Mai 25

-   Découpage de l'écran principal
-   Création d'une bulle pour y stocker la liste des fichiers partagés (afin de les retrouver)
-   Affichage d'une liste vide ou d'une liste des fichiers actuellement partagés

MAi 26

-   Affichage spinner (pas encore centré)

Mai 27

-   Remplacement circular spinner par linear spinner + text affiché en dessous
-   Mise à jour de la liste des fichiers / quota quand un upload est terminé avec succes

[PROBLEMATIQUE]

-   Problème pour charger le SDK avec le default
    -   Solution temporaire: Supprimer du fichier.
-   Problématique des users existants qui vont voir des conversations avec des guests + un fichier partager.
    -   Voir pour fermer la conversation
-   Problématique de l'usage d'une app tierce --> Quota > 1GO
    -   Voir pour réutiliser une app taguée Ucaas et non CpaaS.
-   Problématique de l'expiration du guest
    -   Le compte guest expire-t-il au bout du TTL ?
-   Problématique de la création de guests
    -   Nécessité d'avoir une compagnie "Fuze" sur Sandbox / prod avec un compte admin
-   Problématique de retrouver les fichier partagés
    -   Utilisation d'une bulle et des custom data pour y stocker les id des fichiers
-   Problématique de la limitation de la taille de fichier à envoyé
    -   Limité à 100Mo par fichier (limitation du SDK: à enlever)
-   Problématique du nombre de fichiers.
    -   Est-ce que le getAllSent renvois tous les fichiers partagés ? A vérifier coté SDK

[DEV SERVER]

-   Forcer à supprimer le guest si le téléchargement échoue ou est annulé.

[DEV CLIENT]

-   Affichage de la page principale contenant
    -   affichage du nom du user connecté avec son avatar dans la topbar + bouton logout
    -   Affichage de la progression de l'uplad + nom ficher en cours d'upload
    -   Possibilité d'annuler l'upload
    -   Protéger l'appli pour éviter de voir des upload quand on le fait depuis Rainbow (fileId)
-   Connection avec le lien
    -   Affichage directement de la bonne page + visualisation du fichier
    -   Téléchargement du fichier
    -   Message d'erreur si impossibilité de se connecter (expiration guest)

[Account]

-   Sandbox:
    -   Company: Sharing
    -   Admin: admin@sharing-openrainbow.com / Password_123
-   Prod
    -   Company: ?
    -   Admin: ?
