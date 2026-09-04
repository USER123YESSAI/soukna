/**
 * Utilitaire de compression d'images côté client avant téléversement.
 * Réduit la taille des photos (ex: 4 Mo -> 100 Ko) en moins de 100ms
 * grâce à l'API Canvas native du navigateur.
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
  } = options;

  // Si ce n'est pas une image ou si c'est un SVG ou déjà très petit (< 200 Ko), on conserve l'original
  if (!file || !file.type?.startsWith('image/') || file.type === 'image/svg+xml' || file.size < 200 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        let { width, height } = img;

        // Calcul des dimensions proportionnelles
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight;
            height = Math.round((height * maxWidth) / img.width);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Fond blanc au cas où l'image aurait de la transparence
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Essayer en WebP d'abord, sinon JPEG
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // Si le blob compressé est plus lourd que l'original, garder l'original
              resolve(file);
              return;
            }

            const newFileName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            const compressedFile = new File([blob], newFileName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => resolve(file);
    };

    reader.onerror = () => resolve(file);
  });
}

/**
 * Compresse un tableau de fichiers ou FileList
 */
export async function compressImages(files, options = {}) {
  if (!files || files.length === 0) return [];
  const fileArray = Array.from(files);
  return Promise.all(fileArray.map((f) => compressImage(f, options)));
}
