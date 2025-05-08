#!/bin/sh

set -e

host="$1"
port="$2"
shift 2

echo "⏳ Attente de $host:$port..."

until nc -z "$host" "$port"; do
  echo "🚧 $host:$port non dispo, nouvelle tentative dans 2s..."
  sleep 2
done

echo "✅ $host:$port est prêt. Lancement de l'application."
exec "$@"

