// Utilidad para construir la URL completa de una imagen en S3
const BUCKET = process.env.REACT_APP_AWS_STORAGE_BUCKET_NAME || 'inventory-prd';
const S3_BASE = `https://${BUCKET}.s3.amazonaws.com/`;

function getS3Url(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return S3_BASE + path.replace(/^\//, '');
}

export default getS3Url;