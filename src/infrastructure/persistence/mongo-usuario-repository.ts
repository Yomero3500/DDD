import { IUsuarioRepository } from '../../domain/repositories/usuario-repository';
import { Usuario } from '../../domain/entities/user';
import { Perfil } from '../../domain/value-objects/perfil';
import { Rol, TipoRol } from '../../domain/value-objects/rol';
import mongoose, { Schema, Document } from 'mongoose';

interface IUsuarioDocument extends Document {
  nombre: string;
  email: string;
  contrasena: string;
  perfil: {
    idioma: string;
    zonaHoraria: string;
  };
  rol: string;
}

const UsuarioSchema = new Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contrasena: { type: String, required: true },
  perfil: {
    idioma: { type: String, required: true },
    zonaHoraria: { type: String, required: true }
  },
  rol: { type: String, required: true }
});

const UsuarioModel = mongoose.model<IUsuarioDocument>('Usuario', UsuarioSchema);

export class MongoUsuarioRepository implements IUsuarioRepository {
  async save(usuario: Usuario): Promise<void> {
    const usuarioDoc = new UsuarioModel({
      nombre: usuario.getNombre(),
      email: usuario.getEmail(),
      contrasena: usuario.getContrasena(),
      perfil: {
        idioma: usuario.getPerfil().getIdioma(),
        zonaHoraria: usuario.getPerfil().getZonaHoraria()
      },
      rol: usuario.getRol().getTipo()
    });
    await usuarioDoc.save();
  }

  async findById(id: string): Promise<Usuario | null> {
    const usuarioDoc = await UsuarioModel.findById(id);
    if (!usuarioDoc) {
      return null;
    }
    return this.toEntity(usuarioDoc);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuarioDoc = await UsuarioModel.findOne({ email });
    if (!usuarioDoc) {
      return null;
    }
    return this.toEntity(usuarioDoc);
  }

  async update(usuario: Usuario): Promise<void> {
    await UsuarioModel.updateOne(
      { _id: usuario.getId() },
      {
        nombre: usuario.getNombre(),
        email: usuario.getEmail(),
        perfil: {
          idioma: usuario.getPerfil().getIdioma(),
          zonaHoraria: usuario.getPerfil().getZonaHoraria()
        },
        rol: usuario.getRol().getTipo()
      }
    );
  }

  async delete(id: string): Promise<void> {
    await UsuarioModel.deleteOne({ _id: id });
  }

  private toEntity(doc: IUsuarioDocument): Usuario {
    return new Usuario(
      doc._id.toString(),
      doc.nombre,
      doc.email,
      doc.contrasena,
      new Perfil(doc.perfil.idioma, doc.perfil.zonaHoraria),
      new Rol(doc.rol as TipoRol)
    );
  }
}
