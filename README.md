Status

Mai 14

-   Réussi à déclencher le Oauth et à récupérer un code

Mai 18:

-   Réussi à générer et retourner un token Rainbow
-   Réussi à se connecter à Rainbow

Mai 19

-   Lecture des parametres host, appId du serveur au démarrage de l'application

[TODO]

-   Problème pour charger le SDK avec le default --> supprimer du fichier.

Ensuite

-   Prendre en compte les paramètres de config du serveur coté client
-   Réfactorer le code pour sortie la partie Rainbow de la vue
-   Connection à Rainbow en mode Admin (autre end-point pour créer un compte guest) et récupérer son id/password
-   Sélection d'un fichier et partage sur Rainbow avec le compte du guest

Affichage

-   Affichage de la page de login
-   Affichage de la page principale contenant
    -   Un spinner pendant la connection à Rainbow
    -   La liste des fichiers actuellement partagés ou partagés
    -   Un file uploader

Problématique des users existants qui vont voir des conversations avec des guests + un fichier partager.
--> Voir pour fermer la conversation

PRoblématique de l'usage d'une app tierce --> Quota > 1GO
--> Voir pour réutiliser une app taguée Ucaas et non CpaaS.

Connection en mode guest avec le login/password du lien
Affichage du fichier si existant --> tant que la connection est possible, le fichier est là
