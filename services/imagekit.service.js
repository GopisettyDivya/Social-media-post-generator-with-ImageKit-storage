import ImageKit from 'imagekit'
import axios from 'axios'
import crypto from 'crypto'

let _imagekit = null

function getImageKit() {
  if (!_imagekit) {
    _imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    })
  }
  return _imagekit
}

function getHashedFilename(sourceUrl) {
  return crypto.createHash('md5').update(sourceUrl).digest('hex')
}

export async function uploadBuffer(buffer, fileName, folder = '/') {
  try {
    const result = await getImageKit().upload({
      file: buffer,
      fileName,
      folder,
      useUniqueFileName: true,
      tags: ['user-upload', 'social-post'],
    })
    console.log('[ImageKit] Buffer upload success:', result.url)
    return {
      success: true,
      imageKitUrl: result.url,
      fileId: result.fileId,
      fileName: result.name,
      size: result.size,
    }
  } catch (err) {
    console.error('[ImageKit] Buffer upload error:', err.message)
    return { success: false, error: `Upload failed: ${err.message}` }
  }
}

export async function checkIfExists(sourceUrl) {
  const fileName = getHashedFilename(sourceUrl)
  try {
    const files = await getImageKit().listFiles({ name: fileName })
    if (files.length > 0) {
      return files[0].url
    }
  } catch (err) {
    console.error('[ImageKit] checkIfExists error:', err.message)
  }
  return null
}

export async function uploadImageFromURL(sourceUrl, folder = '/') {
  if (!sourceUrl.startsWith('http://') && !sourceUrl.startsWith('https://')) {
    return { success: false, error: 'Invalid URL. Must start with http:// or https://', originalUrl: sourceUrl }
  }

  const fileName = getHashedFilename(sourceUrl)

  try {
    const existing = await getImageKit().listFiles({ name: fileName })
    if (existing.length > 0) {
      console.log('[ImageKit] Found existing file:', existing[0].url)
      return {
        success: true,
        imageKitUrl: existing[0].url,
        fileId: existing[0].fileId,
        fileName,
        size: existing[0].size,
        originalUrl: sourceUrl,
      }
    }
  } catch (err) {
    console.error('[ImageKit] List check failed, continuing with upload:', err.message)
  }

  let response
  try {
    response = await axios.get(sourceUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      maxContentLength: 10 * 1024 * 1024,
    })
  } catch (err) {
    return { success: false, error: `Download failed: ${err.message}`, originalUrl: sourceUrl }
  }

  const contentType = response.headers['content-type'] || ''
  if (!contentType.startsWith('image/')) {
    return { success: false, error: `URL does not point to an image (content-type: ${contentType})`, originalUrl: sourceUrl }
  }

  try {
    const result = await getImageKit().upload({
      file: Buffer.from(response.data),
      fileName,
      folder,
      useUniqueFileName: false,
      tags: ['user-upload', 'social-post'],
    })

    console.log('[ImageKit] Upload success:', result.url)
    return {
      success: true,
      imageKitUrl: result.url,
      fileId: result.fileId,
      fileName: result.name,
      size: result.size,
      originalUrl: sourceUrl,
    }
  } catch (err) {
    console.error('[ImageKit] Upload error:', err.message)
    return { success: false, error: `Upload to ImageKit failed: ${err.message}`, originalUrl: sourceUrl }
  }
}
