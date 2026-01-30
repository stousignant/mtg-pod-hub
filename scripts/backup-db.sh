#!/usr/bin/env bash
set -euo pipefail

BUCKET_NAME="backups"
BACKUP_DATE=$(date -u +"%Y-%m-%d")
DUMP_FILE="backup-${BACKUP_DATE}.sql"
CHECKSUM_FILE="latest-checksum.txt"
MAX_BACKUPS=30

storage_api="${SUPABASE_URL}/storage/v1/object"
auth_header="Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}"

upload_file() {
  local local_path="$1"
  local remote_path="$2"
  local content_type="$3"

  curl --fail --silent --show-error \
    -X POST \
    -H "${auth_header}" \
    -H "Content-Type: ${content_type}" \
    --data-binary "@${local_path}" \
    "${storage_api}/${BUCKET_NAME}/${remote_path}" \
    -o /dev/null

  echo "Uploaded ${remote_path}"
}

upsert_file() {
  local local_path="$1"
  local remote_path="$2"
  local content_type="$3"

  curl --fail --silent --show-error \
    -X PUT \
    -H "${auth_header}" \
    -H "Content-Type: ${content_type}" \
    -H "x-upsert: true" \
    --data-binary "@${local_path}" \
    "${storage_api}/${BUCKET_NAME}/${remote_path}" \
    -o /dev/null

  echo "Upserted ${remote_path}"
}

download_file() {
  local remote_path="$1"
  local local_path="$2"

  http_code=$(curl --silent --output "${local_path}" --write-out "%{http_code}" \
    -H "${auth_header}" \
    "${storage_api}/${BUCKET_NAME}/${remote_path}")

  if [ "${http_code}" -eq 200 ]; then
    return 0
  else
    return 1
  fi
}

delete_file() {
  local remote_path="$1"

  curl --fail --silent --show-error \
    -X DELETE \
    -H "${auth_header}" \
    "${storage_api}/${BUCKET_NAME}/${remote_path}" \
    -o /dev/null
}

echo "==> Dumping database (data only)..."
PGPASSWORD="${SUPABASE_DB_PASSWORD}" pg_dump \
  --host "${SUPABASE_POOLER_HOST}" \
  --port 5432 \
  --username "postgres.${SUPABASE_PROJECT_REF}" \
  --dbname postgres \
  --data-only \
  --no-owner \
  --no-privileges \
  --no-comments \
  -f "${DUMP_FILE}"

echo "==> Computing checksum..."
new_checksum=$(sha256sum "${DUMP_FILE}" | awk '{print $1}')
echo "New checksum: ${new_checksum}"

previous_checksum=""
if download_file "${CHECKSUM_FILE}" "previous-checksum.txt"; then
  previous_checksum=$(cat "previous-checksum.txt")
  echo "Previous checksum: ${previous_checksum}"
else
  echo "No previous checksum found (first backup)"
fi

if [ "${new_checksum}" = "${previous_checksum}" ]; then
  echo "==> No changes detected, skipping upload"
  exit 0
fi

echo "==> Changes detected, uploading backup..."
upload_file "${DUMP_FILE}" "${DUMP_FILE}" "application/sql"

echo "${new_checksum}" > "new-checksum.txt"
upsert_file "new-checksum.txt" "${CHECKSUM_FILE}" "text/plain"

echo "==> Cleaning up old backups (keeping last ${MAX_BACKUPS})..."
backup_list=$(curl --fail --silent --show-error \
  -H "${auth_header}" \
  "${storage_api}/list/${BUCKET_NAME}" \
  -H "Content-Type: application/json" \
  -d '{"prefix":"backup-","sortBy":{"column":"name","order":"asc"}}')

backup_count=$(echo "${backup_list}" | jq 'length')

if [ "${backup_count}" -gt "${MAX_BACKUPS}" ]; then
  files_to_delete=$((backup_count - MAX_BACKUPS))
  echo "Removing ${files_to_delete} old backup(s)..."

  echo "${backup_list}" | jq -r ".[:${files_to_delete}][].name" | while read -r filename; do
    delete_file "${filename}"
    echo "Deleted ${filename}"
  done
fi

echo "==> Backup complete: ${DUMP_FILE}"
