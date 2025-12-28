# Créer un générateur de nombres aléatoires cryptographiques
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()

# Définir la taille (64 octets est recommandé pour une sécurité maximale)
$bytes = New-Object Byte[] 64

# Remplir le tableau avec des octets aléatoires
$rng.GetBytes($bytes)

# Convertir en chaîne Base64 pour l'utiliser dans votre fichier .env ou config
[Convert]::ToBase64String($bytes)