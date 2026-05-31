import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { v2 as Cloudinary }
from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private cloudinary,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
  ) {

    return new Promise((resolve, reject) => {

      Cloudinary.uploader
        .upload_stream(
          {
            folder: 'recipes',
          },

          (error, result) => {

            if (error) {
              return reject(error);
            }

            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async uploadVideo(
    file: Express.Multer.File,
  ) {
    return new Promise((resolve, reject) => {
      Cloudinary.uploader
        .upload_stream(
          {
            folder: 'tutorials/videos',
            resource_type: 'video',
            chunk_size: 6000000,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async uploadThumbnail(
    file: Express.Multer.File,
  ) {
    return new Promise((resolve, reject) => {
      Cloudinary.uploader
        .upload_stream(
          {
            folder: 'tutorials/thumbnails',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}