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

[DEV SERVER]

-   Forcer à supprimer le guest si le téléchargement échoue ou est annulé.

[DEV CLIENT]

-   Sélection d'un fichier et partage sur Rainbow avec le compte du guest
-   Affichage de la page principale contenant
    -   La liste des fichiers actuellement partagés ou partagés
    -   Un file uploader
    -   affichage du nom du user connecté avec son avatar dans la topbar + bouton logout
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
