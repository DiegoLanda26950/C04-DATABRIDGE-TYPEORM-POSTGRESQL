import { Injectable,NotFoundException,OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { Cancion } from './cancion.entity';
import { CreateCancionDto } from './create-cancion.dto';

@Injectable()
export class PlaylistsService implements OnModuleInit {
 constructor(
  @InjectRepository(Playlist) private readonly playlists:Repository<Playlist>,
  @InjectRepository(Cancion) private readonly canciones:Repository<Cancion>,
 ){}

 async onModuleInit(){
   if(await this.playlists.count()===0){
     const playlist=await this.playlists.save(
       this.playlists.create({nombre:'Entrenamiento'})
     );
     await this.canciones.save(
       this.canciones.create({
         titulo:'Run Boy Run',
         artista:'Woodkid',
         playlist,
       })
     );
   }
 }

 async findOne(id:number):Promise<Playlist>{
  const playlist=await this.playlists.findOne({
    where:{id},
    relations:{canciones:true},
    order:{canciones:{id:'ASC'}},
  });
  if(!playlist) throw new NotFoundException('Playlist no encontrada');
  return playlist;
 }

 async agregarCancion(dto:CreateCancionDto):Promise<Playlist>{
  // Primero buscamos la playlist: si no existe, lanza 404 y no se crea nada.
  const playlist=await this.findOne(dto.playlistId);
  await this.canciones.save(
    this.canciones.create({
      titulo:dto.titulo,
      artista:dto.artista,
      playlist,
    })
  );
  // Volvemos a consultar con relations para devolver la playlist actualizada.
  return this.findOne(dto.playlistId);
 }
}